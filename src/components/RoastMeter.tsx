interface RoastMeterProps {
  level: number;
  className?: string;
}

export const RoastMeter = ({ level, className = '' }: RoastMeterProps) => {
  const getLabel = () => {
    if (level < 20) return 'Chill 😌';
    if (level < 40) return 'Warming Up 🌡️';
    if (level < 60) return 'Getting Spicy 🌶️';
    if (level < 80) return 'On Fire 🔥';
    return 'FULL SAVAGE 💀';
  };

  const getGradient = () => {
    if (level < 40) return 'from-secondary to-confused';
    if (level < 70) return 'from-accent to-roast';
    return 'from-roast to-destructive';
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-foreground/80">Roast Meter</span>
        <span className="font-display font-semibold text-foreground">{getLabel()}</span>
      </div>
      
      <div className="relative h-4 w-full overflow-hidden rounded-full bg-muted/50 glass">
        {/* Background flames for high roast levels */}
        {level > 60 && (
          <div className="absolute inset-0 flex items-end justify-around">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="animate-flame opacity-60"
                style={{
                  width: '12%',
                  height: `${30 + Math.random() * 40}%`,
                  background: 'linear-gradient(to top, hsl(var(--roast)), hsl(var(--accent)), transparent)',
                  borderRadius: '50% 50% 20% 20%',
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
          </div>
        )}
        
        {/* Progress bar */}
        <div
          className={`absolute inset-y-0 left-0 bg-gradient-to-r ${getGradient()} transition-all duration-500 ease-out`}
          style={{ width: `${Math.min(level, 100)}%` }}
        >
          {level > 30 && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-foreground/20 to-transparent animate-pulse" />
          )}
        </div>
        
        {/* Glowing end cap */}
        {level > 0 && (
          <div
            className="absolute top-1/2 h-6 w-6 -translate-y-1/2 rounded-full transition-all duration-500"
            style={{
              left: `calc(${Math.min(level, 100)}% - 12px)`,
              background: level > 60 ? 'hsl(var(--roast))' : 'hsl(var(--primary))',
              boxShadow: level > 60 
                ? '0 0 20px hsl(var(--roast)), 0 0 40px hsl(var(--roast-glow))' 
                : '0 0 15px hsl(var(--primary))',
            }}
          />
        )}
      </div>
      
      {/* Scale markers */}
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>😇</span>
        <span>🌶️</span>
        <span>🔥</span>
        <span>💀</span>
      </div>
    </div>
  );
};
