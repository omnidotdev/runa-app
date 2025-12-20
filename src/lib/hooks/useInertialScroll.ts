import { useCallback, useEffect, useRef, useState } from "react";

import type { MouseEvent as ReactMouseEvent, RefObject } from "react";

interface UseInertialScrollOptions {
  /** Friction coefficient for deceleration (0-1, lower = more friction). */
  friction?: number;
  /** Velocity multiplier during drag. */
  velocityMultiplier?: number;
  /** Minimum velocity threshold to stop animation. */
  minVelocity?: number;
}

interface UseInertialScrollReturn {
  scrollContainerRef: RefObject<HTMLDivElement | null>;
  isMouseDragging: boolean;
  handleMouseDown: (e: ReactMouseEvent<HTMLDivElement>) => void;
  handleMouseUp: () => void;
  handleMouseMove: (e: ReactMouseEvent<HTMLDivElement>) => void;
  handleMouseLeave: () => void;
}

/**
 * Inertial (momentum-based) scrolling.
 * Allows drag-to-scroll with smooth deceleration after release.
 */
const useInertialScroll = (
  options: UseInertialScrollOptions = {},
): UseInertialScrollReturn => {
  const {
    friction = 0.92,
    velocityMultiplier = 1.5,
    minVelocity = 0.5,
  } = options;

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isMouseDragging, setIsMouseDragging] = useState(false);

  // Refs for tracking velocity
  const startXRef = useRef(0);
  const scrollLeftStartRef = useRef(0);
  const lastXRef = useRef(0);
  const lastTimeRef = useRef(0);
  const velocityRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);

  // Stop any ongoing inertial animation
  const stopInertia = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, []);

  // Start inertial scrolling animation
  const startInertia = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const animate = () => {
      if (Math.abs(velocityRef.current) < minVelocity) {
        velocityRef.current = 0;
        animationFrameRef.current = null;
        return;
      }

      container.scrollLeft -= velocityRef.current;
      velocityRef.current *= friction;
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);
  }, [friction, minVelocity]);

  const handleMouseDown = useCallback(
    (e: ReactMouseEvent<HTMLDivElement>) => {
      // Only start drag-scroll if clicking on the container background, not on draggable items
      const target = e.target as HTMLElement;
      if (target.closest("[data-rfd-draggable-id]")) return;

      const container = scrollContainerRef.current;
      if (!container) return;

      // Stop any ongoing inertia
      stopInertia();

      setIsMouseDragging(true);
      startXRef.current = e.pageX - container.offsetLeft;
      scrollLeftStartRef.current = container.scrollLeft;
      lastXRef.current = e.pageX;
      lastTimeRef.current = performance.now();
      velocityRef.current = 0;
      container.style.cursor = "grabbing";
    },
    [stopInertia],
  );

  const handleMouseUp = useCallback(() => {
    if (!isMouseDragging) return;

    setIsMouseDragging(false);
    const container = scrollContainerRef.current;
    if (container) {
      container.style.cursor = "grab";
    }

    // Start inertial scrolling if there's velocity
    if (Math.abs(velocityRef.current) > minVelocity) {
      startInertia();
    }
  }, [isMouseDragging, minVelocity, startInertia]);

  const handleMouseMove = useCallback(
    (e: ReactMouseEvent<HTMLDivElement>) => {
      if (!isMouseDragging) return;
      e.preventDefault();

      const container = scrollContainerRef.current;
      if (!container) return;

      const currentTime = performance.now();
      const deltaTime = currentTime - lastTimeRef.current;

      const x = e.pageX - container.offsetLeft;
      const walk = (x - startXRef.current) * velocityMultiplier;
      container.scrollLeft = scrollLeftStartRef.current - walk;

      // Calculate velocity (pixels per millisecond, then scale for smoother feel)
      if (deltaTime > 0) {
        const deltaX = e.pageX - lastXRef.current;
        velocityRef.current = (deltaX / deltaTime) * 16; // Scale to ~60fps frame time
      }

      lastXRef.current = e.pageX;
      lastTimeRef.current = currentTime;
    },
    [isMouseDragging, velocityMultiplier],
  );

  const handleMouseLeave = useCallback(() => {
    if (isMouseDragging) {
      setIsMouseDragging(false);
      const container = scrollContainerRef.current;
      if (container) {
        container.style.cursor = "grab";
      }

      // Start inertial scrolling on leave as well
      if (Math.abs(velocityRef.current) > minVelocity) {
        startInertia();
      }
    }
  }, [isMouseDragging, minVelocity, startInertia]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopInertia();
    };
  }, [stopInertia]);

  return {
    scrollContainerRef,
    isMouseDragging,
    handleMouseDown,
    handleMouseUp,
    handleMouseMove,
    handleMouseLeave,
  };
};

export default useInertialScroll;
