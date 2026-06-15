import { useState, useEffect, useMemo } from 'react';
import InterestsSettings from '../components/InterestsSettings';
import RecommendationPreferences from '../components/RecommendationPreferences';
import type { RecommendationSettingsState } from '../components/RecommendationPreferences';
import Button from '../../../../../shared/ui/Button';
import { getUserSettingsApi, updateUserSettingsApi } from '../../../api/userSettingsApi';
import { addInterestsApi, removeInterestsApi, getMyInterestsApi } from '../api/interestApi';
import { useInvalidateRecommendations } from '../../../../recommendations/api/recommendationApi';
import { useQueryClient } from '@tanstack/react-query';
import { USER_SETTINGS_QUERY_KEY } from '../../../hooks/useUserSettings';
import toast from 'react-hot-toast';
import type { Interest } from '../../../../../shared/constants/interests.const';

interface ProfileInterest {
  id: string;
  name: Interest;
}

export default function InterestsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(false);

  const [initialInterests, setInitialInterests] = useState<ProfileInterest[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<Interest[]>([]);
  const [initialSettings, setInitialSettings] = useState<RecommendationSettingsState | null>(null);
  const [settings, setSettings] = useState<RecommendationSettingsState | null>(null);

  const invalidateRecommendations = useInvalidateRecommendations();
  const queryClient = useQueryClient();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(false);
    try {
      const [interestsRes, settingsRes] = await Promise.all([
        getMyInterestsApi(),
        getUserSettingsApi(),
      ]);

      const interests = interestsRes.data.data || [];
      setInitialInterests(interests);
      setSelectedInterests(interests.map(i => i.name));

      setInitialSettings(settingsRes.data.data);
      setSettings(settingsRes.data.data);
    } catch {
      setError(true);
      toast.error('Failed to load interests settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSettingsChange = (key: keyof RecommendationSettingsState, value: boolean) => {
    if (!settings) return;
    setSettings(prev => prev ? { ...prev, [key]: value } : null);
  };

  const isDirty = useMemo(() => {
    if (!initialSettings || !settings) return false;
    
    // Check settings
    if (
      settings.showRecommendations !== initialSettings.showRecommendations ||
      settings.allowFriendRecommendations !== initialSettings.allowFriendRecommendations ||
      settings.allowServerRecommendations !== initialSettings.allowServerRecommendations
    ) {
      return true;
    }

    // Check interests
    const initialNames = initialInterests.map(i => i.name.toLowerCase()).sort();
    const selectedNames = [...selectedInterests].sort();
    
    if (initialNames.length !== selectedNames.length) return true;
    for (let i = 0; i < initialNames.length; i++) {
      if (initialNames[i] !== selectedNames[i]) return true;
    }

    return false;
  }, [initialInterests, selectedInterests, initialSettings, settings]);

  const handleSave = async () => {
    if (!settings || !initialSettings) return;
    if (!isDirty) {
      toast('No changes detected', { icon: 'ℹ️' });
      return;
    }

    setSaving(true);
    let interestsChanged = false;
    let settingsChanged = false;

    try {
      const promises = [];

      // 1. Calculate Interest differences
      const initialNames = initialInterests.map(i => i.name.toLowerCase());
      const interestsToAdd = selectedInterests.filter(name => !initialNames.includes(name));
      const interestsToRemove = initialInterests
        .filter(i => !selectedInterests.includes(i.name))
        .map(i => i.id);

      if (interestsToAdd.length > 0) {
        promises.push(addInterestsApi({ interests: interestsToAdd }));
        interestsChanged = true;
      }

      if (interestsToRemove.length > 0) {
        promises.push(removeInterestsApi({ interestIds: interestsToRemove }));
        interestsChanged = true;
      }

      // 2. Calculate Settings differences
      if (
        settings.showRecommendations !== initialSettings.showRecommendations ||
        settings.allowFriendRecommendations !== initialSettings.allowFriendRecommendations ||
        settings.allowServerRecommendations !== initialSettings.allowServerRecommendations
      ) {
        promises.push(updateUserSettingsApi(settings));
        settingsChanged = true;
      }

      if (promises.length === 0) {
        setSaving(false);
        return;
      }

      await Promise.all(promises);

      toast.success('Interests and recommendation preferences updated successfully.');

      if (interestsChanged || settingsChanged) {
        invalidateRecommendations();
      }

      if (settingsChanged) {
        queryClient.invalidateQueries({ queryKey: USER_SETTINGS_QUERY_KEY });
      }

      // Re-fetch to sync new IDs if interests changed
      if (interestsChanged) {
        await fetchData();
      } else {
        // Reset dirty state baseline locally
        setInitialSettings(settings);
      }

    } catch {
      toast.error('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  if (loading || (!settings && !error)) {
    return (
      <div className="max-w-4xl space-y-6">
        <div className="animate-pulse bg-white/5 h-40 rounded-2xl" />
        <div className="animate-pulse bg-white/5 h-40 rounded-2xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl pb-12">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Interests & Recommendations</h1>
        </div>
        <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl text-center">
          <h2 className="text-lg font-semibold text-red-400 mb-2">Failed to load data</h2>
          <p className="text-red-400/80 mb-4">We couldn't fetch your interests and settings at this time.</p>
          <Button onClick={fetchData} className="bg-red-500/20 text-red-400 hover:bg-red-500/30">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl pb-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Interests & Recommendations</h1>
        <p className="text-white/50">
          Manage your interests to improve friend and server recommendations.
        </p>
      </div>

      <div className="space-y-12">
        <InterestsSettings
          selectedInterests={selectedInterests}
          onChange={setSelectedInterests}
        />

        <div className="h-px bg-white/5" />

        <RecommendationPreferences
          settings={settings!}
          onChange={handleSettingsChange}
        />

        <div className="pt-4 flex justify-end">
          <Button
            onClick={handleSave}
            isLoading={saving}
            disabled={!isDirty || loading || error || saving}
            className="bg-indigo-600 hover:bg-indigo-700 px-8"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
