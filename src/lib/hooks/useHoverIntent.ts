import { useState, useRef, useCallback, useEffect } from "react";

export function useHoverIntent<T>(initialValue: T | null = null, delay: number = 300) {
  const [activeItem, setActiveItem] = useState<T | null>(initialValue);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const clearHoverTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const handleMouseEnter = useCallback((item: T) => {
    clearHoverTimeout();
    setActiveItem(item);
  }, [clearHoverTimeout]);

  const handleMouseLeave = useCallback(() => {
    clearHoverTimeout();
    timeoutRef.current = setTimeout(() => {
      setActiveItem(null);
    }, delay);
  }, [clearHoverTimeout, delay]);

  const forceClose = useCallback(() => {
    clearHoverTimeout();
    setActiveItem(null);
  }, [clearHoverTimeout]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return clearHoverTimeout;
  }, [clearHoverTimeout]);

  return {
    activeItem,
    handleMouseEnter,
    handleMouseLeave,
    forceClose
  };
}
