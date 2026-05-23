interface SettingsPageContainerProps {
  children: React.ReactNode;
}

export default function SettingsPageContainer({
  children,
}: SettingsPageContainerProps) {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-8">
      {children}
    </div>
  );
}