import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  query,
  where,
  updateDoc,
  serverTimestamp,
  Timestamp, // Import Timestamp
  DocumentReference,
  DocumentData,
  QueryDocumentSnapshot
} from "firebase/firestore";
import { auth } from "./firebase";
import { db } from "./firebase";
import { contentMap } from '@/i18n/content';

// --- Interfaces ---
export interface ContentItem {
  id: string;
  type: string; // Example required field
  text?: string;
  updatedAt: Timestamp; // Use Timestamp or FieldValue for serverTimestamp
  [key: string]: any;
}

// --- Helper Functions ---

// Generic update function
export const updateFirestoreDocument = async (
  docRef: DocumentReference<DocumentData>,
  data: Partial<Omit<ContentItem, 'id'>> // Exclude 'id' from data payload
): Promise<Partial<ContentItem>> => {
  const updateData = {
    ...data,
    updatedAt: serverTimestamp() // Always set server timestamp on update
  };
  await updateDoc(docRef, updateData);
  // Return the data intended for update, not including the serverTimestamp object
  return data as Partial<ContentItem>;
};

// --- Firestore Operations ---

const LANGUAGES_COLLECTION = "languages";
const ITEMS_SUBCOLLECTION = "items";

// New helper: convert doc snapshot to ContentItem
function convertDocToContentItem(doc: QueryDocumentSnapshot<DocumentData>): ContentItem {
  const data = doc.data();
  return {
    id: doc.id,
    type: data.type || "unknown",
    updatedAt: data.updatedAt || serverTimestamp(),
    ...data
  } as ContentItem;
}

// New type for full section which may contain both single items and arrays
type FullSection = Record<string, ContentItem | ContentItem[]>;

// Function to fetch a language document
export const getLanguage = async (langCode: string) => {
  const langRef = doc(db, LANGUAGES_COLLECTION, langCode);
  const langSnap = await getDoc(langRef);

  if (langSnap.exists()) {
    return { id: langSnap.id, ...langSnap.data() };
  }

  return null;
};

// Function to fetch all languages
export const getLanguages = async () => {
  const langCollection = collection(db, LANGUAGES_COLLECTION);
  const langSnapshot = await getDocs(langCollection);

  return langSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

export const getSection = async (
  langCode: string,
  sectionId: string
): Promise<Record<string, ContentItem>> => {
  const sectionRef = collection(doc(db, LANGUAGES_COLLECTION, langCode), sectionId);
  const sectionSnapshot = await getDocs(sectionRef);

  const result: Record<string, ContentItem> = {};
  sectionSnapshot.docs.forEach(doc => {
    result[doc.id] = convertDocToContentItem(doc);
  });

  return result;
};

export const getSectionItems = async (
  langCode: string,
  sectionId: string,
  subCollectionId: string
): Promise<ContentItem[]> => {
  try {
    // Instead of passing multiple path segments, join them into one string.
    const itemsCollection = collection(
      doc(db, LANGUAGES_COLLECTION, langCode),
      `${sectionId}/${subCollectionId}/${ITEMS_SUBCOLLECTION}`
    );

    const itemsSnapshot = await getDocs(itemsCollection);
    return itemsSnapshot.docs.map(doc => convertDocToContentItem(doc));
  } catch (error) {
    console.error(`Error fetching ${subCollectionId} items:`, error);
    return [];
  }
};

export const getFullSection = async (
  langCode: string,
  sectionId: string
): Promise<FullSection> => {
  // Get main section items as a record of ContentItem
  const sectionData = await getSection(langCode, sectionId);
  const result: FullSection = { ...sectionData };

  // List of potential subcollections
  const possibleSubcollections = ["items", "categories", "roles", "paragraphs", "jobInfo"];
  for (const subColl of possibleSubcollections) {
    try {
      const subItems: ContentItem[] = await getSectionItems(langCode, sectionId, subColl);
      if (subItems.length > 0) {
        result[subColl] = subItems;
      }
    } catch (error) {
      // Ignore errors from missing collections
    }
  }
  return result;
};

// Helper to fetch full content for a language, parsing the ordered JSON stored under dataJson
export const getContent = async (
  langCode: string
): Promise<{ data: any; updatedAt: number } | null> => {
  const contentRef = doc(db, 'content', langCode);
  const snap = await getDoc(contentRef);
  if (!snap.exists()) return null;
  const raw = snap.data();
  const ts = (raw.updatedAt as Timestamp)?.toMillis() ?? 0;
  let data: any;
  if (typeof raw.dataJson === 'string') {
    try {
      data = JSON.parse(raw.dataJson);
    } catch (e) {
      console.error('Error parsing content JSON:', e);
      // fallback to default map on parse error
      data = contentMap[langCode] || {};
    }
  } else {
    // no JSON stored: fallback to raw object except metadata
    const { dataJson, updatedAt, ...rest } = raw;
    // if rest is empty, fallback to default map
    data = Object.keys(rest).length ? rest : (contentMap[langCode] || {});
  }
  return { data, updatedAt: ts };
};

/**
 * Checks if the current user is an admin (simplified: checks if any user is logged in).
 */
export const isAdmin = (): boolean => {
  const user = auth.currentUser;
  // Returns true if a user is logged in, false otherwise.
  return !!user;
};

// Atualiza o conteúdo inteiro de um idioma na coleção 'content'
export const updateFullContent = async (
  langCode: string,
  data: any
): Promise<void> => {
  const contentRef = doc(db, 'content', langCode);
  await setDoc(contentRef, {
    dataJson: JSON.stringify(data),
    updatedAt: serverTimestamp(),
  });
};
