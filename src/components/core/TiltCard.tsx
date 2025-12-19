import { useCallback, useRef, useState } from "react";

import { cn } from "@/lib/utils";

import type { CSSProperties, MouseEvent, PropsWithChildren } from "react";

interface Props extends PropsWithChildren {
  /** Class name. */
  className?: string;
  /** Click handler. */
  onClick?: () => void;
  /** Maximum tilt angle in degrees. */
  maxTilt?: number;
  /** Perspective distance in px. */
  perspective?: number;
  /** Lift amount on hover in px. */
  liftAmount?: number;
  /** Scale on hover. */
  hoverScale?: number;
  /** Transition duration in ms. */
  transitionDuration?: number;
  /** Enable/disable the tilt effect. */
  enabled?: boolean;
  /** Glare effect intensity 0-1. */
  glareIntensity?: number;
  /** Enable glare effect. */
  enableGlare?: boolean;
}

/**
 * 3D tilt card with mouse-follow effect.
 */
const TiltCard = ({
  children,
  className,
  onClick,
  maxTilt = 10,
  perspective = 1000,
  liftAmount = 8,
  hoverScale = 1.02,
  transitionDuration = 200,
  enabled = true,
  glareIntensity = 0.15,
  enableGlare = true,
}: Props) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [tiltStyle, setTiltStyle] = useState<CSSProperties>({});
  const [glareStyle, setGlareStyle] = useState<CSSProperties>({});

  const handleMouseMove = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (!enabled || !cardRef.current) return;

      const card = cardRef.current;
      const rect = card.getBoundingClientRect();

      // calculate mouse position relative to card center (normalized -1 to 1)
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const mouseX = (e.clientX - centerX) / (rect.width / 2);
      const mouseY = (e.clientY - centerY) / (rect.height / 2);

      // tilt towards the mouse (inverted for natural feel)
      const rotateX = -mouseY * maxTilt;
      const rotateY = mouseX * maxTilt;

      setTiltStyle({
        transform: `
          perspective(${perspective}px)
          rotateX(${rotateX}deg)
          rotateY(${rotateY}deg)
          translateZ(${liftAmount}px)
          scale3d(${hoverScale}, ${hoverScale}, ${hoverScale})
        `,
      });

      // glare follows cursor
      if (enableGlare) {
        const glareX = ((e.clientX - rect.left) / rect.width) * 100;
        const glareY = ((e.clientY - rect.top) / rect.height) * 100;
        setGlareStyle({
          background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,${glareIntensity}) 0%, transparent 60%)`,
          opacity: 1,
        });
      }
    },
    [
      enabled,
      maxTilt,
      perspective,
      liftAmount,
      hoverScale,
      enableGlare,
      glareIntensity,
    ],
  );

  const handleMouseEnter = useCallback(() => {
    if (!enabled) return;
    setIsHovered(true);
  }, [enabled]);

  const handleMouseLeave = useCallback(() => {
    if (!enabled) return;
    setIsHovered(false);
    setTiltStyle({
      transform: `
        perspective(${perspective}px)
        rotateX(0deg)
        rotateY(0deg)
        translateZ(0px)
        scale3d(1, 1, 1)
      `,
    });
    setGlareStyle({ opacity: 0 });
  }, [enabled, perspective]);

  // respect reduced motion preference
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion || !enabled) {
    return (
      <div
        onClick={onClick}
        className={cn(
          "rounded-lg border bg-card p-6 shadow-sm transition-shadow hover:shadow-md",
          onClick && "cursor-pointer",
          className,
        )}
      >
        {children}
      </div>
    );
  }

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative rounded-lg border bg-card p-6 shadow-sm",
        "will-change-transform",
        onClick && "cursor-pointer",
        className,
      )}
      style={{
        transformStyle: "preserve-3d",
        transition: `transform ${transitionDuration}ms ease-out, box-shadow ${transitionDuration}ms ease-out`,
        boxShadow: isHovered
          ? "0 20px 40px -12px rgba(0, 0, 0, 0.25), 0 8px 16px -8px rgba(0, 0, 0, 0.15)"
          : undefined,
        ...tiltStyle,
      }}
    >
      {/* glare overlay */}
      {enableGlare && (
        <div
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
          style={{
            transition: `opacity ${transitionDuration}ms ease-out`,
            ...glareStyle,
          }}
        />
      )}

      {/* content with slight 3D lift */}
      <div
        style={{
          transform: isHovered ? "translateZ(20px)" : "translateZ(0px)",
          transition: `transform ${transitionDuration}ms ease-out`,
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default TiltCard;
