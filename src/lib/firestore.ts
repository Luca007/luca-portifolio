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
  DocumentReference,
  DocumentData,
  QueryDocumentSnapshot,
  CollectionReference
} from "firebase/firestore";
import { db } from "./firebase";

// Main content interfaces
export interface ContentItem {
  id: string;
  type: string;
  text?: string;
  updatedAt: Date;
  [key: string]: any;
}

// Function to fetch a language document
export const getLanguage = async (langCode: string) => {
  const langRef = doc(db, "languages", langCode);
  const langSnap = await getDoc(langRef);

  if (langSnap.exists()) {
    return { id: langSnap.id, ...langSnap.data() };
  }

  return null;
};

// Function to fetch all languages
export const getLanguages = async () => {
  const langCollection = collection(db, "languages");
  const langSnapshot = await getDocs(langCollection);

  return langSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

// Function to fetch a specific section
export const getSection = async (langCode: string, sectionId: string) => {
  const sectionRef = collection(doc(db, "languages", langCode), sectionId);
  const sectionSnapshot = await getDocs(sectionRef);

  const result: Record<string, ContentItem> = {};

  sectionSnapshot.docs.forEach(doc => {
    result[doc.id] = {
      id: doc.id,
      ...doc.data() as ContentItem
    };
  });

  return result;
};

// Function to fetch items from a subcollection
export const getSectionItems = async (langCode: string, sectionId: string, subCollectionId: string) => {
  try {
    const itemsCollection = collection(
      doc(db, "languages", langCode),
      sectionId,
      subCollectionId,
      "items"
    );

    const itemsSnapshot = await getDocs(itemsCollection);

    return itemsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error(`Error fetching ${subCollectionId} items:`, error);
    return [];
  }
};

// Function to update a section item
export const updateSectionItem = async (
  langCode: string,
  sectionId: string,
  itemId: string,
  data: Partial<ContentItem>
) => {
  const itemRef = doc(
    collection(doc(db, "languages", langCode), sectionId),
    itemId
  );

  await updateDoc(itemRef, {
    ...data,
    updatedAt: serverTimestamp()
  });

  return { id: itemId, ...data };
};

// Function to update an item in a subcollection
export const updateSubcollectionItem = async (
  langCode: string,
  sectionId: string,
  subCollectionId: string,
  itemId: string,
  data: Partial<ContentItem>
) => {
  const itemRef = doc(
    collection(
      doc(db, "languages", langCode),
      sectionId,
      subCollectionId,
      "items"
    ),
    itemId
  );

  await updateDoc(itemRef, {
    ...data,
    updatedAt: serverTimestamp()
  });

  return { id: itemId, ...data };
};

// Helper to get a full section with subcollections
export const getFullSection = async (langCode: string, sectionId: string) => {
  // First get the main section items
  const sectionData = await getSection(langCode, sectionId);

  // Check if there are any subcollections for this section
  const sectionRef = doc(db, "languages", langCode);
  const possibleSubcollections = ["items", "categories", "roles", "paragraphs", "jobInfo"];

  const result = { ...sectionData };

  // Try to fetch each possible subcollection
  for (const subColl of possibleSubcollections) {
    try {
      const subItems = await getSectionItems(langCode, sectionId, subColl);
      if (subItems.length > 0) {
        result[subColl] = subItems;
      }
    } catch (error) {
      // Ignore errors from missing collections
    }
  }

  return result;
};
