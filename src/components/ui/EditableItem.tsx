"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Edit, Check, X } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

interface EditableItemProps {
  children: React.ReactNode;
  id: string;
  path: string[];
  type: string;
  content: any;
  isAdmin: boolean;
  isEditMode: boolean;
  onEdit: (id: string, path: string[], type: string, content: any) => void;
}

export function EditableItem({
  children,
  id,
  path,
  type,
  content,
  isAdmin,
  isEditMode,
  onEdit
}: EditableItemProps) {
  const [isHovered, setIsHovered] = useState(false);

  if (!isAdmin || !isEditMode) {
    return <>{children}</>;
  }

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onEdit(id, path, type, content);
  };

  return (
    <div
      className={cn(
        "group relative transition-all duration-200",
        isHovered && "z-10"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}

      {/* Editable overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: isHovered ? 0.7 : 0,
          borderWidth: isHovered ? 2 : 0
        }}
        className="absolute inset-0 bg-primary/10 border-primary border-dashed rounded pointer-events-none"
      />

      {/* Edit button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: isHovered ? 1 : 0,
          scale: isHovered ? 1 : 0.8
        }}
        className="absolute top-0 right-0 transform -translate-y-1/2 translate-x-1/2 pointer-events-auto"
      >
        <Button
          variant="default"
          size="icon"
          className="h-7 w-7 rounded-full shadow-md"
          onClick={handleEdit}
        >
          <Edit className="h-3.5 w-3.5" />
        </Button>
      </motion.div>

      {/* Type indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        className="absolute bottom-0 left-0 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-tr-md rounded-bl-md pointer-events-none"
      >
        {type}
      </motion.div>
    </div>
  );
}
