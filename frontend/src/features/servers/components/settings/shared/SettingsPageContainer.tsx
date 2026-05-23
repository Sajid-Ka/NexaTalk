interface SettingsPageContainerProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export default function SettingsPageContainer({
  title,
  description,
  children,
}: SettingsPageContainerProps) {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-8">
      <div>
        <h1 className="text-3xl font-black text-white">
          {title}
        </h1>

        {description && (
          <p className="mt-2 text-sm text-slate-400">
            {description}
          </p>
        )}
      </div>

      {children}
    </div>
  );
}