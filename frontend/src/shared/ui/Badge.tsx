import { cn } from "../utils/cn";
import { BadgeVariant } from "../constants/ui.const";

interface BadgeProps {
    children: React.ReactNode;
    variant?: BadgeVariant;
    className?: string;
}

export default function Badge({
    children,
    variant = BadgeVariant.PRIMARY,
    className,
}: BadgeProps) {
    const variants: Record<BadgeVariant, string> = {
        [BadgeVariant.PRIMARY]: "bg-blue-600 text-white",
        [BadgeVariant.DANGER]: "bg-red-500 text-white",
        [BadgeVariant.WARNING]: "bg-yellow-500 text-white",
        [BadgeVariant.SUCCESS]: "bg-green-500 text-white",
        [BadgeVariant.SECONDARY]: "bg-white/10 text-white/70",
        [BadgeVariant.INDIGO]: "bg-indigo-600 text-white",
        [BadgeVariant.PURPLE]: "bg-purple-600 text-white"
    };

    return (
        <span
            className={cn(
                "inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-[10px] font-bold min-w-[18px]",
                variants[variant],
                className
            )}
        >
            {children}
        </span>
    );
}
