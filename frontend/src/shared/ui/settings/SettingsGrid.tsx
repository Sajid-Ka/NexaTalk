interface SettingsGridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3;
}

export default function SettingsGrid({
  children,
  columns = 2,
}: SettingsGridProps) {
  const columnClass =
    columns === 1
      ? "grid-cols-1"
      : columns === 2
      ? "grid-cols-1 lg:grid-cols-2"
      : "grid-cols-1 md:grid-cols-2 xl:grid-cols-3";

  return (
    <div className={`grid gap-4 ${columnClass}`}>
      {children}
    </div>
  );
}