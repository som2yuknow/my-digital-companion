import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface Conversation {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch all conversations
  const fetchConversations = useCallback(async () => {
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching conversations:', error);
      return;
    }

    setConversations(data || []);
  }, []);

  // Load messages for a conversation
  const loadConversation = useCallback(async (conversationId: string) => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error loading messages:', error);
      return;
    }

    setMessages(
      (data || []).map((m) => ({
        id: m.id,
        role: m.role as 'user' | 'assistant',
        content: m.content,
        timestamp: new Date(m.created_at),
      }))
    );
    setCurrentConversationId(conversationId);
  }, []);

  // Create new conversation
  const createConversation = useCallback(async (firstMessage: string): Promise<string | null> => {
    const title = firstMessage.slice(0, 50) + (firstMessage.length > 50 ? '...' : '');
    
    const { data, error } = await supabase
      .from('conversations')
      .insert({ title })
      .select()
      .single();

    if (error) {
      console.error('Error creating conversation:', error);
      return null;
    }

    setCurrentConversationId(data.id);
    await fetchConversations();
    return data.id;
  }, [fetchConversations]);

  // Save message to database
  const saveMessage = useCallback(async (conversationId: string, role: 'user' | 'assistant', content: string) => {
    const { error } = await supabase
      .from('messages')
      .insert({ conversation_id: conversationId, role, content });

    if (error) {
      console.error('Error saving message:', error);
    }
  }, []);

  // Delete conversation
  const deleteConversation = useCallback(async (conversationId: string) => {
    const { error } = await supabase
      .from('conversations')
      .delete()
      .eq('id', conversationId);

    if (error) {
      console.error('Error deleting conversation:', error);
      toast.error('Failed to delete conversation');
      return;
    }

    if (currentConversationId === conversationId) {
      setCurrentConversationId(null);
      setMessages([]);
    }
    await fetchConversations();
    toast.success('Conversation deleted');
  }, [currentConversationId, fetchConversations]);

  // Start new chat
  const newChat = useCallback(() => {
    setCurrentConversationId(null);
    setMessages([]);
  }, []);

  // Send message
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;

    let conversationId = currentConversationId;

    // Create conversation if needed
    if (!conversationId) {
      conversationId = await createConversation(content);
      if (!conversationId) {
        toast.error('Failed to start conversation');
        return;
      }
    }

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Save user message
    await saveMessage(conversationId, 'user', content.trim());

    let assistantContent = '';

    const updateAssistant = (chunk: string) => {
      assistantContent += chunk;
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last?.role === 'assistant') {
          return prev.map((m, i) =>
            i === prev.length - 1 ? { ...m, content: assistantContent } : m
          );
        }
        return [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: 'assistant',
            content: assistantContent,
            timestamp: new Date(),
          },
        ];
      });
    };

    try {
      const apiMessages = [...messages, userMessage].map(m => ({
        role: m.role,
        content: m.content,
      }));

      const response = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: apiMessages }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          toast.error('Rate limit exceeded. Please wait a moment and try again.');
          setIsLoading(false);
          return;
        }
        if (response.status === 402) {
          toast.error('Usage limit reached. Please add credits to continue.');
          setIsLoading(false);
          return;
        }
        throw new Error('Failed to get response');
      }

      if (!response.body) {
        throw new Error('No response body');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf('\n')) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (line.startsWith(':') || line.trim() === '') continue;
          if (!line.startsWith('data: ')) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') break;

          try {
            const parsed = JSON.parse(jsonStr);
            const deltaContent = parsed.choices?.[0]?.delta?.content;
            if (deltaContent) updateAssistant(deltaContent);
          } catch {
            textBuffer = line + '\n' + textBuffer;
            break;
          }
        }
      }

      // Flush remaining buffer
      if (textBuffer.trim()) {
        for (let raw of textBuffer.split('\n')) {
          if (!raw) continue;
          if (raw.endsWith('\r')) raw = raw.slice(0, -1);
          if (raw.startsWith(':') || raw.trim() === '') continue;
          if (!raw.startsWith('data: ')) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === '[DONE]') continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const deltaContent = parsed.choices?.[0]?.delta?.content;
            if (deltaContent) updateAssistant(deltaContent);
          } catch {
            /* ignore */
          }
        }
      }

      // Save assistant message
      if (assistantContent && conversationId) {
        await saveMessage(conversationId, 'assistant', assistantContent);
        await fetchConversations();
      }
    } catch (error) {
      console.error('Chat error:', error);
      toast.error('Failed to send message. Please try again.');
      setMessages(prev => prev.filter(m => m.id !== userMessage.id));
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading, currentConversationId, createConversation, saveMessage, fetchConversations]);

  // Initial fetch
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  return {
    messages,
    conversations,
    currentConversationId,
    isLoading,
    sendMessage,
    loadConversation,
    deleteConversation,
    newChat,
    fetchConversations,
  };
}
