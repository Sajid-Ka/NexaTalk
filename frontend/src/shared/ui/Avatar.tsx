import { cn } from "../utils/cn";
import { useRef, } from "react";

interface AvatarProps {
  src?: string;
  alt?: string;
  fallback: string;
  status?: "online" | "offline" | "idle" | "dnd" | "streaming";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  userId?: string;
  onProfileClick?: (userId: string, element: HTMLElement) => void;
}

export default function Avatar({
  src,
  alt,
  fallback,
  status,
  size = "md",
  className,
  userId,
  onProfileClick
}: AvatarProps) {
  const avatarRef = useRef<HTMLDivElement>(null);

  const sizeClasses = {
    xs: "h-6 w-6 text-[10px]",
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
    xl: "h-20 w-20 text-xl",
  };

  const statusColors = {
    online: "bg-green-500",
    offline: "bg-gray-500",
    idle: "bg-yellow-500",
    dnd: "bg-red-500",
    streaming: "bg-purple-500",
  };

  const handleClick = (e: React.MouseEvent) => {
    if (userId && onProfileClick) {
      e.stopPropagation();
      onProfileClick(userId, avatarRef.current!);
    }
  };

  return (
    <div 
      ref={avatarRef}
      className={cn("relative inline-block cursor-pointer", className)} 
      onClick={handleClick}
    >
      <div
        className={cn(
          "flex items-center justify-center rounded-full bg-white/10 overflow-hidden text-white font-medium h-full w-full",
          sizeClasses[size]
        )}
      >
        {src ? (
          <img src={src} alt={alt || fallback} className="h-full w-full object-cover" />
        ) : (
          <span>{fallback.substring(0, 2).toUpperCase()}</span>
        )}
      </div>
      {status && (
        <span
          className={cn(
            "absolute bottom-0 right-0 block rounded-full ring-2 ring-[#0F121D]",
            statusColors[status],
            size === "xs" ? "h-1.5 w-1.5" : size === "sm" ? "h-2 w-2" : "h-3 w-3"
          )}
        />
      )}
    </div>
  );
}