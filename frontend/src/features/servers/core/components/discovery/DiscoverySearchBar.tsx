import React, { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import Button from '../../../../../shared/ui/Button';

interface DiscoverySearchBarProps {
  onJoinClick: () => void;
  onSearch?: (query: string) => void;
}

const DiscoverySearchBar: React.FC<DiscoverySearchBarProps> = ({ onJoinClick, onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  return (
    <div className="flex items-center gap-4 w-full max-w-3xl mt-8">
      <div className="relative flex-1">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
        <input
          type="text"
          value={query}
          onChange={handleSearch}
          placeholder="Explore servers like 'Valorant', 'Music', or 'Chill'..."
          className="w-full h-12 bg-[#090B11] border border-white/5 rounded-xl pl-12 pr-4 text-white placeholder:text-white/40 focus:outline-none focus:border-indigo-500/50 transition-colors"
        />
      </div>
      <Button
        variant="primary"
        onClick={onJoinClick}
        className="h-12 px-6 whitespace-nowrap bg-indigo-600 hover:bg-indigo-700"
      >
        <Plus className="w-5 h-5 mr-2" />
        Join via Link
      </Button>
    </div>
  );
};

export default DiscoverySearchBar;
