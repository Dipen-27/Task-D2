import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";


// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

const googleProvider = new GoogleAuthProvider();

export const auth = getAuth(app);
export const db = getFirestore(app);

export const signInWithGoogleAuthProvider = () =>
    signInWithPopup(auth, googleProvider);


export async function createUserDocFromAuth(userAuth) {
    if (!userAuth) {
        return;
    }

    const userDocRef = doc(db, "users", userAuth.uid);

    try {
        const userSnapshot = await getDoc(userDocRef);

        if (!userSnapshot.exists()) {
            await setDoc(userDocRef, {
                displayName: userAuth.displayName || "",
                email: userAuth.email || "",
                createdAt: new Date(),
                subscriptionPlan: "Free",
            });
        } else if (!userSnapshot.data().subscriptionPlan) {
            // Add the default plan without overwriting existing fields.
            await setDoc(
                userDocRef,
                { subscriptionPlan: "Free" },
                { merge: true }
            );
        }
    } catch (error) {
        console.error("Error creating or updating user document:", error);
        throw error;
    }
}
