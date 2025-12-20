import { Message } from '@/hooks/useChat';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  message: Message;
  isLatest?: boolean;
}

export const ChatMessage = ({ message, isLatest }: ChatMessageProps) => {
  const isUser = message.role === 'user';
  
  return (
    <div
      className={cn(
        'flex w-full gap-3 animate-slide-up',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      {/* Avatar for AI */}
      {!isUser && (
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-primary to-chaos flex items-center justify-center text-xl shadow-lg glow-primary">
          🤪
        </div>
      )}
      
      {/* Message Bubble */}
      <div
        className={cn(
          'max-w-[80%] rounded-2xl px-4 py-3 shadow-md',
          isUser
            ? 'bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-br-md'
            : 'glass bg-card/90 text-foreground rounded-bl-md border border-border/50',
          isLatest && !isUser && 'animate-bounce-in'
        )}
      >
        <p className="text-sm md:text-base whitespace-pre-wrap leading-relaxed">
          {message.content}
        </p>
        
        {/* Metadata indicators for AI messages */}
        {!isUser && message.metadata && (
          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-border/30">
            {message.metadata.mood && (
              <span className="text-lg" title="Detected mood">
                {message.metadata.mood}
              </span>
            )}
            {message.metadata.response_type && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-muted/50 text-muted-foreground">
                {message.metadata.response_type}
              </span>
            )}
          </div>
        )}
      </div>
      
      {/* Avatar for User */}
      {isUser && (
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-secondary to-confused flex items-center justify-center text-xl shadow-lg">
          😎
        </div>
      )}
    </div>
  );
};
