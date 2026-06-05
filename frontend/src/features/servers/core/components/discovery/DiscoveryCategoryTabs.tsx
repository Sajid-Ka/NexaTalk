import React from 'react';
import { LayoutGrid, Gamepad2, Music, GraduationCap, FlaskConical, Palette } from 'lucide-react';

export interface Category {
  id: string;
  label: string;
  icon: React.ElementType;
}

const DISCOVERY_CATEGORIES: Category[] = [
  { id: 'all', label: 'All', icon: LayoutGrid },
  { id: 'gaming', label: 'Gaming', icon: Gamepad2 },
  { id: 'music', label: 'Music', icon: Music },
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'science', label: 'Science & Tech', icon: FlaskConical },
  { id: 'creators', label: 'Creators', icon: Palette },
];

interface DiscoveryCategoryTabsProps {
  activeCategory: string;
  onSelectCategory: (id: string) => void;
}

const DiscoveryCategoryTabs: React.FC<DiscoveryCategoryTabsProps> = ({ activeCategory, onSelectCategory }) => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
      {DISCOVERY_CATEGORIES.map((category) => {
        const Icon = category.icon;
        const isActive = activeCategory === category.id;
        return (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
              isActive
                ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                : 'bg-white/5 text-white/70 border border-white/5 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Icon className="w-4 h-4" />
            {category.label}
          </button>
        );
      })}
    </div>
  );
};

export default DiscoveryCategoryTabs;
