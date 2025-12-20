import { useRef, useEffect } from 'react';
import { useChat } from '@/hooks/useChat';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { ChatHeader } from '@/components/ChatHeader';
import { ChatMessage } from '@/components/ChatMessage';
import { ChatInput } from '@/components/ChatInput';
import { ConversationStarters } from '@/components/ConversationStarters';
import { RoastMeter } from '@/components/RoastMeter';
import { MoodIndicator } from '@/components/MoodIndicator';

const Index = () => {
  const { messages, isLoading, sendMessage, clearMessages, currentMetadata } = useChat();
  const { playSound, soundEnabled, toggleSound } = useSoundEffects();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSend = (text: string) => {
    playSound('send');
    sendMessage(text);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (messages.length > 0 && messages[messages.length - 1].role === 'assistant') {
      const roastLevel = currentMetadata?.roast_level || 0;
      if (roastLevel > 60) {
        playSound('roast');
      } else {
        playSound('receive');
      }
    }
  }, [messages.length, currentMetadata, playSound]);

  return (
    <div className="min-h-screen flex flex-col p-4 md:p-6 max-w-5xl mx-auto">
      <ChatHeader
        soundEnabled={soundEnabled}
        onToggleSound={toggleSound}
        onClearChat={clearMessages}
        messagesCount={messages.length}
      />

      <div className="flex-1 flex flex-col lg:flex-row gap-4 mt-4 overflow-hidden">
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col glass rounded-2xl overflow-hidden">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-8">
                <div className="text-6xl mb-4 animate-float">🤪</div>
                <h2 className="text-2xl font-display font-bold gradient-text mb-2">Welcome to DumbAI!</h2>
                <p className="text-muted-foreground max-w-md">
                  I'm the AI that tries its best... and fails spectacularly. Pick a starter or type something!
                </p>
              </div>
            ) : (
              messages.map((msg, i) => (
                <ChatMessage key={msg.id} message={msg} isLatest={i === messages.length - 1} />
              ))
            )}
            {isLoading && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-chaos flex items-center justify-center animate-spin-slow">🤪</div>
                <span className="text-sm animate-pulse">DumbAI is thinking really hard... 🧠💨</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border/30">
            <ChatInput onSend={handleSend} disabled={isLoading} onTyping={() => playSound('typing')} />
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:w-80 flex flex-col gap-4">
          <div className="glass rounded-2xl p-4">
            <RoastMeter level={currentMetadata?.roast_level || 0} />
          </div>
          <div className="glass rounded-2xl p-4">
            <MoodIndicator mood={currentMetadata?.mood || '🤔'} responseType={currentMetadata?.response_type} />
          </div>
          <div className="glass rounded-2xl p-4 flex-1 overflow-y-auto">
            <h3 className="font-display font-semibold mb-3 text-foreground">Try These! 👇</h3>
            <ConversationStarters onSelect={handleSend} disabled={isLoading} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
