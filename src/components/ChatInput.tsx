import { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  onTyping?: () => void;
}

export const ChatInput = ({ onSend, disabled, onTyping }: ChatInputProps) => {
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput('');
    }
  };

  const handleKeyPress = () => {
    onTyping?.();
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, [disabled]);

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="flex items-center gap-3 rounded-2xl bg-card/80 p-2 shadow-lg border border-border/50 backdrop-blur-xl glass-strong">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Say something to confuse DumbAI... 🤔"
          disabled={disabled}
          className="flex-1 bg-transparent px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed"
        />
        
        <button
          type="submit"
          disabled={disabled || !input.trim()}
          className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-chaos text-primary-foreground shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 glow-primary"
        >
          {disabled ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </div>
    </form>
  );
};
