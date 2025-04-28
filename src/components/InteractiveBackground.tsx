"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";

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

export default function InteractiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
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
    const ctx = canvas.getContext("2d", { alpha: true, desynchronized: true }); // Use desynchronized for better performance
    if (!ctx) return;

    // For low-end devices, use a minimal animation technique or a static background
    if (isLowPerfDevice && window.innerWidth < 768) {
      // For very low-performance devices on small screens, just draw a simple gradient
      ctx.fillStyle = '#050e1b';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add a simple gradient effect instead of particles
      const gradient = ctx.createRadialGradient(
        canvas.width/2, canvas.height/2, 10,
        canvas.width/2, canvas.height/2, canvas.width/2
      );
      gradient.addColorStop(0, 'rgba(59, 130, 246, 0.15)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw a few fixed stars
      for (let i = 0; i < 30; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const radius = Math.random() * 1.5 + 0.5;

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${220 + Math.random() * 30}, 80%, 70%, ${Math.random() * 0.6 + 0.2})`;
        ctx.fill();
      }

      return;
    }

    const targetFPS = perfSettings.targetFPS;
    const frameInterval = 1000 / targetFPS;
    const framesToSkip = perfSettings.skipFrames;

    // Pre-compute several constants to avoid recalculations in the animation loop
    const fadeStartPoint = particleLifetimeLimit.current * 0.3;
    const connectionDistSquared = perfSettings.connectionDistance * perfSettings.connectionDistance;

    const draw = () => {
      if (!canvas) return;

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

      // Clear with composite operation - faster fading
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0,0,0,0.08)'; // Reduced further from 0.12 to 0.08 for better visibility
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = 'source-over';

      // Limit the particles we process
      const particleLimit = perfSettings.drawLimit;
      const particlesToProcess = Math.min(particles.current.length, particleLimit);
      const newParticles: Particle[] = [];

      // Simplified global mouse influence
      const mouseInfluenceStrength = 0.01; // Further reduced
      const globalMouseForceX = mouseInfluenceRef.current.x * mouseInfluenceStrength;
      const globalMouseForceY = mouseInfluenceRef.current.y * mouseInfluenceStrength;

      // Process particles in batch for better performance
      for (let i = 0; i < particlesToProcess; i++) {
        const p = particles.current[i];

        // Age-based removal
        const particleAge = currentTime - p.creationTime;
        if (particleAge > particleLifetimeLimit.current) continue;
        if (p.life <= 0) continue;

        // Update particle
        p.life--;
        p.hue = (p.hue + p.hueSpeed) % 360;

        // Calculate alpha factors
        const lifeFactor = p.life / p.maxLife;
        let ageFactor = 1;
        if (particleAge > fadeStartPoint) {
          const fadeProgress = (particleAge - fadeStartPoint) / (particleLifetimeLimit.current - fadeStartPoint);
          ageFactor = 1 - (fadeProgress * fadeProgress);
        }
        const combinedAlpha = lifeFactor * ageFactor;

        // Skip nearly invisible particles
        if (combinedAlpha < 0.05) continue;

        // Very simplified drawing - just the particle core for most particles
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 91%, 65%, ${p.alpha * combinedAlpha})`;
        ctx.fill();

        // Only larger particles get glow effects - and only 1 in 4 particles (decreased from 1 in 3)
        if (p.size > 1.8 && combinedAlpha > 0.4 && i % 4 === 0) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * (1 + p.glow * 0.4), 0, Math.PI * 2); // Reduced glow size multiplier
          ctx.fillStyle = `hsla(${p.hue}, 95%, 70%, ${combinedAlpha * 0.07})`; // Reduced opacity
          ctx.fill();
        }

        // Draw connections only for a small subset of particles (1 in 6) - reduced from 1 in 4
        if (combinedAlpha > 0.3 && i % 6 === 0) {
          // Limit to just 1 connection per particle for better performance
          for (let j = i + 1; j < particlesToProcess && j < i + 8; j++) {
            const p2 = particles.current[j];
            if (p2.life <= 0) continue;

            const dx = p.x - p2.x;
            const dy = p.y - p2.y;
            const distSquared = dx * dx + dy * dy;

            if (distSquared < connectionDistSquared) {
              const distance = Math.sqrt(distSquared);
              const opacityFactor = 0.05 * combinedAlpha * (1 - distance / perfSettings.connectionDistance);

              if (opacityFactor > 0.02) {
                ctx.beginPath();
                ctx.strokeStyle = `hsla(${p.hue}, 91%, 70%, ${opacityFactor})`;
                ctx.lineWidth = 0.2; // Thinner lines
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
              }
              break; // Just one connection per particle
            }
          }
        }

        // Simplified mouse interaction - reduced influence
        if (isMouseInside) {
          const dx = p.x - mousePosition.x;
          const dy = p.y - mousePosition.y;
          const distSquared = dx * dx + dy * dy;
          const maxInteractDistSquared = 120 * 120; // Further reduced interaction radius from 150 to 120

          if (distSquared < maxInteractDistSquared) {
            const distance = Math.sqrt(distSquared);
            const force = (120 - distance) / (isClicked ? 600 : 800); // Further reduced force
            p.vx += dx * force;
            p.vy += dy * force;
          }
        }

        // Simplified motion updates with more damping
        p.vx += globalMouseForceX * (1 - p.size / 3) * 0.8; // Reduced force by 20%
        p.vy += globalMouseForceY * (1 - p.size / 3) * 0.8; // Reduced force by 20%
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.94; // Increased friction from 0.96 to 0.94
        p.vy *= 0.94; // Increased friction from 0.96 to 0.94

        // Simple boundary check
        if (p.x < 0 || p.x > canvas.width) {
          p.vx *= -1;
          p.x = p.x < 0 ? 0 : canvas.width;
        }
        if (p.y < 0 || p.y > canvas.height) {
          p.vy *= -1;
          p.y = p.y < 0 ? 0 : canvas.height;
        }

        newParticles.push(p);
      }

      particles.current = newParticles;

      // Add new particles less frequently
      if (
        particles.current.length < maxParticlesOnScreen.current * 0.6 && // Only fill to 60%, reduced from 70%
        Math.random() < 0.01 && // Lower probability, reduced from 0.015
        currentTime - lastParticleCreationTime.current > particleCreationThrottle.current * 4 // Increased throttle
      ) {
        const hueOffset = Math.random() * 40 - 20;
        const size = Math.random() * 2 + 0.5;
        const glow = Math.random() * 0.5 + 0.1;

        particles.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          color: getParticleColor(hueOffset),
          alpha: Math.random() * 0.4 + 0.1,
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
  }, [dimensions, mousePosition, isMouseInside, isClicked, getParticleColor, enforceParticleLimit, perfSettings, isLowPerfDevice]);

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
    <div className="fixed inset-0 -z-10 pointer-events-none bg-[#050e1b]">
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
