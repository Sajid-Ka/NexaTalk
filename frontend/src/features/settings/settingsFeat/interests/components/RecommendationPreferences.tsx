import Switch from '../../../../../shared/ui/Switch';

export interface RecommendationSettingsState {
  showRecommendations: boolean;
  allowFriendRecommendations: boolean;
  allowServerRecommendations: boolean;
}

interface RecommendationPreferencesProps {
  settings: RecommendationSettingsState;
  onChange: (key: keyof RecommendationSettingsState, value: boolean) => void;
}

export default function RecommendationPreferences({ settings, onChange }: RecommendationPreferencesProps) {
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
          onChange={() => onChange('showRecommendations', !settings.showRecommendations)}
        />

        <Switch
          label="Friend Recommendations"
          description="Get suggestions for people with similar interests"
          checked={settings.allowFriendRecommendations}
          onChange={() => onChange('allowFriendRecommendations', !settings.allowFriendRecommendations)}
          disabled={!settings.showRecommendations}
        />

        <Switch
          label="Server Recommendations"
          description="Discover communities matching your interests"
          checked={settings.allowServerRecommendations}
          onChange={() => onChange('allowServerRecommendations', !settings.allowServerRecommendations)}
          disabled={!settings.showRecommendations}
        />
      </div>
    </div>
  );
}
