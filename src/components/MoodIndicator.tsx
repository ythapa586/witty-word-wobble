interface MoodIndicatorProps {
  mood: string;
  responseType?: 'confused' | 'literal' | 'roast' | 'tangent';
  className?: string;
}

export const MoodIndicator = ({ mood, responseType, className = '' }: MoodIndicatorProps) => {
  const getResponseLabel = () => {
    switch (responseType) {
      case 'confused': return 'Confused Mode 🤷';
      case 'literal': return 'Literal Mode 📖';
      case 'roast': return 'Roast Mode 🔥';
      case 'tangent': return 'Tangent Mode 🌀';
      default: return 'Thinking... 💭';
    }
  };

  const getBackgroundClass = () => {
    switch (responseType) {
      case 'roast': return 'bg-gradient-to-br from-roast/20 to-destructive/20 border-roast/30';
      case 'confused': return 'bg-gradient-to-br from-confused/20 to-secondary/20 border-confused/30';
      case 'literal': return 'bg-gradient-to-br from-accent/20 to-success/20 border-accent/30';
      case 'tangent': return 'bg-gradient-to-br from-chaos/20 to-primary/20 border-chaos/30';
      default: return 'bg-muted/50 border-border';
    }
  };

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {/* User Mood */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-foreground/80">Your Vibe:</span>
        <div className="flex items-center gap-2 rounded-full bg-muted/50 px-3 py-1.5 glass">
          <span className="text-2xl animate-bounce-slow">{mood || '🤔'}</span>
        </div>
      </div>
      
      {/* Response Type */}
      <div className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition-all duration-300 ${getBackgroundClass()}`}>
        <span className="text-sm font-medium text-foreground/80">DumbAI Mode:</span>
        <span className="font-display font-semibold text-foreground animate-pop">
          {getResponseLabel()}
        </span>
      </div>
    </div>
  );
};
