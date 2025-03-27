"use client";

import React, { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  getLanguages,
  getFullSection,
  updateSectionItem,
  updateSubcollectionItem,
  ContentItem
} from "@/lib/firestore";
import { Save, Edit, List, Layers, Image, Type, X, Check, RefreshCw } from "lucide-react";
import { toast } from "./ui/toast";
import { ScrollArea } from "./ui/scroll-area";

interface EditableContent {
  id: string;
  path: string[];
  type: string;
  content: any;
  originalContent: any;
}

export default function AdminPanel() {
  const { isAdmin } = useAuth();
  const { currentLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState<string>("home");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [sectionData, setSectionData] = useState<any>(null);
  const [editedContent, setEditedContent] = useState<EditableContent[]>([]);
  const [selectedItem, setSelectedItem] = useState<EditableContent | null>(null);

  // Available sections for editing
  const sections = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "skills", label: "Skills" },
    { id: "experiences", label: "Experience" },
    { id: "education", label: "Education" },
    { id: "projects", label: "Projects" },
    { id: "contact", label: "Contact" },
    { id: "footer", label: "Footer" }
  ];

  // Listen for edit mode toggle
  useEffect(() => {
    const handleEditModeEnabled = () => {
      setIsOpen(true);
      loadSectionData("home");
    };

    const handleEditModeDisabled = () => {
      setIsOpen(false);
      setEditedContent([]);
      setSelectedItem(null);
    };

    window.addEventListener('edit-mode-enabled', handleEditModeEnabled);
    window.addEventListener('edit-mode-disabled', handleEditModeDisabled);

    return () => {
      window.removeEventListener('edit-mode-enabled', handleEditModeEnabled);
      window.removeEventListener('edit-mode-disabled', handleEditModeDisabled);
    };
  }, []);

  // Load section data from Firestore
  const loadSectionData = async (sectionId: string) => {
    try {
      setIsLoading(true);
      setCurrentSection(sectionId);

      const data = await getFullSection(currentLanguage.code, sectionId);
      setSectionData(data);
      setEditedContent([]);
      setSelectedItem(null);
    } catch (error) {
      console.error(`Error loading ${sectionId} data:`, error);
      toast({
        title: "Error",
        description: `Failed to load ${sectionId} data. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle editing content
  const handleEdit = (id: string, path: string[], type: string, content: any) => {
    // Create a new edited content item
    const newEditedItem: EditableContent = {
      id,
      path,
      type,
      content: { ...content },
      originalContent: { ...content }
    };

    // Check if we're already editing this item
    const existingIndex = editedContent.findIndex(item =>
      item.id === id && JSON.stringify(item.path) === JSON.stringify(path)
    );

    if (existingIndex >= 0) {
      // Update existing item
      const updatedContent = [...editedContent];
      updatedContent[existingIndex] = newEditedItem;
      setEditedContent(updatedContent);
    } else {
      // Add new item
      setEditedContent([...editedContent, newEditedItem]);
    }

    // Set as selected
    setSelectedItem(newEditedItem);
  };

  // Handle updating content value
  const handleContentChange = (field: string, value: string) => {
    if (!selectedItem) return;

    const updatedItem = {
      ...selectedItem,
      content: {
        ...selectedItem.content,
        [field]: value
      }
    };

    setSelectedItem(updatedItem);

    // Update in editedContent array
    const updatedContent = editedContent.map(item =>
      item.id === selectedItem.id &&
      JSON.stringify(item.path) === JSON.stringify(selectedItem.path)
        ? updatedItem
        : item
    );

    setEditedContent(updatedContent);
  };

  // Save changes to Firestore
  const saveChanges = async () => {
    if (editedContent.length === 0) return;

    setIsSaving(true);

    try {
      // For each edited item, update in Firestore
      for (const item of editedContent) {
        if (JSON.stringify(item.content) !== JSON.stringify(item.originalContent)) {
          // Determine if it's a direct section item or in a subcollection
          if (item.path.length === 1) {
            // Direct section item
            await updateSectionItem(
              currentLanguage.code,
              currentSection,
              item.id,
              item.content
            );
          } else if (item.path.length === 2) {
            // Subcollection item
            await updateSubcollectionItem(
              currentLanguage.code,
              currentSection,
              item.path[0],
              item.id,
              item.content
            );
          }
        }
      }

      // Reload section data
      await loadSectionData(currentSection);

      toast({
        title: "Success",
        description: "Content updated successfully",
        variant: "default",
      });
    } catch (error) {
      console.error("Error saving changes:", error);
      toast({
        title: "Error",
        description: "Failed to save changes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Helper to determine if an item has changes
  const hasChanges = (item: EditableContent) => {
    return JSON.stringify(item.content) !== JSON.stringify(item.originalContent);
  };

  // Helper to render item preview
  const renderItemPreview = (item: any, id: string, path: string[] = []) => {
    // Skip rendering admin items
    if (id.includes('admin')) return null;

    // Different rendering based on item type
    switch (item.type) {
      case "heading":
      case "text":
      case "label":
      case "paragraph":
      case "button":
        return (
          <div
            key={id}
            className="p-3 border border-transparent hover:border-border/30 rounded-md cursor-pointer group"
            onClick={() => handleEdit(id, path, item.type, item)}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-muted-foreground">{item.type}</span>
              <Edit
                size={14}
                className="opacity-0 group-hover:opacity-100 text-primary transition-opacity"
              />
            </div>
            <div className="text-sm font-medium truncate">{item.text}</div>
          </div>
        );
      default:
        return (
          <div
            key={id}
            className="p-3 border border-transparent hover:border-border/30 rounded-md cursor-pointer group"
            onClick={() => handleEdit(id, path, item.type || "unknown", item)}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-muted-foreground">{item.type || "Item"}</span>
              <Edit
                size={14}
                className="opacity-0 group-hover:opacity-100 text-primary transition-opacity"
              />
            </div>
            <div className="text-sm font-medium truncate">{item.text || item.name || item.title || JSON.stringify(item).substring(0, 30) + "..."}</div>
          </div>
        );
    }
  };

  // Render the edit form for the selected item
  const renderEditForm = () => {
    if (!selectedItem) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-6 text-center text-muted-foreground">
          <Layers size={48} className="mb-4 opacity-20" />
          <h3 className="text-lg font-medium mb-2">No item selected</h3>
          <p className="text-sm">Click on an item from the left panel to edit its content.</p>
        </div>
      );
    }

    const hasItemChanges = hasChanges(selectedItem);

    return (
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            {selectedItem.type === "heading" && <Type size={18} />}
            {selectedItem.type === "text" && <Type size={18} />}
            {selectedItem.type === "paragraph" && <List size={18} />}
            {selectedItem.type === "image" && <Image size={18} />}
            Edit {selectedItem.type}
          </h3>
          <div className="flex gap-2">
            {hasItemChanges && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  // Reset item to original content
                  const updatedContent = editedContent.map(item =>
                    item.id === selectedItem.id &&
                    JSON.stringify(item.path) === JSON.stringify(selectedItem.path)
                      ? { ...item, content: { ...item.originalContent } }
                      : item
                  );

                  setEditedContent(updatedContent);
                  setSelectedItem({
                    ...selectedItem,
                    content: { ...selectedItem.originalContent }
                  });
                }}
              >
                <X size={14} className="mr-1" />
                Reset
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {/* Render different form fields based on the item type */}
          {selectedItem.type === "heading" || selectedItem.type === "text" || selectedItem.type === "button" || selectedItem.type === "label" ? (
            <div>
              <Label htmlFor="text">Text Content</Label>
              <Input
                id="text"
                value={selectedItem.content.text || ""}
                onChange={(e) => handleContentChange("text", e.target.value)}
                className="mt-1"
              />
            </div>
          ) : selectedItem.type === "paragraph" ? (
            <div>
              <Label htmlFor="text">Paragraph Content</Label>
              <Textarea
                id="text"
                value={selectedItem.content.text || ""}
                onChange={(e) => handleContentChange("text", e.target.value)}
                className="mt-1 min-h-[120px]"
              />
            </div>
          ) : (
            // Generic editor for other types
            Object.entries(selectedItem.content)
              .filter(([key]) => !["id", "type", "updatedAt", "order"].includes(key)) // Skip internal fields
              .map(([key, value]) => (
                <div key={key}>
                  <Label htmlFor={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</Label>
                  {typeof value === "string" ? (
                    value.length > 80 ? (
                      <Textarea
                        id={key}
                        value={value as string}
                        onChange={(e) => handleContentChange(key, e.target.value)}
                        className="mt-1"
                      />
                    ) : (
                      <Input
                        id={key}
                        value={value as string}
                        onChange={(e) => handleContentChange(key, e.target.value)}
                        className="mt-1"
                      />
                    )
                  ) : (
                    <div className="text-sm text-muted-foreground mt-1 p-2 bg-muted/30 rounded">
                      Cannot edit this field type directly
                    </div>
                  )}
                </div>
              ))
          )}

          {hasItemChanges && (
            <div className="bg-primary/10 text-primary p-3 rounded-md text-sm mt-4">
              This item has unsaved changes.
            </div>
          )}
        </div>
      </div>
    );
  };

  if (!isAdmin) return null;

  return (
    <div>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="right" className="w-[90vw] sm:w-[85vw] md:w-[80vw] lg:w-[75vw] p-0 border-l border-border/20">
          <div className="grid grid-cols-1 lg:grid-cols-3 h-full">
            {/* Left sidebar with sections and items */}
            <div className="lg:col-span-1 border-r border-border/20 h-full flex flex-col">
              <SheetHeader className="p-4 border-b border-border/20">
                <SheetTitle className="text-lg flex items-center gap-2">
                  <Edit size={18} className="text-primary" />
                  Content Editor
                </SheetTitle>
              </SheetHeader>

              <Tabs value={currentSection} onValueChange={loadSectionData} className="flex flex-col h-full">
                <div className="p-4 border-b border-border/20">
                  <TabsList className="w-full h-auto flex flex-wrap gap-1">
                    {sections.map(section => (
                      <TabsTrigger
                        key={section.id}
                        value={section.id}
                        disabled={isLoading}
                        className="flex-1 min-w-[80px]"
                      >
                        {section.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>

                <div className="flex-1 overflow-hidden">
                  {sections.map(section => (
                    <TabsContent
                      key={section.id}
                      value={section.id}
                      className="h-full m-0 p-0"
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center h-full">
                          <RefreshCw size={20} className="animate-spin mr-2" />
                          <span>Loading...</span>
                        </div>
                      ) : sectionData ? (
                        <ScrollArea className="h-[calc(100vh-220px)]">
                          <div className="p-4 space-y-2">
                            {/* Render main section items */}
                            {Object.entries(sectionData)
                              .filter(([key, value]) =>
                                typeof value === "object" &&
                                !Array.isArray(value) &&
                                "type" in (value as any)
                              )
                              .map(([key, value]) =>
                                renderItemPreview(value, key, [])
                              )
                            }

                            {/* Render subcollections */}
                            {Object.entries(sectionData)
                              .filter(([key, value]) =>
                                Array.isArray(value) &&
                                value.length > 0
                              )
                              .map(([subKey, subItems]) => (
                                <div key={subKey} className="mt-4 pt-4 border-t border-border/10">
                                  <h4 className="text-sm font-medium mb-2 text-muted-foreground">{subKey}</h4>
                                  <div className="space-y-2">
                                    {(subItems as any[]).map((item) =>
                                      renderItemPreview(item, item.id, [subKey])
                                    )}
                                  </div>
                                </div>
                              ))
                            }
                          </div>
                        </ScrollArea>
                      ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground">
                          No data available
                        </div>
                      )}
                    </TabsContent>
                  ))}
                </div>
              </Tabs>

              {/* Bottom action bar */}
              <div className="p-4 border-t border-border/20">
                <Button
                  onClick={saveChanges}
                  disabled={isLoading || isSaving || editedContent.length === 0}
                  className="w-full"
                >
                  {isSaving ? (
                    <>
                      <RefreshCw size={16} className="mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={16} className="mr-2" />
                      Save Changes {editedContent.length > 0 && `(${editedContent.filter(hasChanges).length})`}
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Right side with item editor */}
            <div className="lg:col-span-2 flex flex-col h-full border-t lg:border-t-0 border-border/20">
              <div className="flex-1 overflow-auto">
                {renderEditForm()}
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
