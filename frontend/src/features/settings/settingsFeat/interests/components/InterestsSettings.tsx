import InterestCard from '../../../../../shared/ui/InterestCard';
import { INTERESTS, INTEREST_LABELS } from '../../../../../shared/constants/interests.const';
import type { Interest } from '../../../../../shared/constants/interests.const';
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
  id: Interest;
  label: string;
  icon: React.ReactNode;
}

const DEFAULT_INTERESTS: DisplayInterest[] = [
  {
    id: INTERESTS.GAMING,
    label: INTEREST_LABELS.GAMING,
    icon: <Gamepad2 />,
  },
  {
    id: INTERESTS.MUSIC,
    label: INTEREST_LABELS.MUSIC,
    icon: <Music />,
  },
  {
    id: INTERESTS.MOVIES,
    label: INTEREST_LABELS.MOVIES,
    icon: <Clapperboard />,
  },
  {
    id: INTERESTS.TV_SERIES,
    label: INTEREST_LABELS.TV_SERIES,
    icon: <Tv />,
  },
  {
    id: INTERESTS.PROGRAMMING_TECHNOLOGY,
    label: INTEREST_LABELS.PROGRAMMING_TECHNOLOGY,
    icon: <Code />,
  },
  {
    id: INTERESTS.SPORTS,
    label: INTEREST_LABELS.SPORTS,
    icon: <Trophy />,
  },
  {
    id: INTERESTS.EDUCATION_LEARNING,
    label: INTEREST_LABELS.EDUCATION_LEARNING,
    icon: <GraduationCap />,
  },
  {
    id: INTERESTS.ART_CREATIVITY,
    label: INTEREST_LABELS.ART_CREATIVITY,
    icon: <Palette />,
  },
];

interface InterestsSettingsProps {
  selectedInterests: Interest[];
  onChange: (interests: Interest[]) => void;
}

export default function InterestsSettings({ selectedInterests, onChange }: InterestsSettingsProps) {

  const toggleInterest = (interestId: Interest) => {
    let newInterests: Interest[];

    if (selectedInterests.includes(interestId)) {
      newInterests = selectedInterests.filter(
        interest => interest !== interestId
      );
    } else {
      // Don't allow adding more than 8
      if (selectedInterests.length > 8) return;
      newInterests = [...selectedInterests, interestId];
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
            key={interest.id}
            label={interest.label}
            icon={interest.icon}
            selected={selectedInterests.includes(interest.id)}
            onClick={() => toggleInterest(interest.id)}
          />
        ))}
      </div>
    </div>
  );
}
