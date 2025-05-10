import 'dotenv/config';
import * as readlineSync from 'readline-sync';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { contentMap } from '../src/i18n/content';

async function main() {
  console.log('⚙️  Firebase Content Seeding Utility');

  // Prompt user for credentials
  const email = readlineSync.questionEMail('Enter your Firebase user email: ');
  const password = readlineSync.question('Enter your Firebase password: ', { hideEchoBack: true });

  // Initialize Firebase
  const app = initializeApp({
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  });

  // Authenticate
  const auth = getAuth(app);
  const userCred = await signInWithEmailAndPassword(auth, email, password);
  console.log(`✅ Signed in as ${userCred.user.email}`);

  // Get Firestore instance
  const db = getFirestore(app);

  // Seed each language's content into Firestore under `content/{lang}`
  for (const [lang, data] of Object.entries(contentMap)) {
    // Preserve ordering by storing content as a JSON string
    const json = JSON.stringify(data);

    // Log the navigation part of the JSON to show its order before sending
    if (data.navigation) {
      try {
        const navigationJson = JSON.stringify(data.navigation);
        console.log(`[${lang}] Navigation object stringified for Firestore: ${navigationJson}`);
      } catch (e) {
        console.warn(`[${lang}] Could not stringify data.navigation for logging:`, e);
      }
    }

    await setDoc(doc(db, 'content', lang), { dataJson: json, updatedAt: serverTimestamp() } as any);
    console.log(`✅ Seeded content for language: ${lang} with ordered JSON and updatedAt timestamp`);
  }

  console.log('🎉 Content seeding complete.');
  process.exit(0);
}

main().catch((err) => {
  console.error('❌ Error during seeding:', err);
  process.exit(1);
});
