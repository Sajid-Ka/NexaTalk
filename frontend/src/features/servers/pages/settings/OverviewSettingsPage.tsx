import {
  Globe,
  Lock,
  Upload,
  Save,
} from "lucide-react";

import Button from "../../../../shared/ui/Button";
import Input from "../../../../shared/ui/Input";
import TextArea from "../../../../shared/ui/TextArea";

import SettingsGrid from "../../../../shared/ui/settings/SettingsGrid";
import SettingsSection from "../../../../shared/ui/settings/SettingsSection";
import SettingsPageHeader from "../../../../shared/ui/settings/SettingsPageHeader";
import SettingsPageContainer from "../../../../shared/ui/settings/SettingsPageContainer";

export default function OverviewSettingsPage() {
  return (
    <SettingsPageContainer>
      <SettingsPageHeader
        title="Server Overview"
        description="Manage your server profile, branding and visibility settings."
        actions={
          <Button className="gap-2">
            <Save size={16} />
            Save Changes
          </Button>
        }
      />

      {/* SERVER PROFILE */}
      <SettingsSection
        title="Server Profile"
        description="Customize your server identity and appearance."
      >
        <SettingsGrid columns={2}>
          {/* ICON */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-slate-300">
              Server Icon
            </p>

            <div className="flex items-center gap-4">
              <div className="grid h-24 w-24 place-items-center rounded-3xl bg-gradient-to-br from-indigo-500 to-cyan-400 text-3xl font-black text-white">
                N
              </div>

              <Button
                type="button"
                variant="secondary"
                className="gap-2"
              >
                <Upload size={16} />
                Upload Icon
              </Button>
            </div>
          </div>

          {/* BANNER */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-slate-300">
              Server Banner
            </p>

            <div className="overflow-hidden rounded-2xl border border-white/10">
              <div className="h-32 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.45),transparent_32%),radial-gradient(circle_at_74%_28%,rgba(20,184,166,0.32),transparent_30%),linear-gradient(135deg,#312E81_0%,#0B1220_46%,#042F2E_100%)]" />

              <div className="border-t border-white/10 p-4">
                <Button
                  type="button"
                  variant="secondary"
                  className="gap-2"
                >
                  <Upload size={16} />
                  Change Banner
                </Button>
              </div>
            </div>
          </div>
        </SettingsGrid>

        <div className="mt-6 space-y-5">
          {/* SERVER NAME */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Server Name
            </label>

            <Input placeholder="Enter server name" />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Description
            </label>

            <TextArea
              rows={5}
              placeholder="Describe your community..."
            />

            <p className="mt-2 text-xs text-slate-500">
              Maximum 500 characters.
            </p>
          </div>
        </div>
      </SettingsSection>

      {/* PRIVACY */}
      <SettingsSection
        title="Server Privacy"
        description="Control who can discover and join your server."
      >
        <SettingsGrid columns={2}>
          {/* PUBLIC */}
          <button className="rounded-2xl border border-indigo-500/30 bg-indigo-500/10 p-5 text-left transition hover:border-indigo-400">
            <div className="flex items-start gap-4">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-indigo-500/20 text-indigo-200">
                <Globe size={22} />
              </div>

              <div>
                <p className="font-bold text-white">
                  Public Server
                </p>

                <p className="mt-1 text-sm leading-6 text-slate-400">
                  Anyone can discover and join your community.
                </p>
              </div>
            </div>
          </button>

          {/* PRIVATE */}
          <button className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-left transition hover:border-white/20">
            <div className="flex items-start gap-4">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10 text-slate-200">
                <Lock size={22} />
              </div>

              <div>
                <p className="font-bold text-white">
                  Private Server
                </p>

                <p className="mt-1 text-sm leading-6 text-slate-400">
                  Only invited users can join this server.
                </p>
              </div>
            </div>
          </button>
        </SettingsGrid>
      </SettingsSection>

      {/* TAGS */}
      <SettingsSection
        title="Server Tags"
        description="Help users understand your server topic."
      >
        <div className="space-y-4">
          <Input placeholder="Add a tag" />

          <div className="flex flex-wrap gap-2">
            {["gaming", "coding", "opensource"].map((tag) => (
              <div
                key={tag}
                className="rounded-full border border-indigo-400/20 bg-indigo-500/10 px-4 py-2 text-sm font-medium text-indigo-100"
              >
                #{tag}
              </div>
            ))}
          </div>
        </div>
      </SettingsSection>
    </SettingsPageContainer>
  );
}