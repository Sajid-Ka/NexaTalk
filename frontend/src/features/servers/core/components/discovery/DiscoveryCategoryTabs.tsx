import React from 'react';
import { LayoutGrid } from 'lucide-react';
import { SERVER_TAGS, ServerTagIcons, ServerTag } from '../../../../../shared/constants/server.const';

interface DiscoveryCategoryTabsProps {
  activeCategory: string;
  onSelectCategory: (id: string) => void;
}

const DiscoveryCategoryTabs: React.FC<DiscoveryCategoryTabsProps> = ({ activeCategory, onSelectCategory }) => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
      <button
        onClick={() => onSelectCategory('all')}
        className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
          activeCategory === 'all'
            ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
            : 'bg-white/5 text-white/70 border border-white/5 hover:bg-white/10 hover:text-white'
        }`}
      >
        <LayoutGrid className="w-4 h-4" />
        All
      </button>

      {SERVER_TAGS.map((tag) => {
        const isActive = activeCategory === tag;
        return (
          <button
            key={tag}
            onClick={() => onSelectCategory(tag)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
              isActive
                ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                : 'bg-white/5 text-white/70 border border-white/5 hover:bg-white/10 hover:text-white'
            }`}
          >
            <span>{ServerTagIcons[tag as ServerTag]}</span>
            {tag}
          </button>
        );
      })}
    </div>
  );
};

export default DiscoveryCategoryTabs;
