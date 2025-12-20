import { Volume2, VolumeX, Trash2 } from 'lucide-react';

interface ChatHeaderProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  onClearChat: () => void;
  messagesCount: number;
}

export const ChatHeader = ({ soundEnabled, onToggleSound, onClearChat, messagesCount }: ChatHeaderProps) => {
  return (
    <header className="flex items-center justify-between px-4 py-3 glass-strong rounded-2xl">
      {/* Logo & Title */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary via-chaos to-roast flex items-center justify-center text-2xl shadow-lg glow-primary animate-bounce-slow">
          🤪
        </div>
        <div>
          <h1 className="text-xl font-display font-bold gradient-text">DumbAI</h1>
          <p className="text-xs text-muted-foreground">The AI that tries its best... and fails 😵</p>
        </div>
      </div>
      
      {/* Controls */}
      <div className="flex items-center gap-2">
        {/* Sound Toggle */}
        <button
          onClick={onToggleSound}
          className="flex items-center justify-center w-10 h-10 rounded-xl bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200"
          title={soundEnabled ? 'Mute sounds' : 'Enable sounds'}
        >
          {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </button>
        
        {/* Clear Chat */}
        {messagesCount > 0 && (
          <button
            onClick={onClearChat}
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-muted/50 text-muted-foreground hover:bg-destructive/20 hover:text-destructive transition-all duration-200"
            title="Clear chat"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        )}
      </div>
    </header>
  );
};
