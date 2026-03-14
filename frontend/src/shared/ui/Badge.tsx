import { cn } from "../utils/cn";

interface BadgeProps {
    children: React.ReactNode;
    variant?: "primary" | "danger" | "warning" | "success" | "secondary" | "indigo" | "purple";
    className?: string;
}

export default function Badge({
    children,
    variant = "primary",
    className,
}: BadgeProps) {
    const variants = {
        primary: "bg-blue-600 text-white",
        danger: "bg-red-500 text-white",
        warning: "bg-yellow-500 text-white",
        success: "bg-green-500 text-white",
        secondary: "bg-white/10 text-white/70",
        indigo: "bg-indigo-600 text-white",
        purple: "bg-purple-600 text-white"
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
