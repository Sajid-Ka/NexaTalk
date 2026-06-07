import { cn } from "../utils/cn";
import { useRef, useState } from "react";
import { 
  AvatarSize, 
  AvatarStatus,
  AVATAR_SIZE_CLASSES,
  AVATAR_STATUS_COLORS,
  AVATAR_STATUS_INDICATOR_SIZES
} from "../constants/avatar.const";

interface AvatarProps {
  src?: string;
  alt?: string;
  fallback: string;
  status?: AvatarStatus;
  size?: AvatarSize;
  className?: string;
  userId?: string;
  onProfileClick?: (userId: string, element: HTMLElement) => void;
}

const getImageUrl = (url?: string) => {
  if (!url) return "";
  if (
    url.startsWith("http://") || 
    url.startsWith("https://") || 
    url.startsWith("blob:") || 
    url.startsWith("data:")
  ) {
    return url;
  }

  const apiBaseUrl = import.meta.env.VITE_API_URL || window.location.origin;
  const apiOrigin = new URL(apiBaseUrl, window.location.origin).origin;

  return url.startsWith("/") ? `${apiOrigin}${url}` : `${apiOrigin}/${url}`;
};

export default function Avatar({
  src,
  alt,
  fallback,
  status,
  size = AvatarSize.MD,
  className,
  userId,
  onProfileClick
}: AvatarProps) {
  const avatarRef = useRef<HTMLDivElement>(null);


  const [errorSrc, setErrorSrc] = useState<string | null>(null);

  const handleClick = (e: React.MouseEvent) => {
    if (userId && onProfileClick) {
      e.stopPropagation();
      onProfileClick(userId, avatarRef.current!);
    }
  };

  const finalSrc = src ? getImageUrl(src) : "";
  const hasError = errorSrc === finalSrc;

  return (
    <div 
      ref={avatarRef}
      className={cn(
        "relative inline-flex items-center justify-center shrink-0 cursor-pointer",
        AVATAR_SIZE_CLASSES[size],
        className
      )} 
      onClick={handleClick}
    >
      <div
        className="flex items-center justify-center rounded-full bg-white/10 overflow-hidden text-white font-medium h-full w-full"
      >
        {finalSrc && !hasError ? (
          <img 
            src={finalSrc} 
            alt={alt || fallback} 
            className="h-full w-full object-cover" 
            onError={() => setErrorSrc(finalSrc)}
          />
        ) : (
          <span>{fallback.substring(0, 2).toUpperCase()}</span>
        )}
      </div>
      {status && (
        <span
          className={cn(
            "absolute bottom-0 right-0 block rounded-full ring-2 ring-[#0F121D]",
            AVATAR_STATUS_COLORS[status],
            AVATAR_STATUS_INDICATOR_SIZES[size]
          )}
        />
      )}
    </div>
  );
}
