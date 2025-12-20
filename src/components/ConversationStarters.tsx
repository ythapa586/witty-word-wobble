import { useState } from 'react';
import { conversationStarters, categoryLabels, StarterCategory } from '@/data/conversationStarters';

interface ConversationStartersProps {
  onSelect: (text: string) => void;
  disabled?: boolean;
}

export const ConversationStarters = ({ onSelect, disabled }: ConversationStartersProps) => {
  const [activeCategory, setActiveCategory] = useState<StarterCategory>('everyday');

  const filteredStarters = conversationStarters.filter(s => s.category === activeCategory);

  return (
    <div className="flex flex-col gap-4">
      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        {(Object.keys(categoryLabels) as StarterCategory[]).map(category => {
          const { label, emoji, color } = categoryLabels[category];
          const isActive = activeCategory === category;
          
          return (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${
                isActive
                  ? `bg-gradient-to-r ${color} text-primary-foreground glow-primary`
                  : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <span>{emoji}</span>
              <span>{label}</span>
            </button>
          );
        })}
      </div>
      
      {/* Starter Bubbles */}
      <div className="flex flex-wrap gap-2">
        {filteredStarters.map((starter, index) => (
          <button
            key={starter.id}
            onClick={() => !disabled && onSelect(starter.text)}
            disabled={disabled}
            className="group flex items-center gap-2 rounded-2xl bg-card/80 px-4 py-2.5 text-sm font-medium text-foreground/90 shadow-sm border border-border/50 backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:shadow-md hover:border-primary/30 hover:bg-card disabled:opacity-50 disabled:cursor-not-allowed animate-pop"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <span className="text-lg group-hover:animate-wiggle">{starter.emoji}</span>
            <span>{starter.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
