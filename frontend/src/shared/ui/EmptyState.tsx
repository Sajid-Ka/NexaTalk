import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    description: string;
}

export default function EmptyState({
    icon: Icon,
    title,
    description,
}: EmptyStateProps) {
    return (
        <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <Icon
                size={40}
                className="mb-4 text-white/20"
            />

            <h2 className="text-lg font-semibold">
                {title}
            </h2>

            <p className="mt-2 text-sm text-white/40">
                {description}
            </p>
        </div>
    );
}