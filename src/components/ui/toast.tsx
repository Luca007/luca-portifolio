"use client";

import React, { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: "default" | "destructive";
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType>({
  toasts: [],
  addToast: () => {},
  removeToast: () => {},
});

export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { id, ...toast, duration: toast.duration || 3000 };
    setToasts((prevToasts) => [...prevToasts, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
}

function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 items-end max-w-[420px]">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(toast.id);
    }, toast.duration);

    return () => clearTimeout(timer);
  }, [toast, onRemove]);

  return (
    <div
      className={cn(
        "flex w-full items-start gap-2 rounded-md border p-4 shadow-lg transition-all duration-500 ease-in-out transform translate-x-0 bg-background backdrop-blur-sm",
        toast.variant === "destructive" ? "border-destructive" : "border-border"
      )}
    >
      <div className="flex-shrink-0 pt-0.5">
        {toast.variant === "destructive" ? (
          <AlertCircle className="h-5 w-5 text-destructive" />
        ) : (
          <CheckCircle className="h-5 w-5 text-primary" />
        )}
      </div>
      <div className="flex-1">
        <div className="font-medium mb-1">{toast.title}</div>
        {toast.description && <div className="text-sm text-muted-foreground">{toast.description}</div>}
      </div>
      <button
        onClick={() => onRemove(toast.id)}
        className="flex-shrink-0 rounded-md p-1 text-muted-foreground hover:text-foreground"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

// Simple toast function for easy usage
export const toast = (props: Omit<Toast, "id">) => {
  // This is a workaround for when useToast isn't available
  // In a real implementation, you'd use something like zustand or a global event system
  // For now, we'll just use setTimeout to simulate the toast
  if (typeof window !== "undefined") {
    // Create a custom event to trigger toast creation
    const event = new CustomEvent("toast", { detail: props });
    window.dispatchEvent(event);
  }
};

// Hook into the custom event to create toasts
if (typeof window !== "undefined") {
  window.addEventListener("toast", ((event: CustomEvent) => {
    const toastContainer = document.getElementById("toast-container");
    if (!toastContainer) {
      const container = document.createElement("div");
      container.id = "toast-container";
      container.className = "fixed top-4 right-4 z-[9999] flex flex-col gap-2 items-end max-w-[420px]";
      document.body.appendChild(container);
    }

    const toast = event.detail;
    const toastEl = document.createElement("div");
    toastEl.className = cn(
      "flex w-full items-start gap-2 rounded-md border p-4 shadow-lg transition-all duration-500 ease-in-out transform translate-x-0 bg-background backdrop-blur-sm opacity-0",
      toast.variant === "destructive" ? "border-destructive" : "border-border"
    );

    toastEl.innerHTML = `
      <div class="flex-shrink-0 pt-0.5">
        ${toast.variant === "destructive"
          ? '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5 text-destructive"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>'
          : '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5 text-primary"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>'
        }
      </div>
      <div class="flex-1">
        <div class="font-medium mb-1">${toast.title}</div>
        ${toast.description ? `<div class="text-sm text-muted-foreground">${toast.description}</div>` : ''}
      </div>
      <button class="flex-shrink-0 rounded-md p-1 text-muted-foreground hover:text-foreground">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
    `;

    const closeButton = toastEl.querySelector("button");
    if (closeButton) {
      closeButton.addEventListener("click", () => {
        toastEl.style.opacity = "0";
        setTimeout(() => {
          toastEl.remove();
        }, 300);
      });
    }

    const toastContainer = document.getElementById("toast-container") as HTMLElement;
    toastContainer.appendChild(toastEl);

    // Trigger fade in
    setTimeout(() => {
      toastEl.style.opacity = "1";
    }, 10);

    // Auto remove
    setTimeout(() => {
      toastEl.style.opacity = "0";
      setTimeout(() => {
        toastEl.remove();
      }, 300);
    }, toast.duration || 3000);

  }) as EventListener);
}
