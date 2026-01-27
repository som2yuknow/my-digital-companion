import { MessageSquare, Trash2, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Conversation } from '@/hooks/useChat';

interface ChatSidebarProps {
  conversations: Conversation[];
  currentId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onNew: () => void;
}

export function ChatSidebar({ conversations, currentId, onSelect, onDelete, onNew }: ChatSidebarProps) {
  return (
    <aside className="w-72 h-full glass border-r border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <button
          onClick={onNew}
          className={cn(
            'w-full flex items-center gap-3 px-4 py-3 rounded-xl',
            'bg-primary text-primary-foreground',
            'hover:opacity-90 transition-opacity',
            'font-medium'
          )}
        >
          <Plus className="w-5 h-5" />
          New Chat
        </button>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin p-3 space-y-1">
        {conversations.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No conversations yet
          </p>
        ) : (
          conversations.map((conv) => (
            <div
              key={conv.id}
              className={cn(
                'group flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer',
                'transition-colors duration-150',
                currentId === conv.id
                  ? 'bg-secondary text-foreground'
                  : 'hover:bg-secondary/50 text-muted-foreground hover:text-foreground'
              )}
              onClick={() => onSelect(conv.id)}
            >
              <MessageSquare className="w-4 h-4 flex-shrink-0" />
              <span className="flex-1 truncate text-sm">{conv.title}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(conv.id);
                }}
                className={cn(
                  'opacity-0 group-hover:opacity-100',
                  'p-1.5 rounded-lg',
                  'hover:bg-destructive/10 hover:text-destructive',
                  'transition-all duration-150'
                )}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <p className="text-xs text-muted-foreground text-center">
          Powered by Gemini AI
        </p>
      </div>
    </aside>
  );
}
