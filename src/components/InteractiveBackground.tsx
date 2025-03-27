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
  const maxParticlesOnScreen = useRef(120); // Further reduced from 180 to 120
  const particleLifetimeLimit = useRef(12000); // Further reduced from 15s to 12s
  const lastFrameTime = useRef(0);
  const frameCount = useRef(0);

  // More aggressive throttling
  const lastParticleCreationTime = useRef(0);
  const particleCreationThrottle = useRef(150); // Increased from 100ms to 150ms
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
      particleDensity: isLowPerfDevice ? 20000 : 15000, // Further increased for fewer particles
      maxParticles: isLowPerfDevice ? 60 : 120, // Further reduced
      lifetime: isLowPerfDevice ? 8000 : 12000, // Even shorter lifetime
      connectionDistance: isLowPerfDevice ? 90 : 120, // Reduced connection distance
      drawLimit: isLowPerfDevice ? 60 : 100, // Limit particles rendered
      skipFrames: isLowPerfDevice ? 3 : 2, // Skip more frames
      targetFPS: isLowPerfDevice ? 24 : 30, // Lower target FPS
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
      if (now - mouseMoveThrottleTime.current < 50) { // 50ms throttle (20fps)
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
    const particleCount = Math.min(Math.floor((width * height) / perfSettings.particleDensity), maxParticlesOnScreen.current);
    const newParticles: Particle[] = [];
    const currentTime = performance.now();

    for (let i = 0; i < particleCount; i++) {
      const hueOffset = Math.random() * 40 - 20;
      const size = Math.random() * 2 + 0.5; // Even smaller particles
      const glow = Math.random() * 0.5 + 0.1; // Reduced glow

      newParticles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size,
        vx: (Math.random() - 0.5) * 0.25, // Even slower movement
        vy: (Math.random() - 0.5) * 0.25,
        color: getParticleColor(hueOffset),
        alpha: Math.random() * 0.4 + 0.1, // Lower alpha
        life: Math.random() * 70 + 150, // Shorter life
        maxLife: Math.random() * 70 + 150,
        hue: (globalHue.current + hueOffset) % 360,
        hueSpeed: Math.random() * 0.08 - 0.04, // Even slower hue changes
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
      particles.current.length >= maxParticlesOnScreen.current * 0.85 || // Only at 85% capacity
      currentTime - lastParticleCreationTime.current < particleCreationThrottle.current
    ) {
      return;
    }

    // Determine how many particles we can safely create - fewer
    const roomForParticles = Math.min(20, Math.floor(maxParticlesOnScreen.current * 0.85) - particles.current.length);
    const actualCount = Math.min(count, roomForParticles);

    if (actualCount <= 0) return;

    const explosionParticles: Particle[] = [];

    for (let i = 0; i < actualCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 1.5 + 0.8; // Slower particles
      const hueOffset = Math.random() * 60 - 30;
      const size = Math.random() * 2 + 0.8;
      const glow = Math.random() * 0.6 + 0.2;

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

      // More agressive frame skipping
      frameCount.current = (frameCount.current + 1) % (framesToSkip + 1);
      if (frameCount.current !== 0) {
        lastFrameTime.current = currentTime;
        animationFrameId.current = requestAnimationFrame(draw);
        return;
      }

      lastFrameTime.current = currentTime;

      // Clear with composite operation - faster fading
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0,0,0,0.22)'; // Increased to reduce trails even more
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

        // Only larger particles get glow effects - and only 1 in 3 particles
        if (p.size > 1.8 && combinedAlpha > 0.4 && i % 3 === 0) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * (1 + p.glow * 0.5), 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${p.hue}, 95%, 70%, ${combinedAlpha * 0.08})`;
          ctx.fill();
        }

        // Draw connections only for a small subset of particles (1 in 4)
        if (combinedAlpha > 0.3 && i % 4 === 0) {
          // Limit to just 1 connection per particle for better performance
          for (let j = i + 1; j < particlesToProcess && j < i + 10; j++) {
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

        // Simplified mouse interaction
        if (isMouseInside) {
          const dx = p.x - mousePosition.x;
          const dy = p.y - mousePosition.y;
          const distSquared = dx * dx + dy * dy;
          const maxInteractDistSquared = 150 * 150; // Reduced interaction radius

          if (distSquared < maxInteractDistSquared) {
            const distance = Math.sqrt(distSquared);
            const force = (150 - distance) / (isClicked ? 450 : 650); // Reduced force
            p.vx += dx * force;
            p.vy += dy * force;
          }
        }

        // Simplified motion updates
        p.vx += globalMouseForceX * (1 - p.size / 3);
        p.vy += globalMouseForceY * (1 - p.size / 3);
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.96; // Increased friction
        p.vy *= 0.96;

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

      // Add new particles less frequently (1/3 of previous rate)
      if (
        particles.current.length < maxParticlesOnScreen.current * 0.7 && // Only fill to 70%
        Math.random() < 0.015 && // Much lower probability
        currentTime - lastParticleCreationTime.current > particleCreationThrottle.current * 3
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
      setIsClicked(true);
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;

      setMousePosition({ x, y });
      setIsMouseInside(true);
      createExplosion(x, y, 10); // Reduced particle count (was 20)
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();

      const now = performance.now();
      if (now - lastTouchTime < 50) return; // About 20fps throttling
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
      setTimeout(() => setIsMouseInside(false), 300); // Reduced from 500ms
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
