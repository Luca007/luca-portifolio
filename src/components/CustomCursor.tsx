"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

export default function CustomCursor() {
  const { content } = useLanguage();
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);
  const [cursorState, setCursorState] = useState({
    isPointer: false,
    isClicking: false,
    isLinkHovered: false,
    isButtonHovered: false,
    isScrollable: false
  });
  const [hasInteracted, setHasInteracted] = useState(false);

  // Use ref to track the last position for throttling
  const lastUpdateTime = useRef(0);
  const lastTargetRef = useRef<HTMLElement | null>(null);
  const rafId = useRef<number | null>(null);

  // Skip rendering on touch devices entirely
  const isTouchDevice = useMemo(() => {
    if (typeof window === 'undefined') return true;
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }, []);

  // Only show custom effects after first interaction to avoid distractions on load
  const handleFirstInteraction = useCallback(() => {
    if (!hasInteracted) {
      setHasInteracted(true);
    }
  }, [hasInteracted]);

  // Optimized update position function using requestAnimationFrame
  const updatePosition = useCallback((e: MouseEvent) => {
    const now = performance.now();

    // Update mouse position at 30fps max (throttle updates to every ~33ms)
    if (now - lastUpdateTime.current < 33) {
      if (rafId.current === null) {
        rafId.current = requestAnimationFrame(() => {
          setPosition({ x: e.clientX, y: e.clientY });
          rafId.current = null;
        });
      }
      return;
    }

    lastUpdateTime.current = now;
    setPosition({ x: e.clientX, y: e.clientY });

    if (!visible) setVisible(true);
    handleFirstInteraction();

    // Only process element state changes if not processing the same element
    const target = e.target as HTMLElement;
    if (target === lastTargetRef.current) return;
    lastTargetRef.current = target;

    // Process once per frame for performance
    requestAnimationFrame(() => {
      // Check if cursor is over a clickable element
      const isAnyLink =
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        !!target.closest('a') ||
        !!target.closest('button') ||
        getComputedStyle(target).cursor === 'pointer';

      // Check if cursor is over a link
      const isLink = target.tagName === 'A' || !!target.closest('a');

      // Check if cursor is over a button
      const isButton = target.tagName === 'BUTTON' || !!target.closest('button');

      // Check if cursor is over a scrollable area (except the document)
      const isOverScrollable =
        !!target.closest('[role="dialog"]') ||
        (target.scrollHeight > target.clientHeight && target !== document.documentElement) ||
        target.classList.contains('overflow-auto') ||
        target.classList.contains('overflow-scroll');

      // Update state only if something changed to prevent unnecessary renders
      setCursorState(prev => {
        if (
          prev.isPointer !== isAnyLink ||
          prev.isLinkHovered !== isLink ||
          prev.isButtonHovered !== isButton ||
          prev.isScrollable !== isOverScrollable
        ) {
          return {
            ...prev,
            isPointer: isAnyLink,
            isLinkHovered: isLink,
            isButtonHovered: isButton,
            isScrollable: isOverScrollable
          };
        }
        return prev;
      });
    });
  }, [visible, handleFirstInteraction]);

  // Track mouse down/up for click effect
  const handleMouseDown = useCallback(() => {
    setCursorState(prev => ({ ...prev, isClicking: true }));
    handleFirstInteraction();
  }, [handleFirstInteraction]);

  const handleMouseUp = useCallback(() => {
    setCursorState(prev => ({ ...prev, isClicking: false }));
  }, []);

  // Hide cursor when it leaves the window
  const handleMouseLeave = useCallback(() => {
    setVisible(false);
  }, []);

  const handleMouseEnter = useCallback(() => {
    setVisible(true);
  }, []);

  useEffect(() => {
    // Don't run any of this on touch devices
    if (isTouchDevice) return;

    // Add all event listeners with passive: true for performance
    document.addEventListener('mousemove', updatePosition, { passive: true });
    document.addEventListener('mousedown', handleMouseDown, { passive: true });
    document.addEventListener('mouseup', handleMouseUp, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    document.addEventListener('mouseenter', handleMouseEnter, { passive: true });

    // Apply cursor style to the document
    document.documentElement.classList.add('custom-cursor');
    document.documentElement.style.cursor = 'none';

    // Clean up
    return () => {
      document.removeEventListener('mousemove', updatePosition);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.documentElement.classList.remove('custom-cursor');
      document.documentElement.style.cursor = '';

      // Cancel any pending animation frames
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [
    updatePosition,
    handleMouseDown,
    handleMouseUp,
    handleMouseLeave,
    handleMouseEnter,
    isTouchDevice
  ]);

  // Don't render on server-side, when not visible, or on touch devices
  if (typeof window === 'undefined' || !visible || isTouchDevice) return null;

  const { isPointer, isClicking, isLinkHovered, isButtonHovered, isScrollable } = cursorState;

  return (
    <>
      {/* Main cursor dot */}
      <motion.div
        className="fixed top-0 left-0 w-3 h-3 bg-white rounded-full mix-blend-difference pointer-events-none z-[9999]"
        style={{
          x: position.x - 6,
          y: position.y - 6,
          scale: isClicking ? 0.6 : 1,
        }}
        transition={{
          type: "spring",
          damping: 25,
          stiffness: 300,
          mass: 0.3
        }}
      />

      {/* Interactive cursor ring - only show if visible */}
      <motion.div
        className="fixed top-0 left-0 w-10 h-10 rounded-full border-2 pointer-events-none z-[9999] flex items-center justify-center"
        style={{
          x: position.x - 20,
          y: position.y - 20,
          scale: isPointer ? 1.2 : isScrollable ? 1.1 : 1,
          opacity: (isPointer || isScrollable) ? 0.9 : 0.5,
          borderColor: isLinkHovered
            ? "rgb(59, 130, 246)"
            : isButtonHovered
              ? "rgb(139, 92, 246)"
              : isScrollable
                ? "rgb(99, 102, 241)"
                : "rgb(200, 200, 200)"
        }}
        transition={{
          type: "spring",
          damping: 15,
          stiffness: 150,
          mass: 0.6,
          opacity: { duration: 0.2 }
        }}
      >
        {isLinkHovered && (
          <span className="text-[10px] text-primary font-medium">
            Ver
          </span>
        )}

        {isButtonHovered && (
          <span className="text-[10px] text-purple-400 font-medium">
            Clicar
          </span>
        )}

        {isScrollable && !isPointer && (
          <span className="text-[10px] text-indigo-400 font-medium">
            Rolar
          </span>
        )}
      </motion.div>
    </>
  );
}
