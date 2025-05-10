"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "./AuthContext";

// Define the context type
type EditContextType = {
  isEditMode: boolean;
  setEditMode: (mode: boolean) => void;
  editedItems: Record<string, boolean>;
  registerEditedItem: (id: string) => void;
  handleEdit: (id: string, path: string[], type: string, content: any) => void;
};

// Create the context with default values
const EditContext = createContext<EditContextType>({
  isEditMode: false,
  setEditMode: () => {},
  editedItems: {},
  registerEditedItem: () => {},
  handleEdit: () => {},
});

// Hook to use the edit context
export const useEdit = () => useContext(EditContext);

// Provider component
export const EditProvider = ({ children }: { children: ReactNode }) => {
  const { isAdmin } = useAuth();
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedItems, setEditedItems] = useState<Record<string, boolean>>({});

  // Listen for edit mode toggle events
  useEffect(() => {
    const handleEditModeEnabled = () => {
      setIsEditMode(true);
      // Clear edited items when entering edit mode
      setEditedItems({});
    };

    const handleEditModeDisabled = () => {
      setIsEditMode(false);
      // Clear edited items when exiting edit mode
      setEditedItems({});
    };

    window.addEventListener('edit-mode-enabled', handleEditModeEnabled);
    window.addEventListener('edit-mode-disabled', handleEditModeDisabled);

    return () => {
      window.removeEventListener('edit-mode-enabled', handleEditModeEnabled);
      window.removeEventListener('edit-mode-disabled', handleEditModeDisabled);
    };
  }, []);

  // Function to set edit mode
  const setEditMode = (mode: boolean) => {
    setIsEditMode(mode);

    if (mode) {
      window.dispatchEvent(new CustomEvent('edit-mode-enabled'));
    } else {
      window.dispatchEvent(new CustomEvent('edit-mode-disabled'));
    }
  };

  // Function to register an edited item
  const registerEditedItem = (id: string) => {
    setEditedItems((prev) => ({
      ...prev,
      [id]: true,
    }));
  };

  // Function to handle editing an item
  const handleEdit = (id: string, path: string[], type: string, content: any) => {
    console.log('[EditContext] handleEdit called:', { id, path, type, content }); // Added logging
    // Register item as edited
    registerEditedItem(id);

    // Dispatch an event to notify the AdminPanel
    try {
      window.dispatchEvent(
        new CustomEvent('edit-item', {
          detail: { id, path, type, content }
        })
      );
      console.log('[EditContext] \'edit-item\' event dispatched successfully.'); // Added success log
    } catch (error) {
      console.error('[EditContext] Error dispatching \'edit-item\' event:', error); // Added error logging
    }
  };

  // Only provide edit capabilities if user is admin
  const value = {
    isEditMode: isAdmin ? isEditMode : false,
    setEditMode: isAdmin ? setEditMode : () => {},
    editedItems,
    registerEditedItem,
    handleEdit,
  };

  return (
    <EditContext.Provider value={value}>
      {children}
    </EditContext.Provider>
  );
};
