"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes"; // Import useTheme

interface Particle {
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
  hue: number;
  hueSpeed: number;
  glow: number;
  creationTime: number;
}

// --- Animation Helper Functions ---

// Modificação da função getCombinedAlpha para incluir efeito de twinkle
function getCombinedAlpha(
  currentTime: number,
  fadeStartPoint: number,
  lifetimeLimit: number,
  p: Particle
): number {
  const particleAge = currentTime - p.creationTime;
  const lifeFactor = p.life / p.maxLife;
  let ageFactor = 1;
  if (particleAge > fadeStartPoint) {
    const fadeProgress = (particleAge - fadeStartPoint) / (lifetimeLimit - fadeStartPoint);
    ageFactor = 1 - fadeProgress * fadeProgress;
  }
  // Efeito de twinkle: oscila entre 0.8 e 1.0
  const twinkle = 0.9 + 0.1 * Math.sin(currentTime / 300 + p.creationTime);
  return lifeFactor * ageFactor * twinkle;
}

// Modificação de drawParticle para animar o tamanho (pulsar) e intensificar o glow
const drawParticle = (
  ctx: CanvasRenderingContext2D,
  p: Particle,
  currentTime: number,
  fadeStartPoint: number,
  lifetimeLimit: number
) => {
  const combinedAlpha = getCombinedAlpha(currentTime, fadeStartPoint, lifetimeLimit, p);
  if (combinedAlpha < 0.05) return; // Ignora partículas quase invisíveis

  // Animação de pulsação: varia o tamanho com base em uma função seno
  const pulsateFactor = 1 + 0.1 * Math.sin(currentTime / 400 + p.creationTime);
  const particleSize = p.size * pulsateFactor;

  ctx.beginPath();
  ctx.arc(p.x, p.y, particleSize, 0, Math.PI * 2);
  ctx.fillStyle = `hsla(${p.hue}, 91%, 65%, ${p.alpha * combinedAlpha})`;
  ctx.fill();

  // Glow animado e intensificado para partículas maiores e brilhantes
  if (particleSize > 1.5 && combinedAlpha > 0.4) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, particleSize * (1 + p.glow * 0.6), 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${p.hue}, 95%, 70%, ${combinedAlpha * 0.1})`;
    ctx.fill();
  }
};

// Updated drawConnections using getCombinedAlpha and fixed loop condition
const drawConnections = (
  ctx: CanvasRenderingContext2D,
  particlesToProcess: Particle[],
  currentIndex: number,
  connectionDistSquared: number,
  connectionDistance: number,
  currentTime: number,
  fadeStartPoint: number,
  lifetimeLimit: number
) => {
  const p = particlesToProcess[currentIndex];
  const combinedAlpha = getCombinedAlpha(currentTime, fadeStartPoint, lifetimeLimit, p);
  if (combinedAlpha < 0.3) return; // Skip if too faint

  // Limit connections checked per particle
  for (let j = currentIndex + 1; j < particlesToProcess.length && j < currentIndex + 8; j++) {
    const p2 = particlesToProcess[j];
    if (p2.life <= 0) continue;

    const dx = p.x - p2.x;
    const dy = p.y - p2.y;
    const distSquared = dx * dx + dy * dy;

    if (distSquared < connectionDistSquared) {
      const distance = Math.sqrt(distSquared);
      const opacityFactor = 0.05 * combinedAlpha * (1 - distance / connectionDistance);
      if (opacityFactor > 0.02) {
        ctx.beginPath();
        ctx.strokeStyle = `hsla(${p.hue}, 91%, 70%, ${opacityFactor})`;
        ctx.lineWidth = 0.2;
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }
      break; // Only one connection per particle
    }
  }
};

// Add helper updateParticle function
const updateParticle = (
  p: Particle,
  currentTime: number,
  fadeStartPoint: number,
  lifetimeLimit: number,
  mousePos: { x: number; y: number },
  isMouseInside: boolean,
  isClicked: boolean,
  globalMouseForceX: number,
  globalMouseForceY: number,
  canvasWidth: number,
  canvasHeight: number
): Particle | null => {
  // Decrement life based on elapsed time
  const age = currentTime - p.creationTime;
  p.life = p.maxLife - age;
  // Update particle position with its velocity and global mouse influence
  p.x += p.vx + globalMouseForceX;
  p.y += p.vy + globalMouseForceY;
  // Update hue progressively
  p.hue = (p.hue + p.hueSpeed) % 360;
  // Wrap-around if particle goes beyond canvas boundaries
  if (p.x < 0) p.x = canvasWidth;
  if (p.x > canvasWidth) p.x = 0;
  if (p.y < 0) p.y = canvasHeight;
  if (p.y > canvasHeight) p.y = 0;
  // Return null if particle expired
  return p.life > 0 ? p : null;
};

// --- Main Component ---
export default function InteractiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme, systemTheme, resolvedTheme } = useTheme(); // Get theme info
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMouseInside, setIsMouseInside] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const particles = useRef<Particle[]>([]);
  const animationFrameId = useRef<number | null>(null);
  const globalHue = useRef(220);
  const mouseInfluenceRef = useRef({ x: 0, y: 0 });
  const maxParticlesOnScreen = useRef(70); // Further reduced from 120 to 70
  const particleLifetimeLimit = useRef(10000); // Reduced from 12s to 10s
  const lastFrameTime = useRef(0);
  const frameCount = useRef(0);

  // More aggressive throttling
  const lastParticleCreationTime = useRef(0);
  const particleCreationThrottle = useRef(200); // Increased from 150ms to 200ms
  const mouseMoveThrottleTime = useRef(0);

  // Use ResizeObserver instead of window resize event
  const resizeObserver = useRef<ResizeObserver | null>(null);

  // Detect device capabilities once
  const isLowPerfDevice = useMemo(() => {
    if (typeof window === 'undefined') return true;
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const cpuCores = navigator.hardwareConcurrency || 4;
    return isMobile || cpuCores <= 4;
  }, []);

  // Performance settings based on device capability - more conservative
  const perfSettings = useMemo(() => {
    return {
      particleDensity: isLowPerfDevice ? 30000 : 20000, // Increased for fewer particles
      maxParticles: isLowPerfDevice ? 40 : 70, // Reduced even further
      lifetime: isLowPerfDevice ? 6000 : 10000, // Shorter lifetime
      connectionDistance: isLowPerfDevice ? 70 : 100, // Reduced connection distance
      drawLimit: isLowPerfDevice ? 40 : 70, // Limit particles rendered
      skipFrames: isLowPerfDevice ? 4 : 3, // Skip more frames
      targetFPS: isLowPerfDevice ? 20 : 25, // Lower target FPS
    };
  }, [isLowPerfDevice]);

  useEffect(() => {
    maxParticlesOnScreen.current = perfSettings.maxParticles;
    particleLifetimeLimit.current = perfSettings.lifetime;
  }, [perfSettings]);

  // Track document-wide mouse position with heavy throttling
  useEffect(() => {
    const trackDocumentMousePosition = (e: MouseEvent) => {
      const now = performance.now();
      if (now - mouseMoveThrottleTime.current < 100) { // 10fps throttle (increased from 50ms to 100ms)
        return;
      }
      mouseMoveThrottleTime.current = now;

      const normalizedX = (e.clientX / window.innerWidth) * 2 - 1;
      const normalizedY = (e.clientY / window.innerHeight) * 2 - 1;
      mouseInfluenceRef.current = { x: normalizedX, y: normalizedY };
    };

    document.addEventListener('mousemove', trackDocumentMousePosition, { passive: true });
    return () => {
      document.removeEventListener('mousemove', trackDocumentMousePosition);
    };
  }, []);

  // Smoothly changing global hue - slower update frequency
  useEffect(() => {
    const interval = setInterval(() => {
      globalHue.current = ((globalHue.current + 0.08) % 80) + 200; // Further reduced speed
    }, 250); // Increased from 200ms to 250ms

    return () => clearInterval(interval);
  }, []);

  // Memoized particle color function
  const getParticleColor = useCallback((hueOffset: number = 0, lightness: number = 65, saturation: number = 91) => {
    const hue = (globalHue.current + hueOffset) % 360;
    return `hsla(${hue}, ${saturation}%, ${lightness}%, 0.8)`;
  }, []);

  // Enforce max particle limit
  const enforceParticleLimit = useCallback(() => {
    if (particles.current.length > maxParticlesOnScreen.current) {
      particles.current.sort((a, b) => a.creationTime - b.creationTime);
      particles.current = particles.current.slice(
        particles.current.length - maxParticlesOnScreen.current
      );
    }
  }, []);

  // Initialize particles - fewer particles
  const initializeParticles = useCallback((width: number, height: number) => {
    const particleCount = Math.min(Math.floor((width * height) / perfSettings.particleDensity), maxParticlesOnScreen.current * 0.8); // Only start with 80% of max particles
    const newParticles: Particle[] = [];
    const currentTime = performance.now();

    for (let i = 0; i < particleCount; i++) {
      const hueOffset = Math.random() * 40 - 20;
      const size = Math.random() * 1.5 + 0.5; // Even smaller particles
      const glow = Math.random() * 0.4 + 0.1; // Reduced glow

      newParticles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size,
        vx: (Math.random() - 0.5) * 0.15, // Even slower movement
        vy: (Math.random() - 0.5) * 0.15,
        color: getParticleColor(hueOffset),
        alpha: Math.random() * 0.3 + 0.1, // Lower alpha
        life: Math.random() * 50 + 100, // Shorter life
        maxLife: Math.random() * 50 + 100,
        hue: (globalHue.current + hueOffset) % 360,
        hueSpeed: Math.random() * 0.06 - 0.03, // Even slower hue changes
        glow,
        creationTime: currentTime
      });
    }

    particles.current = newParticles;
  }, [getParticleColor, perfSettings.particleDensity]);

  // Create explosion particles - even fewer and simpler
  const createExplosion = useCallback((x: number, y: number, count: number) => {
    const currentTime = performance.now();

    // More restrictive particle creation checking
    if (
      particles.current.length >= maxParticlesOnScreen.current * 0.75 || // Only at 75% capacity, lowered from 85%
      currentTime - lastParticleCreationTime.current < particleCreationThrottle.current * 1.5
    ) {
      return;
    }

    // Determine how many particles we can safely create - fewer
    const roomForParticles = Math.min(12, Math.floor(maxParticlesOnScreen.current * 0.75) - particles.current.length); // Reduced from 20 to 12
    const actualCount = Math.min(count, roomForParticles);

    if (actualCount <= 0) return;

    const explosionParticles: Particle[] = [];

    for (let i = 0; i < actualCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 1.2 + 0.6; // Slower particles
      const hueOffset = Math.random() * 60 - 30;
      const size = Math.random() * 1.8 + 0.8; // Slightly smaller
      const glow = Math.random() * 0.5 + 0.2; // Reduced glow

      explosionParticles.push({
        x,
        y,
        size,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: getParticleColor(hueOffset, 70, 95),
        alpha: Math.random() * 0.6 + 0.2,
        life: Math.random() * 40 + 25, // Even shorter lifetime
        maxLife: Math.random() * 40 + 25,
        hue: (globalHue.current + hueOffset) % 360,
        hueSpeed: Math.random() * 0.15 - 0.075,
        glow,
        creationTime: currentTime
      });
    }

    lastParticleCreationTime.current = currentTime;
    particles.current = [...particles.current, ...explosionParticles];
    enforceParticleLimit();
  }, [getParticleColor, enforceParticleLimit]);

  // Resize handler with debouncing
  useEffect(() => {
    let resizeTimeout: ReturnType<typeof setTimeout>;

    const handleResize = () => {
      clearTimeout(resizeTimeout);

      resizeTimeout = setTimeout(() => {
        if (canvasRef.current && canvasRef.current.parentElement) {
          const width = window.innerWidth;
          const height = window.innerHeight;
          setDimensions({ width, height });

          // Skip reinitialization on minor resizes
          const currentParticleCount = particles.current.length;
          const newExpectedCount = Math.min(Math.floor((width * height) / perfSettings.particleDensity), maxParticlesOnScreen.current);
          const sizeDifference = Math.abs(currentParticleCount - newExpectedCount);

          // Only reinitialize if there's a significant change (30% difference)
          if (sizeDifference > currentParticleCount * 0.3) {
            initializeParticles(width, height);
          }
        }
      }, 200); // 200ms debounce
    };

    handleResize();

    // Use ResizeObserver with debounce
    if (!resizeObserver.current && typeof ResizeObserver !== 'undefined') {
      resizeObserver.current = new ResizeObserver(() => {
        requestAnimationFrame(handleResize);
      });

      if (canvasRef.current?.parentElement) {
        resizeObserver.current.observe(canvasRef.current.parentElement);
      }
    } else {
      // Fallback to window resize
      window.addEventListener("resize", handleResize, { passive: true });
    }

    return () => {
      clearTimeout(resizeTimeout);

      if (resizeObserver.current) {
        resizeObserver.current.disconnect();
      }
      window.removeEventListener("resize", handleResize);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [initializeParticles, perfSettings.particleDensity]);

  // Animation loop with optimizations
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { alpha: true, desynchronized: true });
    if (!ctx) return;

    // Get the computed background color based on the current theme
    const computedStyle = getComputedStyle(document.documentElement);
    const backgroundColor = computedStyle.getPropertyValue('--background').trim(); // e.g., "0 0% 100%"
    // Convert HSL string from CSS variable to a usable color string (e.g., "hsl(0 0% 100%)")
    // Or use a simpler approach if your variables are direct color values
    const canvasBackgroundColor = `hsl(${backgroundColor})`; // Assumes variables are HSL values like "0 0% 100%"
    const canvasClearColor = resolvedTheme === 'dark' ? 'rgba(5, 14, 27, 0.08)' : 'rgba(255, 255, 255, 0.08)'; // Adjust clear color based on theme

    // For low-end devices, use a minimal animation technique or a static background
    if (isLowPerfDevice && window.innerWidth < 768) {
      // Fill with the current theme's background color
      ctx.fillStyle = canvasBackgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add a simple gradient effect (adjust colors based on theme if desired)
      const gradientCenterColor = resolvedTheme === 'dark' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(59, 130, 246, 0.05)';
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 10,
        canvas.width / 2, canvas.height / 2, canvas.width / 2
      );
      gradient.addColorStop(0, gradientCenterColor);
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)'); // Keep outer transparent
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw a few fixed stars (adjust colors based on theme if desired)
      const starColorBase = resolvedTheme === 'dark' ? 220 : 220; // Keep blueish for both?
      const starLightness = resolvedTheme === 'dark' ? 70 : 50;
      for (let i = 0; i < 30; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const radius = Math.random() * 1.5 + 0.5;

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${starColorBase + Math.random() * 30}, 80%, ${starLightness}%, ${Math.random() * 0.6 + 0.2})`;
        ctx.fill();
      }

      return; // Stop animation loop for this simple case
    }

    const targetFPS = perfSettings.targetFPS;
    const frameInterval = 1000 / targetFPS;
    const framesToSkip = perfSettings.skipFrames;
    const fadeStartPoint = particleLifetimeLimit.current * 0.3;
    const connectionDistSquared = perfSettings.connectionDistance * perfSettings.connectionDistance;

    const draw = () => {
      if (!canvasRef.current || !ctx) return; // Ensure canvas and ctx exist

      const currentTime = performance.now();
      const deltaTime = currentTime - lastFrameTime.current;

      // Skip frames if running too fast
      if (deltaTime < frameInterval) {
        animationFrameId.current = requestAnimationFrame(draw);
        return;
      }

      // More aggressive frame skipping
      frameCount.current = (frameCount.current + 1) % (framesToSkip + 1);
      if (frameCount.current !== 0) {
        lastFrameTime.current = currentTime;
        animationFrameId.current = requestAnimationFrame(draw);
        return;
      }

      lastFrameTime.current = currentTime;

      // Clear canvas
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = canvasClearColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = 'source-over';

      // Limit particles processed
      const particleLimit = perfSettings.drawLimit;
      const currentParticles = particles.current; // Cache current particles
      const particlesToProcessCount = Math.min(currentParticles.length, particleLimit);
      const newParticles: Particle[] = [];

      // Simplified global mouse influence
      const mouseInfluenceStrength = 0.01;
      const globalMouseForceX = mouseInfluenceRef.current.x * mouseInfluenceStrength;
      const globalMouseForceY = mouseInfluenceRef.current.y * mouseInfluenceStrength;

      // Process and Update Particles
      for (let i = 0; i < particlesToProcessCount; i++) {
        const updatedP = updateParticle(
          currentParticles[i], currentTime, fadeStartPoint, particleLifetimeLimit.current,
          mousePosition, isMouseInside, isClicked, globalMouseForceX, globalMouseForceY,
          canvas.width, canvas.height
        );
        if (updatedP) {
          newParticles.push(updatedP);
        }
      }
      particles.current = newParticles; // Update particle array after processing all

      // Draw Particles and Connections
      const particlesToDraw = particles.current; // Use the updated array for drawing
      const particlesToDrawCount = Math.min(particlesToDraw.length, particleLimit);

      for (let i = 0; i < particlesToDrawCount; i++) {
        drawParticle(ctx, particlesToDraw[i], currentTime, fadeStartPoint, particleLifetimeLimit.current);
        // Draw connections less frequently
        if (i % 6 === 0) {
          drawConnections(
            ctx, particlesToDraw, i, connectionDistSquared, perfSettings.connectionDistance,
            currentTime, fadeStartPoint, particleLifetimeLimit.current
          );
        }
      }

      // Add new particles less frequently
      if (
        particles.current.length < maxParticlesOnScreen.current * 0.7 && // Permite até 70% do limite
        Math.random() < 0.02 && // Probabilidade um pouco maior para criar novas partículas
        currentTime - lastParticleCreationTime.current > particleCreationThrottle.current * 2
      ) {
        const hueOffset = Math.random() * 40 - 20;
        const size = Math.random() * 2 + 0.5;
        const glow = Math.random() * 0.5 + 0.2;
        particles.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          color: getParticleColor(hueOffset),
          alpha: Math.random() * 0.5 + 0.2,
          life: Math.random() * 70 + 150,
          maxLife: Math.random() * 70 + 150,
          hue: (globalHue.current + hueOffset) % 360,
          hueSpeed: Math.random() * 0.08 - 0.04,
          glow,
          creationTime: currentTime
        });
        lastParticleCreationTime.current = currentTime;
      }

      // Safety check for particle limit
      enforceParticleLimit();
      animationFrameId.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
    // Add resolvedTheme as a dependency to re-run effect when theme changes
  }, [dimensions, mousePosition, isMouseInside, isClicked, getParticleColor, enforceParticleLimit, perfSettings, isLowPerfDevice, resolvedTheme]); // Add ctx to dependencies if it changes

  // Mouse interaction with more aggressive throttling
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    let lastMoveTime = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const now = performance.now();
      if (now - lastMoveTime < 33) return; // About 30fps throttling
      lastMoveTime = now;

      const rect = canvas.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    const handleMouseEnter = () => setIsMouseInside(true);
    const handleMouseLeave = () => setIsMouseInside(false);

    const handleMouseDown = (e: MouseEvent) => {
      setIsClicked(true);
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      createExplosion(x, y, 15); // Further reduced particles (was 25)
    };

    const handleMouseUp = () => setIsClicked(false);

    canvas.addEventListener("mousemove", handleMouseMove, { passive: true });
    canvas.addEventListener("mouseenter", handleMouseEnter, { passive: true });
    canvas.addEventListener("mouseleave", handleMouseLeave, { passive: true });
    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mouseup", handleMouseUp);

    // Touch events with throttling
    let lastTouchTime = 0;

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();

      const now = performance.now();
      if (now - lastTouchTime < 200) return; // 5fps throttle for touch start
      lastTouchTime = now;

      setIsClicked(true);
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;

      setMousePosition({ x, y });
      setIsMouseInside(true);
      createExplosion(x, y, 6); // Further reduced from 10 to 6 particles
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();

      const now = performance.now();
      if (now - lastTouchTime < 100) return; // More aggressive 10fps throttling, up from 50ms
      lastTouchTime = now;

      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      setMousePosition({
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      });
    };

    const handleTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
      setIsClicked(false);
      setTimeout(() => setIsMouseInside(false), 200); // Reduced even more from 300ms to 200ms
    };

    canvas.addEventListener("touchstart", handleTouchStart);
    canvas.addEventListener("touchmove", handleTouchMove);
    canvas.addEventListener("touchend", handleTouchEnd);

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseenter", handleMouseEnter);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("touchend", handleTouchEnd);
    };
  }, [createExplosion]);

  return (
    // Use bg-background to apply the theme's background color
    <div className="fixed inset-0 -z-10 pointer-events-none bg-background">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0"
      >
        <canvas
          ref={canvasRef}
          width={dimensions.width}
          height={dimensions.height}
          className="w-full h-full pointer-events-auto"
        />
      </motion.div>
    </div>
  );
}
