import { type TextareaHTMLAttributes, forwardRef } from "react";
import { cn } from "../utils/cn";

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
    ({ className, label, error, ...props }, ref) => {
        return (
            <div className="w-full space-y-2">
                {label && (
                    <label className="text-sm font-medium text-white/70 block">
                        {label}
                    </label>
                )}
                <textarea
                    ref={ref}
                    className={cn(
                        "flex min-h-[100px] w-full rounded-xl border border-white/10 bg-[#0F121D] px-4 py-3 text-sm text-white shadow-sm transition-colors placeholder:text-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 resize-none",
                        error && "border-red-500 focus-visible:ring-red-500",
                        className
                    )}
                    {...props}
                />
                {error && (
                    <p className="text-xs text-red-400 font-medium">{error}</p>
                )}
            </div>
        );
    }
);

TextArea.displayName = "TextArea";

export default TextArea;
