import { Trash2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatHeaderProps {
  messageCount: number;
  onClear: () => void;
}

export function ChatHeader({ messageCount, onClear }: ChatHeaderProps) {
  return (
    <header className="glass border-b border-border/50 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/30 to-glow-secondary/30 flex items-center justify-center glow-primary">
          <span className="text-lg font-bold font-mono text-primary">N</span>
        </div>
        <div>
          <h1 className="font-semibold text-foreground flex items-center gap-2">
            NEXUS AI
            <Sparkles className="w-4 h-4 text-primary" />
          </h1>
          <p className="text-xs text-muted-foreground">Powered by Gemini</p>
        </div>
      </div>

      {messageCount > 0 && (
        <button
          onClick={onClear}
          className={cn(
            'flex items-center gap-2 px-3 py-2 rounded-xl',
            'text-sm text-muted-foreground',
            'hover:bg-destructive/20 hover:text-destructive',
            'transition-all duration-200'
          )}
        >
          <Trash2 className="w-4 h-4" />
          <span className="hidden sm:inline">Clear</span>
        </button>
      )}
    </header>
  );
}
