import { Code2, TrendingUp, MessageCircle, Sparkles } from 'lucide-react';

interface WelcomeScreenProps {
  onSuggestionClick: (suggestion: string) => void;
}

const suggestions = [
  {
    icon: Code2,
    title: 'Code',
    description: 'Write, debug, or explain code',
    prompt: 'Help me write a Python script that fetches data from an API and saves it to a CSV file',
  },
  {
    icon: TrendingUp,
    title: 'Trading',
    description: 'Strategies & market analysis',
    prompt: 'Explain the RSI indicator and how to use it for trading decisions',
  },
  {
    icon: MessageCircle,
    title: 'Chat',
    description: 'General conversation',
    prompt: 'What are some effective techniques for learning new skills faster?',
  },
  {
    icon: Sparkles,
    title: 'Create',
    description: 'Brainstorm & ideas',
    prompt: 'Help me brainstorm ideas for a side project that could generate passive income',
  },
];

export function WelcomeScreen({ onSuggestionClick }: WelcomeScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-4 animate-fade-in">
      {/* Logo */}
      <div className="relative mb-8">
        <div className="w-24 h-24 rounded-3xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg">
          <span className="text-5xl font-bold font-mono">J</span>
        </div>
      </div>

      {/* Title */}
      <h1 className="text-4xl font-bold mb-3 text-foreground">
        JEFF
      </h1>
      
      <p className="text-muted-foreground text-lg mb-8 max-w-md">
        Your personal AI assistant for coding, trading, and everything in between.
      </p>

      {/* Suggestions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl w-full">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion.title}
            onClick={() => onSuggestionClick(suggestion.prompt)}
            className="glass group rounded-2xl p-5 text-left transition-all duration-200 hover:bg-secondary hover:scale-[1.02]"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <suggestion.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">{suggestion.title}</h3>
                <p className="text-sm text-muted-foreground">{suggestion.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
