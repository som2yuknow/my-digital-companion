import { useRef, useEffect } from 'react';
import { useChat } from '@/hooks/useChat';
import { ChatHeader } from '@/components/chat/ChatHeader';
import { ChatMessage } from '@/components/chat/ChatMessage';
import { ChatInput } from '@/components/chat/ChatInput';
import { WelcomeScreen } from '@/components/chat/WelcomeScreen';
import { cn } from '@/lib/utils';

const Index = () => {
  const { messages, isLoading, sendMessage, clearMessages } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-glow-secondary/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <ChatHeader messageCount={messages.length} onClear={clearMessages} />

      {/* Messages Area */}
      <main
        className={cn(
          'flex-1 overflow-y-auto scrollbar-thin',
          'px-4 py-6'
        )}
      >
        <div className="max-w-4xl mx-auto h-full">
          {messages.length === 0 ? (
            <WelcomeScreen onSuggestionClick={sendMessage} />
          ) : (
            <div className="space-y-6">
              {messages.map((message, index) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  isStreaming={isLoading && index === messages.length - 1 && message.role === 'assistant'}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </main>

      {/* Input Area */}
      <footer className="border-t border-border/50 bg-surface-overlay/50 backdrop-blur-sm px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <ChatInput
            onSend={sendMessage}
            isLoading={isLoading}
            placeholder="Ask about coding, trading, or anything else..."
          />
        </div>
      </footer>
    </div>
  );
};

export default Index;
