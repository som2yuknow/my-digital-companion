import { useRef, useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useChat } from '@/hooks/useChat';
import { ChatHeader } from '@/components/chat/ChatHeader';
import { ChatMessage } from '@/components/chat/ChatMessage';
import { ChatInput } from '@/components/chat/ChatInput';
import { WelcomeScreen } from '@/components/chat/WelcomeScreen';
import { ChatSidebar } from '@/components/chat/ChatSidebar';
import { cn } from '@/lib/utils';

const Index = () => {
  const {
    messages,
    conversations,
    currentConversationId,
    isLoading,
    sendMessage,
    loadConversation,
    deleteConversation,
    newChat,
  } = useChat();
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          'fixed lg:relative inset-y-0 left-0 z-50 transform transition-transform duration-300 lg:transform-none',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <ChatSidebar
          conversations={conversations}
          currentId={currentConversationId}
          onSelect={(id) => {
            loadConversation(id);
            setSidebarOpen(false);
          }}
          onDelete={deleteConversation}
          onNew={() => {
            newChat();
            setSidebarOpen(false);
          }}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="glass border-b border-border px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold font-mono text-lg">
              J
            </div>
            <div>
              <h1 className="font-semibold text-foreground">JEFF</h1>
              <p className="text-xs text-muted-foreground">Your personal AI</p>
            </div>
          </div>
        </header>

        {/* Messages Area */}
        <main className="flex-1 overflow-y-auto scrollbar-thin px-4 py-6">
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
        <footer className="border-t border-border bg-surface-overlay/50 backdrop-blur-sm px-4 py-4">
          <div className="max-w-4xl mx-auto">
            <ChatInput
              onSend={sendMessage}
              isLoading={isLoading}
              placeholder="Ask about coding, trading, or anything else..."
            />
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
