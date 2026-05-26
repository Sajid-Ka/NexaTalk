import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "../utils/cn";
import { Loader2 } from "lucide-react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline" | "destructive";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, children, ...props }, ref) => {
    const variants = {
      primary: "bg-[#4F46E5] hover:bg-[#4338CA] text-white shadow-lg shadow-indigo-500/20 border-transparent",
      secondary: "bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm border-transparent",
      ghost: "bg-transparent hover:bg-white/5 text-white/70 hover:text-white border-transparent",
      outline: "bg-transparent border border-white/10 hover:bg-white/5 text-white",
      destructive: "bg-red-500 text-white hover:bg-red-600",
    };

    const sizes = {
      sm: "h-8 px-3 text-xs",
      md: "h-10 px-5 text-sm",
      lg: "h-12 px-8 text-base",
    };

    return (
      <button
        ref={ref}
        disabled={isLoading || props.disabled}
        className={cn(
          "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed border",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
