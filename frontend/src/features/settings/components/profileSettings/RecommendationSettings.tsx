import { useState, useEffect } from 'react';
import Switch from '../../../../shared/ui/Switch';
import Button from '../../../../shared/ui/Button';
import { getUserSettingsApi,updateUserSettingsApi } from '../../api/userSettingsApi';
import toast from 'react-hot-toast';

interface Settings {
  showRecommendations: boolean;
  allowFriendRecommendations: boolean;
  allowServerRecommendations: boolean;
}

export default function RecommendationSettings() {
  const [settings, setSettings] = useState<Settings>({
    showRecommendations: true,
    allowFriendRecommendations: true,
    allowServerRecommendations: true,
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await getUserSettingsApi();
      setSettings(res.data.data);
    } catch {
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (key: keyof Settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateUserSettingsApi(settings);
      toast.success('Settings updated successfully');
    } catch {
      toast.error('Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="animate-pulse bg-white/5 h-40 rounded-2xl" />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-white mb-4">Recommendation Preferences</h3>
        <p className="text-sm text-white/40 mb-6">
          Control how NexaTalk recommends content to you
        </p>
      </div>

      <div className="space-y-4">
        <Switch
          label="Show Recommendations"
          description="Enable or disable all recommendations"
          checked={settings.showRecommendations}
          onChange={() => handleToggle('showRecommendations')}
        />

        <Switch
          label="Friend Recommendations"
          description="Get suggestions for people with similar interests"
          checked={settings.allowFriendRecommendations}
          onChange={() => handleToggle('allowFriendRecommendations')}
          disabled={!settings.showRecommendations}
        />

        <Switch
          label="Server Recommendations"
          description="Discover communities matching your interests"
          checked={settings.allowServerRecommendations}
          onChange={() => handleToggle('allowServerRecommendations')}
          disabled={!settings.showRecommendations}
        />
      </div>

      <div className="pt-4">
        <Button
          onClick={handleSave}
          isLoading={saving}
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          Save Preferences
        </Button>
      </div>
    </div>
  );
}