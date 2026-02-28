import { type HTMLAttributes, forwardRef } from "react";
import { cn } from "../utils/cn";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "glass" | "gradient";
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", children, ...props }, ref) => {
    const variants = {
      default: "bg-[#0F121D] border border-white/5",
      glass: "bg-white/5 backdrop-blur-lg border border-white/10",
      gradient: "bg-gradient-to-br from-[#1E2335] to-[#0F121D] border border-indigo-500/20",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-2xl transition-all duration-200",
          variants[variant],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

export default Card;
