interface SettingsSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  danger?: boolean;
}

export default function SettingsSection({
  title,
  description,
  children,
  actions,
  danger,
}: SettingsSectionProps) {
  return (
    <section
      className={`rounded-2xl border p-6 ${
        danger
          ? "border-red-500/20 bg-red-500/[0.03]"
          : "border-white/10 bg-[#111827]/80"
      }`}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2
            className={`text-lg font-bold ${
              danger ? "text-red-300" : "text-white"
            }`}
          >
            {title}
          </h2>

          {description && (
            <p className="mt-1 text-sm leading-6 text-slate-400">
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