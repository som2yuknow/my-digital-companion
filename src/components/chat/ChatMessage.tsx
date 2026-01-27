import ReactMarkdown from 'react-markdown';
import { Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Message } from '@/hooks/useChat';

interface ChatMessageProps {
  message: Message;
  isStreaming?: boolean;
}

export function ChatMessage({ message, isStreaming }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div
      className={cn(
        'flex gap-4 animate-fade-in',
        isUser ? 'flex-row-reverse' : 'flex-row'
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          'flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center',
          isUser
            ? 'bg-primary/20 text-primary'
            : 'bg-gradient-to-br from-primary/30 to-glow-secondary/30 glow-primary'
        )}
      >
        {isUser ? (
          <User className="w-5 h-5" />
        ) : (
          <Bot className="w-5 h-5 text-primary" />
        )}
      </div>

      {/* Message Content */}
      <div
        className={cn(
          'flex-1 max-w-[80%] rounded-2xl px-5 py-4',
          isUser
            ? 'bg-primary text-primary-foreground rounded-tr-md'
            : 'glass rounded-tl-md'
        )}
      >
        <div
          className={cn(
            'prose prose-invert max-w-none',
            isUser ? 'prose-p:text-primary-foreground' : 'prose-p:text-foreground',
            'prose-headings:text-foreground prose-headings:font-semibold',
            'prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-primary prose-code:font-mono prose-code:text-sm',
            'prose-pre:bg-muted prose-pre:border prose-pre:border-border prose-pre:rounded-lg',
            'prose-a:text-primary prose-a:no-underline hover:prose-a:underline',
            'prose-strong:text-primary',
            isStreaming && !isUser && 'typing-cursor'
          )}
        >
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
