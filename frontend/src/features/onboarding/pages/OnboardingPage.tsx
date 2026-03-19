import { useState, useEffect } from 'react';
import { 
  Gamepad2, 
  Music, 
  GraduationCap, 
  Code, 
  Clapperboard, 
  Tv, 
  Monitor, 
  Palette,
  ArrowRight
} from 'lucide-react';
import InterestCard from '../../../shared/ui/InterestCard';
import Button from '../../../shared/ui/Button';
import { getPopularInterestsApi, completeOnboardingApi } from '../api/onboardingApi';
import { AppRoute } from '../../../shared/constants/app-route.const';
import toast from 'react-hot-toast';
import type { Interest } from '../types/onboarding.types';
import { AxiosError } from 'axios';

const ICON_MAP: Record<string, React.ReactNode> = {
  'Gaming': <Gamepad2 />,
  'Music': <Music />,
  'Learning': <GraduationCap />,
  'Coding': <Code />,
  'Movies': <Clapperboard />,
  'Series': <Tv />,
  'Tech': <Monitor />,
  'Art': <Palette />,
};

interface DisplayInterest {
  name: string;
  icon: React.ReactNode;
}

const DEFAULT_INTERESTS: DisplayInterest[] = [
  { name: 'Gaming', icon: <Gamepad2 /> },
  { name: 'Music', icon: <Music /> },
  { name: 'Learning', icon: <GraduationCap /> },
  { name: 'Coding', icon: <Code /> },
  { name: 'Movies', icon: <Clapperboard /> },
  { name: 'Series', icon: <Tv /> },
  { name: 'Tech', icon: <Monitor /> },
  { name: 'Art', icon: <Palette /> },
];

const OnboardingPage = () => {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [availableInterests, setAvailableInterests] = useState<DisplayInterest[]>(DEFAULT_INTERESTS);

  useEffect(() => {
    const fetchInterests = async () => {
      try {
        const res = await getPopularInterestsApi(20);
        const interests = res.data.data;
        if (interests && interests.length > 0) {
          const mappedInterests: DisplayInterest[] = interests.map((i: Interest) => ({
            name: i.name,
            icon: ICON_MAP[i.name] || <Monitor />
          }));
          setAvailableInterests(mappedInterests);
        }
      } catch (error) {
        console.error('Failed to fetch interests', error);
      }
    };

    fetchInterests();
  }, []);

  const toggleInterest = (name: string) => {
    setSelectedInterests(prev => 
      prev.includes(name) 
        ? prev.filter(i => i !== name) 
        : [...prev, name]
    );
  };

  const handleContinue = async () => {
    setLoading(true);
    try {
      await completeOnboardingApi({ interests: selectedInterests });
      toast.success('Onboarding complete!');
      window.location.href = AppRoute.HOME_PAGE;
    } catch (error) {
      const axiosError = error as AxiosError<{ error: { message: string } }>;
      toast.error(axiosError.response?.data?.error?.message || 'Failed to complete onboarding');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = async () => {
    setLoading(true);
    try {
      await completeOnboardingApi({ interests: [] });
      toast.success('Onboarding skipped');
      window.location.href = AppRoute.HOME_PAGE;
    } catch {
      toast.error('Failed to skip onboarding');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#05060B] flex flex-col items-center justify-center p-4 md:p-8">
      <div className="max-w-4xl w-full flex flex-col items-center space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            Choose Your Interests
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
            Select topics that interest you to find the right communities and personalize your feed.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 w-full max-w-4xl">
          {availableInterests.map((interest) => (
            <InterestCard
              key={interest.name}
              label={interest.name}
              icon={interest.icon}
              selected={selectedInterests.includes(interest.name)}
              onClick={() => toggleInterest(interest.name)}
            />
          ))}
        </div>

        <div className="w-full max-w-sm flex flex-col items-center space-y-4 pt-4">
          <Button
            onClick={handleContinue}
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#4F46E5] to-[#9333EA] hover:from-[#4338CA] hover:to-[#7E22CE] text-white font-semibold text-lg flex items-center justify-center gap-2 border-none shadow-lg shadow-indigo-500/20"
          >
            {loading ? 'Processing...' : 'Continue'}
            {!loading && <ArrowRight className="w-5 h-5" />}
          </Button>
          
          <button
            onClick={handleSkip}
            disabled={loading}
            className="text-gray-500 hover:text-gray-300 font-medium tracking-widest text-xs uppercase transition-colors"
          >
            SKIP FOR NOW
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;