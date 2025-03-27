import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Image optimization utils
export const imageConfig = {
  // Default image props to ensure consistent hydration
  defaultImageProps: {
    unoptimized: true,
    crossOrigin: "anonymous" as const,
    loading: "lazy" as const,
  },

  // Default priority image props (for above the fold content)
  defaultPriorityImageProps: {
    unoptimized: true,
    crossOrigin: "anonymous" as const,
    loading: "eager" as const,
    priority: true,
  },

  // Quality settings based on device type
  getQualityByScreenSize: () => {
    if (typeof window === 'undefined') return 80;
    return window.innerWidth < 768 ? 70 : 80;
  },

  // Get optimal image sizes based on device
  getOptimalSizes: (isFull = false) => {
    return isFull
      ? "(max-width: 768px) 100vw, 100vw"
      : "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw";
  }
};

// Detect low-performance devices
export function isLowPerformanceDevice() {
  if (typeof window === 'undefined') return false;
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const cpuCores = navigator.hardwareConcurrency || 4;
  return isMobile || cpuCores <= 4 || window.innerWidth < 768;
}

// Throttle function for performance optimization
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  return function(...args: Parameters<T>) {
    const now = Date.now();
    if (now - lastCall < limit) {
      return;
    }
    lastCall = now;
    return func(...args);
  };
}
