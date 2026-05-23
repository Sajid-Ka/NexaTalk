interface SettingsSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export default function SettingsSection({
  title,
  description,
  children,
  actions,
}: SettingsSectionProps) {
  return (
    <section className="rounded-2xl border border-white/10 bg-[#111827]/80 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white">
            {title}
          </h2>

          {description && (
            <p className="mt-1 text-sm text-slate-400">
              {description}
            </p>
          )}
        </div>

        {actions && (
          <div className="shrink-0">
            {actions}
          </div>
        )}
      </div>

      <div className="mt-6">
        {children}
      </div>
    </section>
  );
}