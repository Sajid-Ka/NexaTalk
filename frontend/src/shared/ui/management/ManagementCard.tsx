interface ManagementCardProps {
  children: React.ReactNode;
}

export default function ManagementCard({
  children,
}: ManagementCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#111827]/80 p-5">
      {children}
    </div>
  );
}