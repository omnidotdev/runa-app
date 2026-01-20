import { useEffect } from "react";

import type { RefObject } from "react";

interface UseAutoScrollOnDragOptions {
  /** Whether a drag is currently in progress */
  isDragging: boolean;
  /** Ref to the scrollable container */
  scrollContainerRef: RefObject<HTMLDivElement | null>;
  /** Distance from edge to start scrolling (default: 150) */
  edgeThreshold?: number;
  /** Maximum scroll speed in pixels per frame (default: 25) */
  maxScrollSpeed?: number;
}

/**
 * Auto-scroll a container when dragging near its edges.
 * When a drag operation is in progress and the mouse moves near the left or right
 * edge of the container, this hook will automatically scroll in that direction.
 */
const useAutoScrollOnDrag = ({
  isDragging,
  scrollContainerRef,
  edgeThreshold = 150,
  maxScrollSpeed = 25,
}: UseAutoScrollOnDragOptions): void => {
  useEffect(() => {
    if (!isDragging) return;

    let animationFrameId: number;
    let scrollSpeed = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const container = scrollContainerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX;

      if (mouseX < rect.left + edgeThreshold) {
        // Mouse near left edge - scroll left
        const distanceFromEdge = mouseX - rect.left;
        const intensity = 1 - distanceFromEdge / edgeThreshold;
        scrollSpeed = -maxScrollSpeed * intensity ** 2;
      } else if (mouseX > rect.right - edgeThreshold) {
        // Mouse near right edge - scroll right
        const distanceFromEdge = rect.right - mouseX;
        const intensity = 1 - distanceFromEdge / edgeThreshold;
        scrollSpeed = maxScrollSpeed * intensity ** 2;
      } else {
        scrollSpeed = 0;
      }
    };

    const scrollStep = () => {
      const container = scrollContainerRef.current;
      if (container && scrollSpeed !== 0) {
        container.scrollLeft += scrollSpeed;
      }
      animationFrameId = requestAnimationFrame(scrollStep);
    };

    document.addEventListener("mousemove", handleMouseMove);
    animationFrameId = requestAnimationFrame(scrollStep);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDragging, scrollContainerRef, edgeThreshold, maxScrollSpeed]);
};

export default useAutoScrollOnDrag;
