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
            ? 'bg-primary text-primary-foreground'
            : 'bg-secondary text-foreground'
        )}
      >
        {isUser ? (
          <User className="w-5 h-5" />
        ) : (
          <span className="font-bold font-mono text-sm">J</span>
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
            'prose max-w-none',
            isUser ? 'prose-invert' : '',
            'prose-headings:text-inherit prose-headings:font-semibold',
            'prose-code:bg-secondary prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-code:text-sm prose-code:text-inherit',
            'prose-pre:bg-secondary prose-pre:border prose-pre:border-border prose-pre:rounded-lg',
            'prose-a:text-inherit prose-a:underline',
            'prose-p:text-inherit prose-li:text-inherit prose-strong:text-inherit',
            isStreaming && !isUser && 'typing-cursor'
          )}
        >
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
