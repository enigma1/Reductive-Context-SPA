import { useCallback, useEffect, useRef, useState } from 'react';

export const useResizableSplit = (initialHeight = 20) => {
  const [upperHeight, setUpperHeight] = useState(initialHeight);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);

  const handleMouseDown = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      event.preventDefault();
      isDraggingRef.current = true;
    },
    [],
  );

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!isDraggingRef.current || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      if (rect.height <= 0) return;

      const percentage = ((event.clientY - rect.top) / rect.height) * 100;

      setUpperHeight(Math.min(90, Math.max(10, percentage)));
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return {
    upperHeight,
    containerRef,
    handleMouseDown,
  };
};
