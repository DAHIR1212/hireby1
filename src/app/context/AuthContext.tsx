import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { doc, onSnapshot, updateDoc, serverTimestamp, DocumentSnapshot } from 'firebase/firestore';

interface AuthContextType {
    currentUser: any;
    setCurrentUser: (user: any) => void;
    updateOnlineStatus: (online: boolean) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    currentUser: null,
    setCurrentUser: () => { },
    updateOnlineStatus: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [currentUser, setCurrentUser] = useState<any>(null);

    useEffect(() => {
        const phone = localStorage.getItem('userPhone');
        if (!phone) {
          setCurrentUser(null);
          return;
        }

        // ✅ Real-time user data listener
        const userRef = doc(db, 'users', phone);
        const unsubscribe = onSnapshot(userRef, (snap: DocumentSnapshot) => {
            if (snap.exists()) {
                const data = snap.data();
                setCurrentUser({ ...data, id: snap.id });
                // Sync localStorage for backup
                if (data.name) localStorage.setItem('userName', data.name);
                if (data.photo) localStorage.setItem('userPhoto', data.photo);
                if (data.role) localStorage.setItem('userRole', data.role);
            }
        }, (err) => {
            console.error("Auth Listener Error:", err);
        });

        // Set online
        updateDoc(userRef, { isOnline: true, lastSeen: serverTimestamp() }).catch(console.error);

        const handleOffline = () => {
            updateDoc(userRef, { isOnline: false, lastSeen: serverTimestamp() }).catch(console.error);
        };

        window.addEventListener('beforeunload', handleOffline);
        return () => {
            unsubscribe();
            window.removeEventListener('beforeunload', handleOffline);
        };
    }, [localStorage.getItem('userPhone')]); // Watch for session changes

    const updateOnlineStatus = async (online: boolean) => {
        const phone = localStorage.getItem('userPhone');
        if (!phone) return;
        const userRef = doc(db, 'users', phone);
        await updateDoc(userRef, {
            isOnline: online,
            lastSeen: serverTimestamp(),
        });
    };

    return (
        <AuthContext.Provider value={{ currentUser, setCurrentUser, updateOnlineStatus }}>
            {children}
        </AuthContext.Provider>
    );
}

