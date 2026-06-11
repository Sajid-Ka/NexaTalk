import InterestCard from '../../../../../shared/ui/InterestCard';
import {
  Gamepad2,
  Music,
  GraduationCap,
  Code,
  Clapperboard,
  Tv,
  Palette,
  Trophy,
} from 'lucide-react';
import React from 'react';

interface DisplayInterest {
  name: string;
  icon: React.ReactNode;
}

const DEFAULT_INTERESTS: DisplayInterest[] = [
  { name: 'Gaming', icon: <Gamepad2 /> },
  { name: 'Music', icon: <Music /> },
  { name: 'Movies', icon: <Clapperboard /> },
  { name: 'TV Series', icon: <Tv /> },
  { name: 'Programming & Technology', icon: <Code /> },
  { name: 'Sports', icon: <Trophy /> },
  { name: 'Education & Learning', icon: <GraduationCap /> },
  { name: 'Art & Creativity', icon: <Palette /> },
];

interface InterestsSettingsProps {
  selectedInterests: string[];
  onChange: (interests: string[]) => void;
}

export default function InterestsSettings({ selectedInterests, onChange }: InterestsSettingsProps) {
  const toggleInterest = (name: string) => {
    const lowerName = name.toLowerCase();
    let newInterests;
    if (selectedInterests.includes(lowerName)) {
      // Don't allow removing the last interest
      if (selectedInterests.length <= 1) return;
      newInterests = selectedInterests.filter(i => i !== lowerName);
    } else {
      // Don't allow adding more than 8
      if (selectedInterests.length >= 8) return;
      newInterests = [...selectedInterests, lowerName];
    }
    onChange(newInterests);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-white mb-2">My Interests</h3>
        <p className="text-sm text-white/40 mb-6">
          Select up to 8 topics. You must have at least 1 interest selected.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {DEFAULT_INTERESTS.map((interest) => (
          <InterestCard
            key={interest.name}
            label={interest.name}
            icon={interest.icon}
            selected={selectedInterests.includes(interest.name.toLowerCase())}
            onClick={() => toggleInterest(interest.name)}
          />
        ))}
      </div>
    </div>
  );
}
