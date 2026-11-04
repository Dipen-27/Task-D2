import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import {
    auth,
    db,
    createUserDocFromAuth,
} from "../utilis/firebase";

const UserContext = createContext();

export function UserProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);

            if (user) {
                try {
                    // Ensure the user has a Firestore document.
                    await createUserDocFromAuth(user);

                    // Read the user's saved information.
                    const userRef = doc(db, "users", user.uid);
                    const userSnapshot = await getDoc(userRef);

                    setUserData(
                        userSnapshot.exists()
                            ? userSnapshot.data()
                            : null
                    );

                    // Keep the stored user ID and token up to date.
                    localStorage.setItem("userId", user.uid);

                    const token = await user.getIdToken();
                    localStorage.setItem("token", token);
                } catch (error) {
                    console.error("Error loading user data:", error);
                    setUserData(null);
                }
            } else {
                setUserData(null);

                // Remove stored credentials when signed out.
                localStorage.removeItem("userId");
                localStorage.removeItem("token");
            }

            setLoading(false);
        });

        return unsubscribe;
    }, []);

    // Sign out of Firebase and clear Local Storage.
    const logout = async () => {
        try {
            await signOut(auth);

            localStorage.removeItem("userId");
            localStorage.removeItem("token");
        } catch (error) {
            console.error("Logout error:", error);
            throw error;
        }
    };

    const refreshUserData = async () => {
        if (!auth.currentUser) {
            setUserData(null);
            return;
        }

        const userRef = doc(db, "users", auth.currentUser.uid);
        const userSnapshot = await getDoc(userRef);

        setUserData(
            userSnapshot.exists()
                ? userSnapshot.data()
                : null
        );
    };

    const value = {
        currentUser,
        userData,
        loading,
        logout,
        refreshUserData,
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    return useContext(UserContext);
}
