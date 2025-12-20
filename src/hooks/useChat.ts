import { useState, useCallback } from 'react';

export type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  metadata?: {
    roast_level?: number;
    mood?: string;
    response_type?: 'confused' | 'literal' | 'roast' | 'tangent';
  };
};

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/dumbai-chat`;

const parseMetadata = (content: string): { cleanContent: string; metadata?: Message['metadata'] } => {
  const jsonMatch = content.match(/```json\s*({[^`]+})\s*```/);
  if (jsonMatch) {
    try {
      const metadata = JSON.parse(jsonMatch[1]);
      const cleanContent = content.replace(/```json\s*{[^`]+}\s*```/, '').trim();
      return { cleanContent, metadata };
    } catch {
      return { cleanContent: content };
    }
  }
  return { cleanContent: content };
};

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentMetadata, setCurrentMetadata] = useState<Message['metadata']>();

  const sendMessage = useCallback(async (content: string) => {
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setCurrentMetadata(undefined);

    const messagesForApi = [...messages, userMessage].map(m => ({
      role: m.role,
      content: m.content,
    }));

    let assistantContent = '';
    const assistantId = crypto.randomUUID();

    try {
      const resp = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: messagesForApi }),
      });

      if (!resp.ok) {
        const error = await resp.json().catch(() => ({ error: 'Something went wrong!' }));
        throw new Error(error.error || 'Failed to get response');
      }

      if (!resp.body) throw new Error('No response body');

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = '';

      const updateAssistantMessage = (content: string, metadata?: Message['metadata']) => {
        setMessages(prev => {
          const last = prev[prev.length - 1];
          if (last?.id === assistantId) {
            return prev.map(m => m.id === assistantId ? { ...m, content, metadata } : m);
          }
          return [...prev, {
            id: assistantId,
            role: 'assistant' as const,
            content,
            timestamp: new Date(),
            metadata,
          }];
        });
      };

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        textBuffer += decoder.decode(value, { stream: true });
        
        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf('\n')) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (line.startsWith(':') || line.trim() === '') continue;
          if (!line.startsWith('data: ')) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') break;

          try {
            const parsed = JSON.parse(jsonStr);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) {
              assistantContent += delta;
              const { cleanContent, metadata } = parseMetadata(assistantContent);
              if (metadata) setCurrentMetadata(metadata);
              updateAssistantMessage(cleanContent, metadata);
            }
          } catch {
            textBuffer = line + '\n' + textBuffer;
            break;
          }
        }
      }

      // Final parse for metadata
      const { cleanContent, metadata } = parseMetadata(assistantContent);
      if (metadata) setCurrentMetadata(metadata);
      updateAssistantMessage(cleanContent, metadata);

    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: `Oops! DumbAI got TOO confused and broke something! 🤯 Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date(),
        metadata: { roast_level: 0, mood: '😵', response_type: 'confused' },
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [messages]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setCurrentMetadata(undefined);
  }, []);

  return {
    messages,
    isLoading,
    sendMessage,
    clearMessages,
    currentMetadata,
  };
};
