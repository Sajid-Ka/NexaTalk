interface ManagementToolbarProps {
  children: React.ReactNode;
}

export default function ManagementToolbar({
  children,
}: ManagementToolbarProps) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-[#111827]/80 p-4 lg:flex-row lg:items-center lg:justify-between">
      {children}
    </div>
  );
}