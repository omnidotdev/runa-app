import { Stars } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

import type { Mesh, MeshBasicMaterial, Points } from "three";

interface ShootingStar {
  id: number;
  startX: number;
  startY: number;
  startZ: number;
  speed: number;
  delay: number;
  active: boolean;
  progress: number;
}

/**
 * Individual shooting star mesh.
 */
const ShootingStarMesh = ({
  star,
  onComplete,
}: {
  star: ShootingStar;
  onComplete: (id: number) => void;
}) => {
  const meshRef = useRef<Mesh>(null);
  const trailRef = useRef<Mesh>(null);
  const [localProgress, setLocalProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useFrame((_, delta) => {
    if (!star.active) return;

    // Handle delay before starting
    if (localProgress < star.delay) {
      setLocalProgress((p) => p + delta);
      return;
    }

    if (!isVisible) {
      setIsVisible(true);
    }

    // calculate actual animation progress (0-1)
    const animProgress = Math.min(
      (localProgress - star.delay) / (2 / star.speed),
      1,
    );

    if (meshRef.current && trailRef.current) {
      // move diagonally down-left
      const x = star.startX - animProgress * 8;
      const y = star.startY - animProgress * 4;
      const z = star.startZ;

      meshRef.current.position.set(x, y, z);

      trailRef.current.position.set(x + 0.3, y + 0.15, z);

      // fade in quickly, then fade out
      const opacity =
        animProgress < 0.1
          ? animProgress * 10
          : animProgress > 0.7
            ? (1 - animProgress) / 0.3
            : 1;

      (meshRef.current.material as MeshBasicMaterial).opacity = opacity * 0.9;
      (trailRef.current.material as MeshBasicMaterial).opacity = opacity * 0.5;

      // Scale trail based on progress
      trailRef.current.scale.x = 1 + animProgress * 2;
    }

    setLocalProgress((p) => p + delta);

    if (animProgress >= 1) {
      onComplete(star.id);
    }
  });

  if (!isVisible) return null;

  return (
    <group>
      {/* star head (bright point) */}
      <mesh ref={meshRef} position={[star.startX, star.startY, star.startZ]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshBasicMaterial color="#fbbf24" transparent opacity={0.9} />
      </mesh>

      {/* star trail */}
      <mesh
        ref={trailRef}
        position={[star.startX + 0.3, star.startY + 0.15, star.startZ]}
        rotation={[0, 0, Math.PI / 6]}
      >
        <planeGeometry args={[0.6, 0.015]} />
        <meshBasicMaterial color="#fcd34d" transparent opacity={0.5} />
      </mesh>
    </group>
  );
};

// scene with stars and shooting stars
const StarScene = () => {
  const starsRef = useRef<Points>(null);
  const [shootingStars, setShootingStars] = useState<ShootingStar[]>([]);
  const nextIdRef = useRef(0);

  // slowly rotate the star field
  useFrame((_, delta) => {
    if (starsRef.current) {
      starsRef.current.rotation.y += delta * 0.005;
      starsRef.current.rotation.x += delta * 0.002;
    }
  });

  // spawn shooting stars periodically
  useEffect(() => {
    const spawnStar = () => {
      const newStar: ShootingStar = {
        id: nextIdRef.current++,
        // start from right side
        startX: 3 + Math.random() * 4,
        // upper portion
        startY: 1 + Math.random() * 3,
        startZ: -2 - Math.random() * 3,
        speed: 0.8 + Math.random() * 0.4,
        delay: 0,
        active: true,
        progress: 0,
      };

      setShootingStars((prev) => [...prev, newStar]);
    };

    // spawn first star after a short delay
    const initialTimeout = setTimeout(spawnStar, 2000);

    // then spawn at random intervals (8-15 seconds)
    const interval = setInterval(
      () => {
        if (Math.random() > 0.3) {
          // 70% chance each interval
          spawnStar();
        }
      },
      8000 + Math.random() * 7000,
    );

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);

  const handleStarComplete = (id: number) => {
    setShootingStars((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <>
      {/* ambient starfield */}
      <Stars
        ref={starsRef}
        radius={50}
        depth={50}
        count={3000}
        factor={3}
        saturation={0.1}
        fade
        speed={0.5}
      />

      {/* shooting stars */}
      {shootingStars.map((star) => (
        <ShootingStarMesh
          key={star.id}
          star={star}
          onComplete={handleStarComplete}
        />
      ))}

      {/* subtle ambient light */}
      <ambientLight intensity={0.1} />
    </>
  );
};

interface ShootingStarsProps {
  className?: string;
}

/**
 * Shooting stars.
 */
const ShootingStars = ({ className }: ShootingStarsProps) => {
  const [mounted, setMounted] = useState(false);

  // only render on client to avoid SSR issues
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-0 overflow-hidden",
        className,
      )}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        style={{ background: "transparent" }}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 1.5]}
      >
        <StarScene />
      </Canvas>
    </div>
  );
};

export default ShootingStars;
