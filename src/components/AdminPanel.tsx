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
  updateFirestoreDocument,
  ContentItem,
  updateFullContent,
  getContent
} from "@/lib/firestore";
import { Save, Edit, List, Layers, Image, Type, X, Check, RefreshCw } from "lucide-react";
import { toast } from "./ui/toast";
import { ScrollArea } from "./ui/scroll-area";
import { doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Palette, Link as LinkIcon, Image as ImageIcon, Star, ChevronDown } from "lucide-react";
import { contentMap } from '@/i18n/content';

interface EditableContent {
  id: string;
  path: string[];
  type: string;
  content: any;
  originalContent: any;
}

interface Section {
  id: string;
  label: string;
}

interface SectionTabsProps {
  currentSection: string;
  loadSectionData: (sectionId: string) => Promise<void>;
  sections: Section[];
  isLoading: boolean;
}

const SectionTabs: React.FC<SectionTabsProps> = ({ currentSection, loadSectionData, sections, isLoading }) => (
  <Tabs value={currentSection} onValueChange={loadSectionData} className="flex flex-col h-full">
    <div className="p-4 border-b border-border/20">
      <TabsList className="w-full h-auto flex flex-wrap gap-1">
        {sections.map((section: Section) => (
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
  </Tabs>
);

interface ItemPreviewProps {
  item: any;
  id: string;
  path: any[];
  handleEdit: (id: string, path: any[], type: string, content: any) => void;
}

const ItemPreview: React.FC<ItemPreviewProps> = ({ item, id, path, handleEdit }) => {
  if (!id || typeof id !== 'string' || id.includes('admin')) return null;

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
            <Edit size={14} className="opacity-0 group-hover:opacity-100 text-primary transition-opacity" />
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
            <Edit size={14} className="opacity-0 group-hover:opacity-100 text-primary transition-opacity" />
          </div>
          <div className="text-sm font-medium truncate">
            {item.text || item.name || item.title || JSON.stringify(item).substring(0, 30) + "..."}
          </div>
        </div>
      );
  }
}

interface EditFormProps {
  selectedItem: any;
  handleContentChange: (field: string, value: string) => void;
  editedContent: any[];
  setEditedContent: React.Dispatch<React.SetStateAction<any[]>>;
  setSelectedItem: React.Dispatch<React.SetStateAction<any>>;
  hasChanges: (item: any) => boolean;
}

const ICON_OPTIONS = [
  { name: "Star", icon: <Star size={18} /> },
  { name: "Image", icon: <ImageIcon size={18} /> },
  { name: "Link", icon: <LinkIcon size={18} /> },
  { name: "Check", icon: <Check size={18} /> },
  { name: "Type", icon: <Type size={18} /> },
];

const EditForm: React.FC<EditFormProps> = ({ selectedItem, handleContentChange, editedContent, setEditedContent, setSelectedItem, hasChanges }) => {
  if (!selectedItem) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center text-muted-foreground">
        <Layers size={48} className="mb-4 opacity-20" />
        <h3 className="text-lg font-medium mb-2">Nenhum item selecionado</h3>
        <p className="text-sm">Clique em um item à esquerda para editar seu conteúdo.</p>
      </div>
    );
  }

  const hasItemChanges = hasChanges(selectedItem);

  // Renderiza campo de seleção de ícone se houver campo 'icon' ou 'iconName'
  const renderIconSelector = (iconValue: string) => (
    <div className="flex flex-col gap-1">
      <Label>Ícone</Label>
      <div className="flex items-center gap-2">
        <select
          className="border rounded px-2 py-1 bg-background"
          value={iconValue || ''}
          onChange={e => handleContentChange('icon', e.target.value)}
        >
          <option value="">Nenhum</option>
          {ICON_OPTIONS.map(opt => (
            <option key={opt.name} value={opt.name}>{opt.name}</option>
          ))}
        </select>
        <span className="ml-2">{ICON_OPTIONS.find(opt => opt.name === iconValue)?.icon}</span>
      </div>
    </div>
  );

  // Renderiza campo de cor se houver campo 'color'
  const renderColorPicker = (colorValue: string) => (
    <div className="flex flex-col gap-1">
      <Label>Cor</Label>
      <input
        type="color"
        value={colorValue || '#000000'}
        onChange={e => handleContentChange('color', e.target.value)}
        className="w-10 h-8 p-0 border-none bg-transparent cursor-pointer"
        title="Escolha uma cor"
      />
    </div>
  );

  // Renderiza campo de link se houver campo 'link' ou 'url'
  const renderLinkInput = (linkValue: string) => (
    <div className="flex flex-col gap-1">
      <Label>Link</Label>
      <Input
        type="url"
        placeholder="https://..."
        value={linkValue || ''}
        onChange={e => handleContentChange('link', e.target.value)}
      />
    </div>
  );

  return (
    <TooltipProvider>
      <div className="p-4 h-full overflow-auto flex flex-col gap-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            {selectedItem.type === "heading" && <Type size={18} />}
            {selectedItem.type === "text" && <Type size={18} />}
            {selectedItem.type === "paragraph" && <List size={18} />}
            {selectedItem.type === "image" && <Image size={18} />}
            Editar {selectedItem.type}
          </h3>
          <div className="flex gap-2">
            {hasItemChanges && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
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
                    Resetar
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Desfazer todas as alterações deste item</TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>

        <div className="space-y-4 bg-card p-4 rounded-lg border border-border/30">
          <h4 className="text-sm uppercase tracking-wide text-muted-foreground font-medium mb-2">Editar Conteúdo</h4>

          {/* Campos padrão intuitivos */}
          {(selectedItem.type === "heading" || selectedItem.type === "text" || selectedItem.type === "button" || selectedItem.type === "label") && (
            <div>
              <Label htmlFor="text">Texto</Label>
              <Input
                id="text"
                placeholder="Digite o texto..."
                value={selectedItem.content.text || ""}
                onChange={(e) => handleContentChange("text", e.target.value)}
                className="mt-1"
              />
            </div>
          )}
          {selectedItem.type === "paragraph" && (
            <div>
              <Label htmlFor="text">Parágrafo</Label>
              <Textarea
                id="text"
                placeholder="Digite o parágrafo..."
                value={selectedItem.content.text || ""}
                onChange={(e) => handleContentChange("text", e.target.value)}
                className="mt-1 min-h-[120px]"
              />
            </div>
          )}

          {/* Campos dinâmicos intuitivos */}
          {Object.entries(selectedItem.content)
            .filter(([key]) => !["id", "type", "updatedAt", "order", "createdAt", "text"].includes(key))
            .map(([key, value]) => (
              <div key={key} className="flex flex-col gap-1">
                {key.toLowerCase().includes("icon") && renderIconSelector(String(value))}
                {key.toLowerCase().includes("color") && renderColorPicker(String(value))}
                {(key.toLowerCase().includes("link") || key.toLowerCase().includes("url")) && renderLinkInput(String(value))}
                {/* Fallback para outros campos string/number */}
                {!key.toLowerCase().includes("icon") && !key.toLowerCase().includes("color") && !key.toLowerCase().includes("link") && !key.toLowerCase().includes("url") && (
                  <>
                    <Label htmlFor={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</Label>
                    {typeof value === "string" ? (
                      value.length > 80 ? (
                        <Textarea
                          id={key}
                          placeholder={`Digite o valor de ${key}...`}
                          value={value as string}
                          onChange={(e) => handleContentChange(key, e.target.value)}
                          className="mt-1"
                        />
                      ) : (
                        <Input
                          id={key}
                          placeholder={`Digite o valor de ${key}...`}
                          value={value as string}
                          onChange={(e) => handleContentChange(key, e.target.value)}
                          className="mt-1"
                        />
                      )
                    ) : typeof value === "number" ? (
                      <Input
                        id={key}
                        type="number"
                        value={value}
                        onChange={(e) => handleContentChange(key, e.target.value)}
                        className="mt-1"
                      />
                    ) : (
                      <div className="text-sm text-muted-foreground mt-1 p-2 bg-muted/30 rounded">
                        Não é possível editar este campo diretamente
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}

          {hasItemChanges && (
            <div className="bg-primary/10 text-primary p-3 rounded-md text-sm mt-4">
              Este item possui alterações não salvas.
            </div>
          )}
        </div>

        <div className="bg-card p-4 rounded-lg border border-border/30">
          <h4 className="text-sm uppercase tracking-wide text-muted-foreground font-medium mb-4">Pré-visualização</h4>
          <div className="bg-background/50 p-4 rounded-md min-h-[200px] border border-border/20 flex flex-col gap-2">
            {selectedItem.content.icon && (
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Ícone selecionado:</span>
                {ICON_OPTIONS.find(opt => opt.name === selectedItem.content.icon)?.icon}
              </div>
            )}
            {selectedItem.type === "heading" && (
              <div className="preview-heading">
                <h2 className="text-2xl font-bold text-foreground">{selectedItem.content.text || "Heading text"}</h2>
              </div>
            )}
            {selectedItem.type === "text" && (
              <div className="preview-text">
                <p className="text-base text-foreground">{selectedItem.content.text || "Text content"}</p>
              </div>
            )}
            {selectedItem.type === "paragraph" && (
              <div className="preview-paragraph">
                <p className="text-base text-muted-foreground leading-relaxed">
                  {selectedItem.content.text || "Paragraph content goes here..."}
                </p>
              </div>
            )}
            {selectedItem.type === "button" && (
              <div className="preview-button">
                <Button style={{ background: selectedItem.content.color || undefined }}>
                  {selectedItem.content.icon && ICON_OPTIONS.find(opt => opt.name === selectedItem.content.icon)?.icon}
                  {selectedItem.content.text || "Button"}
                </Button>
              </div>
            )}
            {selectedItem.type === "label" && (
              <div className="preview-label">
                <Label>{selectedItem.content.text || "Label"}</Label>
              </div>
            )}
            {selectedItem.content.link && (
              <div className="flex items-center gap-2 mt-2">
                <LinkIcon size={16} />
                <a href={selectedItem.content.link} target="_blank" rel="noopener noreferrer" className="underline text-blue-600">{selectedItem.content.link}</a>
              </div>
            )}
            {selectedItem.content.color && (
              <div className="flex items-center gap-2 mt-2">
                <Palette size={16} />
                <span style={{ color: selectedItem.content.color }}>{selectedItem.content.color}</span>
              </div>
            )}
            {!["heading", "text", "paragraph", "button", "label"].includes(selectedItem.type) && (
              <div className="preview-generic">
                <p className="text-muted-foreground text-sm mb-2">Pré-visualização para {selectedItem.type}:</p>
                <div className="bg-muted/20 p-3 rounded border border-border/20">
                  {selectedItem.content.title && (
                    <h3 className="text-lg font-medium mb-1">{selectedItem.content.title}</h3>
                  )}
                  {selectedItem.content.name && (
                    <h3 className="text-lg font-medium mb-1">{selectedItem.content.name}</h3>
                  )}
                  {selectedItem.content.description && (
                    <p className="text-sm text-muted-foreground">{selectedItem.content.description}</p>
                  )}
                  {selectedItem.content.text && (
                    <p className="text-sm text-muted-foreground">{selectedItem.content.text}</p>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="mt-4 text-xs text-muted-foreground">
            <p>Esta pré-visualização mostra como o conteúdo aparecerá no site.</p>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default function AdminPanel(): JSX.Element | null {
  const { isAdmin } = useAuth();
  const { currentLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentSection, setCurrentSection] = useState<string>("home");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [sectionData, setSectionData] = useState<any>(null);
  const [editedContent, setEditedContent] = useState<any[]>([]);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');

  const sections: Section[] = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "skills", label: "Skills" },
    { id: "experiences", label: "Experience" },
    { id: "education", label: "Education" },
    { id: "projects", label: "Projects" },
    { id: "contact", label: "Contact" },
    { id: "footer", label: "Footer" }
  ];

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

    const handleEditItem = (event: Event) => {
      const customEvent = event as CustomEvent;
      const { id, path, type, content } = customEvent.detail;

      let sectionId = currentSection;

      if (path && path.length > 0) {
        const possibleSection = path[0];
        const isValidSection = sections.some(section => section.id === possibleSection);
        if (isValidSection) {
          sectionId = possibleSection;
        }
      } else {
        const element = document.getElementById(id);
        if (element) {
          const sectionElement = element.closest('section[id]');
          if (sectionElement && sectionElement.id) {
            const isValidSection = sections.some(section => section.id === sectionElement.id);
            if (isValidSection) {
              sectionId = sectionElement.id;
            }
          }
        }
      }

      if (sectionId !== currentSection) {
        loadSectionData(sectionId).then(() => {
          handleEdit(id, path, type, content);
        });
      } else {
        handleEdit(id, path, type, content);
      }
    };

    window.addEventListener('edit-mode-enabled', handleEditModeEnabled);
    window.addEventListener('edit-mode-disabled', handleEditModeDisabled);
    window.addEventListener('edit-item', handleEditItem);

    return () => {
      window.removeEventListener('edit-mode-enabled', handleEditModeEnabled);
      window.removeEventListener('edit-mode-disabled', handleEditModeDisabled);
      window.removeEventListener('edit-item', handleEditItem);
    };
  }, [currentSection]);

  // Robust prioritized section data loader: localStorage > Firebase > content.ts
  const loadSectionData = async (sectionId: string) => {
    try {
      setIsLoading(true);
      setCurrentSection(sectionId);
      const code = currentLanguage.code;
      const localDataKey = `content_${code}`;
      const localTsKey = `content_updatedAt_${code}`;
      const localData = localStorage.getItem(localDataKey);
      const localTs = localStorage.getItem(localTsKey);
      const localTimestamp = localTs ? parseInt(localTs) : 0;
      let section = null;
      let fb = null;
      let fbUpdatedAt = 0;
      let fbValid = false;
      try {
        // Try Firebase
        fb = await getFullSection(code, sectionId);
        // Try to get updatedAt from Firestore content doc
        const contentDoc = await getContent(code);
        fbUpdatedAt = contentDoc?.updatedAt || 0;
        // Validate Firebase data: must be non-empty object/array
        fbValid = fb && ((Array.isArray(fb) && fb.length > 0) || (typeof fb === 'object' && fb !== null && Object.keys(fb).length > 0));
      } catch (e) {
        fb = null;
        fbUpdatedAt = 0;
        fbValid = false;
      }
      // Try localStorage if up-to-date and valid
      let localSection = null;
      if (localData && localTimestamp && fbValid && localTimestamp >= fbUpdatedAt) {
        try {
          const parsed: Record<string, any> = JSON.parse(localData);
          localSection = parsed[sectionId];
          if (localSection && (Array.isArray(localSection) ? localSection.length > 0 : typeof localSection === 'object' && Object.keys(localSection).length > 0)) {
            section = localSection;
          }
        } catch (e) {
          section = null;
        }
      }
      // If localStorage is not valid, use Firebase if valid
      if (!section && fbValid) {
        section = fb;
        // Update localStorage with latest Firebase data
        let allData: Record<string, any> = {};
        try {
          allData = localData ? JSON.parse(localData) : {};
        } catch (e) {
          allData = {};
        }
        allData[sectionId] = fb;
        localStorage.setItem(localDataKey, JSON.stringify(allData));
        localStorage.setItem(localTsKey, Date.now().toString());
      }
      // Fallback to static content if needed
      if (!section) {
        try {
          // Use type assertion to allow dynamic access
          const staticContent = (contentMap[code] as any)?.[sectionId];
          if (staticContent && (Array.isArray(staticContent) ? staticContent.length > 0 : typeof staticContent === 'object' && Object.keys(staticContent).length > 0)) {
            section = staticContent;
          } else {
            section = {};
          }
        } catch (e) {
          section = {};
        }
      }
      setSectionData(section);
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

  const handleEdit = (id: string, path: any[], type: string, content: any) => {
    const newEditedItem = {
      id,
      path,
      type,
      content: { ...content },
      originalContent: { ...content }
    };

    const existingIndex = editedContent.findIndex(
      (item) => item.id === id && JSON.stringify(item.path) === JSON.stringify(path)
    );

    if (existingIndex >= 0) {
      const updated = [...editedContent];
      updated[existingIndex] = newEditedItem;
      setEditedContent(updated);
    } else {
      setEditedContent([...editedContent, newEditedItem]);
    }

    setSelectedItem(newEditedItem);
  };

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

    const updatedContent = editedContent.map(item =>
      item.id === selectedItem.id &&
      JSON.stringify(item.path) === JSON.stringify(selectedItem.path)
        ? updatedItem
        : item
    );

    setEditedContent(updatedContent);
  };

  const syncToFirebase = async () => {
    setSyncStatus('syncing');
    try {
      const localData = localStorage.getItem(`content_${currentLanguage.code}`);
      if (localData) {
        await updateFullContent(currentLanguage.code, JSON.parse(localData));
        setSyncStatus('success');
        toast({ title: 'Alterações salvas no Firebase!' });
      }
    } catch (e) {
      setSyncStatus('error');
      toast({ title: 'Erro ao sincronizar com o Firebase', variant: 'destructive' });
    } finally {
      setTimeout(() => setSyncStatus('idle'), 2000);
    }
  };

  const saveChanges = async () => {
    if (editedContent.length === 0) return;
    setIsSaving(true);
    try {
      for (const item of editedContent) {
        if (JSON.stringify(item.content) !== JSON.stringify(item.originalContent)) {
          if (item.path.length === 1) {
            await updateSectionItem(currentLanguage.code, currentSection, item.id, item.content);
          } else if (item.path.length === 2) {
            await updateSubcollectionItem(currentLanguage.code, currentSection, item.path[0], item.id, item.content);
          }
        }
      }
      await loadSectionData(currentSection);
      await syncToFirebase(); // Sincroniza imediatamente ao salvar
      toast({
        title: "Success",
        description: "Content updated successfully",
        variant: "success",
      });
    } catch (error) {
      console.error("Error saving changes:", error);
      setSyncStatus('error');
      toast({
        title: "Error",
        description: "Failed to save changes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const hasChanges = (item: any): boolean => {
    return JSON.stringify(item.content) !== JSON.stringify(item.originalContent);
  };

  // Adiciona funções utilitárias para drag-and-drop
  function reorder<T>(list: T[], startIndex: number, endIndex: number): T[] {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  }

  // Função para salvar alterações no localStorage instantaneamente
  const saveToLocalStorage = (langCode: string, data: any) => {
    const ts = Date.now();
    localStorage.setItem(`content_${langCode}`, JSON.stringify(data));
    localStorage.setItem(`content_updatedAt_${langCode}`, ts.toString());
  };

  // Sempre que sectionData mudar, salva no localStorage (mas não envia para o Firebase automaticamente)
  useEffect(() => {
    if (isAdmin && isOpen && sectionData) {
      saveToLocalStorage(currentLanguage.code, sectionData);
    }
  }, [sectionData, isAdmin, isOpen, currentLanguage.code]);

  if (!isAdmin) return null;

  return (
    <div>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="right" className="w-[80vw] max-w-[300px] p-0 flex flex-col" aria-describedby="adminpanel-desc">
          <p id="adminpanel-desc" className="sr-only">Editor de conteúdo do portfólio</p>
          <div className="grid grid-cols-1 lg:grid-cols-3 h-full">
            <div className="lg:col-span-1 border-r border-border/20 h-full flex flex-col">
              <SheetHeader className="p-4 border-b border-border/20">
                <SheetTitle className="text-lg flex items-center gap-2">
                  <Edit size={18} className="text-primary" />
                  Content Editor
                </SheetTitle>
              </SheetHeader>

              <SectionTabs
                currentSection={currentSection}
                loadSectionData={loadSectionData}
                sections={sections}
                isLoading={isLoading}
              />

              <div className="flex-1 overflow-hidden">
                <Tabs value={currentSection} onValueChange={loadSectionData} className="flex flex-col h-full">
                  <div className="p-4 border-b border-border/20">
                    <TabsList className="w-full h-auto flex flex-wrap gap-1">
                      {sections.map((section: Section) => (
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
                  <TabsContent value={currentSection} className="h-full m-0 p-0">
                    {isLoading ? (
                      <div className="flex items-center justify-center h-full">
                        <RefreshCw size={20} className="animate-spin mr-2" />
                        <span>Loading...</span>
                      </div>
                    ) : sectionData ? (
                      <ScrollArea className="h-[calc(100vh-220px)]">
                        <div className="p-4 space-y-2">
                          {/* Renderiza itens únicos (não array) com drag-and-drop individual se necessário */}
                          {Object.entries(sectionData)
                            .filter(([key, value]) =>
                              typeof value === "object" &&
                              !Array.isArray(value) &&
                              "type" in (value as any)
                            )
                            .map(([key, value]) => (
                              <div key={key} className="mb-4">
                                <ItemPreview
                                  item={value}
                                  id={key}
                                  path={[]}
                                  handleEdit={handleEdit}
                                />
                              </div>
                            ))}
                          {/* Renderiza arrays com drag-and-drop e edição exclusiva por seção */}
                          {Object.entries(sectionData)
                            .filter(([key, value]) => Array.isArray(value) && value.length > 0)
                            .map(([subKey, subItems]) => (
                              <div key={subKey} className="mt-4 pt-4 border-t border-border/10">
                                <h4 className="text-sm font-medium mb-2 text-muted-foreground flex items-center justify-between">
                                  {subKey}
                                  <Button size="sm" variant="outline" onClick={() => {
                                    // Adiciona novo item padrão para a seção
                                    const newItem = {
                                      id: `new_${Date.now()}`,
                                      type: "text",
                                      text: "Novo item",
                                    };
                                    const updated = Array.isArray(sectionData[subKey]) ? [...sectionData[subKey], newItem] : [newItem];
                                    setSectionData({ ...sectionData, [subKey]: updated });
                                    setEditedContent([...editedContent, {
                                      id: newItem.id,
                                      path: [subKey],
                                      type: newItem.type,
                                      content: newItem,
                                      originalContent: {},
                                    }]);
                                  }}>
                                    + Adicionar
                                  </Button>
                                </h4>
                                <DragDropContext
                                  onDragEnd={(result: DropResult) => {
                                    if (!result.destination) return;
                                    if (result.source.index === result.destination.index) return;
                                    const items = reorder(
                                      sectionData[subKey],
                                      result.source.index,
                                      result.destination.index
                                    );
                                    setSectionData({ ...sectionData, [subKey]: items });
                                    // Marca todos como editados para persistir ordem
                                    setEditedContent([
                                      ...editedContent.filter(e => e.path[0] !== subKey),
                                      ...items.map((item: any, idx: number) => ({
                                        id: item.id,
                                        path: [subKey],
                                        type: item.type,
                                        content: { ...item, order: idx },
                                        originalContent: item,
                                      }))
                                    ]);
                                  }}
                                >
                                  <Droppable droppableId={subKey} isDropDisabled={false} isCombineEnabled={false} ignoreContainerClipping={false}>
                                    {(provided) => (
                                      <div ref={provided.innerRef} {...provided.droppableProps}>
                                        {Array.isArray(subItems) && subItems.length > 0 &&
                                          subItems.map((item, idx) => (
                                            <Draggable key={item.id || idx} draggableId={String(item.id || idx)} index={idx}>
                                              {(provided, snapshot) => (
                                                <div
                                                  ref={provided.innerRef}
                                                  {...provided.draggableProps}
                                                  {...provided.dragHandleProps}
                                                  className={`relative group ${snapshot.isDragging ? 'bg-muted/40' : ''}`}
                                                >
                                                  <ItemPreview
                                                    item={item}
                                                    id={item.id}
                                                    path={[subKey]}
                                                    handleEdit={handleEdit}
                                                  />
                                                  <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100"
                                                    onClick={() => {
                                                      // Remove item
                                                      const updated = sectionData[subKey].filter((i: any) => i.id !== item.id);
                                                      setSectionData({ ...sectionData, [subKey]: updated });
                                                      setEditedContent([
                                                        ...editedContent,
                                                        {
                                                          id: item.id,
                                                          path: [subKey],
                                                          type: item.type,
                                                          content: null,
                                                          originalContent: item,
                                                          deleted: true,
                                                        }
                                                      ]);
                                                    }}
                                                    title="Remover"
                                                  >
                                                    <X size={14} />
                                                  </Button>
                                                </div>
                                              )}
                                            </Draggable>
                                          ))}
                                        {provided.placeholder}
                                      </div>
                                    )}
                                  </Droppable>
                                </DragDropContext>
                              </div>
                            ))}
                        </div>
                      </ScrollArea>
                    ) : (
                      <div className="flex items-center justify-center h-full text-muted-foreground">
                        No data available
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>

              <div className="p-4 border-t border-border/20 flex flex-col gap-2">
                <Button
                  onClick={saveChanges}
                  disabled={isLoading || isSaving || editedContent.length === 0 || syncStatus === 'syncing'}
                  className="w-full"
                >
                  {isSaving || syncStatus === 'syncing' ? (
                    <>
                      <RefreshCw size={16} className="mr-2 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save size={16} className="mr-2" />
                      Salvar Alterações {editedContent.length > 0 && `(${editedContent.filter(hasChanges).length})`}
                    </>
                  )}
                </Button>
                {syncStatus === 'success' && (
                  <div className="text-green-600 text-xs flex items-center gap-1"><Check size={14}/> Sincronizado com o Firebase</div>
                )}
                {syncStatus === 'error' && (
                  <div className="text-red-600 text-xs flex items-center gap-1"><X size={14}/> Erro ao sincronizar</div>
                )}
              </div>
            </div>

            <div className="lg:col-span-2 flex flex-col h-full border-t lg:border-t-0 border-border/20">
              <div className="flex-1 overflow-auto">
                <EditForm
                  selectedItem={selectedItem}
                  handleContentChange={handleContentChange}
                  editedContent={editedContent}
                  setEditedContent={setEditedContent}
                  setSelectedItem={setSelectedItem}
                  hasChanges={hasChanges}
                />
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

const updateSectionItem = async (
  langCode: string,
  section: string,
  itemId: string,
  content: any
) => {
  const docRef = doc(db, "languages", langCode, section, itemId);
  return await updateFirestoreDocument(docRef, content);
};

const updateSubcollectionItem = async (
  langCode: string,
  section: string,
  subcollection: string,
  itemId: string,
  content: any
) => {
  const docRef = doc(db, "languages", langCode, section, subcollection, itemId);
  return await updateFirestoreDocument(docRef, content);
};
