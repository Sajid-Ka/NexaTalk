import { useEffect, useRef } from "react";

export function useAutoScroll<T>(dependency: T) {
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (bottomRef.current && bottomRef.current.parentElement) {
            const scrollContainer = bottomRef.current.parentElement;
            
            scrollContainer.scrollTo({
                top: scrollContainer.scrollHeight,
                behavior: "smooth",
            });
        }
    }, [dependency]);

    return bottomRef;
}
