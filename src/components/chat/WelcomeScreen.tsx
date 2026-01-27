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
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary/30 to-glow-secondary/30 flex items-center justify-center glow-primary animate-pulse-glow">
          <span className="text-4xl font-bold font-mono text-primary glow-text">N</span>
        </div>
        <div className="absolute -inset-4 bg-primary/10 rounded-full blur-2xl -z-10" />
      </div>

      {/* Title */}
      <h1 className="text-4xl font-bold mb-3">
        <span className="text-primary glow-text">NEXUS</span>
        <span className="text-foreground ml-2">AI</span>
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
            className="glass gradient-border group rounded-2xl p-5 text-left transition-all duration-300 hover:glow-primary hover:scale-[1.02]"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/30 transition-colors">
                <suggestion.icon className="w-6 h-6 text-primary" />
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
