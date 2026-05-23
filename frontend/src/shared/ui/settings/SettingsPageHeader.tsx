interface SettingsPageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export default function SettingsPageHeader({
  title,
  description,
  actions,
}: SettingsPageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 border-b border-white/10 pb-6 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-white">
          {title}
        </h1>

        {description && (
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
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
  );
}