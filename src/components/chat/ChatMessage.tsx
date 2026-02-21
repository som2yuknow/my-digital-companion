import { useState, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import { Bot, User, Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Message } from '@/hooks/useChat';

interface ChatMessageProps {
  message: Message;
  isStreaming?: boolean;
}

export function ChatMessage({ message, isStreaming }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const [isSpeaking, setIsSpeaking] = useState(false);

  const toggleSpeak = useCallback(() => {
    if (isSpeaking) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    // Strip markdown for cleaner speech
    const plainText = message.content
      .replace(/```[\s\S]*?```/g, 'code block omitted')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/[#*_~\[\]()>]/g, '')
      .replace(/\n+/g, '. ')
      .trim();

    const utterance = new SpeechSynthesisUtterance(plainText);
    utterance.rate = 1;
    utterance.pitch = 0.9;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  }, [message.content, isSpeaking]);

  return (
    <div
      className={cn(
        'flex gap-4 animate-fade-in group',
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

        {/* Speak button for assistant messages */}
        {!isUser && !isStreaming && message.content && (
          <button
            onClick={toggleSpeak}
            className={cn(
              'mt-2 flex items-center gap-1.5 text-xs transition-opacity duration-200',
              'text-muted-foreground hover:text-foreground',
              'opacity-0 group-hover:opacity-100',
              isSpeaking && 'opacity-100 text-foreground'
            )}
            title={isSpeaking ? 'Stop speaking' : 'Read aloud'}
          >
            {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            {isSpeaking ? 'Stop' : 'Read aloud'}
          </button>
        )}
      </div>
    </div>
  );
}
