export type StarterCategory = 'everyday' | 'relationships' | 'tech' | 'random';

export interface ConversationStarter {
  id: string;
  text: string;
  category: StarterCategory;
  emoji: string;
}

export const conversationStarters: ConversationStarter[] = [
  // Everyday Questions
  { id: '1', text: "What's the weather like today?", category: 'everyday', emoji: '🌤️' },
  { id: '2', text: "Can you help me with my homework?", category: 'everyday', emoji: '📚' },
  { id: '3', text: "I'm feeling hungry", category: 'everyday', emoji: '🍕' },
  { id: '4', text: "I need a break", category: 'everyday', emoji: '☕' },
  { id: '5', text: "I'm on fire today!", category: 'everyday', emoji: '🔥' },
  
  // Relationship Advice
  { id: '6', text: "How do I ask someone out?", category: 'relationships', emoji: '💕' },
  { id: '7', text: "My crush doesn't notice me", category: 'relationships', emoji: '😢' },
  { id: '8', text: "I need dating tips", category: 'relationships', emoji: '💘' },
  { id: '9', text: "How do I break the ice?", category: 'relationships', emoji: '🧊' },
  { id: '10', text: "I'm falling for someone", category: 'relationships', emoji: '😍' },
  
  // Tech Help
  { id: '11', text: "My computer is slow", category: 'tech', emoji: '💻' },
  { id: '12', text: "How do I take a screenshot?", category: 'tech', emoji: '📸' },
  { id: '13', text: "I can't find my files", category: 'tech', emoji: '📁' },
  { id: '14', text: "My code has bugs", category: 'tech', emoji: '🐛' },
  { id: '15', text: "The internet is down", category: 'tech', emoji: '📶' },
  
  // Random Chaos
  { id: '16', text: "Tell me a joke", category: 'random', emoji: '😂' },
  { id: '17', text: "What's the meaning of life?", category: 'random', emoji: '🌌' },
  { id: '18', text: "I'm bored", category: 'random', emoji: '😴' },
  { id: '19', text: "You're so dumb", category: 'random', emoji: '🤪' },
  { id: '20', text: "Make me laugh", category: 'random', emoji: '🎭' },
];

export const categoryLabels: Record<StarterCategory, { label: string; emoji: string; color: string }> = {
  everyday: { label: 'Everyday', emoji: '☀️', color: 'from-accent to-success' },
  relationships: { label: 'Relationships', emoji: '💕', color: 'from-chaos to-primary' },
  tech: { label: 'Tech Help', emoji: '💻', color: 'from-secondary to-confused' },
  random: { label: 'Random Chaos', emoji: '🎲', color: 'from-roast to-destructive' },
};
