import { Trash2, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatHeaderProps {
  messageCount: number;
  onClear: () => void;
  onNewChat: () => void;
}

export function ChatHeader({ messageCount, onClear, onNewChat }: ChatHeaderProps) {
  return (
    <header className="glass border-b border-border px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold font-mono text-lg">
          J
        </div>
        <div>
          <h1 className="font-semibold text-foreground">JEFF</h1>
          <p className="text-xs text-muted-foreground">Your personal AI</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onNewChat}
          className={cn(
            'flex items-center gap-2 px-3 py-2 rounded-xl',
            'text-sm text-muted-foreground',
            'hover:bg-secondary hover:text-foreground',
            'transition-all duration-200'
          )}
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">New</span>
        </button>

        {messageCount > 0 && (
          <button
            onClick={onClear}
            className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-xl',
              'text-sm text-muted-foreground',
              'hover:bg-destructive/10 hover:text-destructive',
              'transition-all duration-200'
            )}
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        )}
      </div>
    </header>
  );
}
