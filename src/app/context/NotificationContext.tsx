import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { useAuth } from './AuthContext.tsx';
import {
    collection, addDoc, onSnapshot,
    query, where, orderBy, serverTimestamp,
    doc, updateDoc, deleteDoc, limit
} from 'firebase/firestore';

export interface AppNotification {
    id: string;
    userId: string;
    title: string;
    message: string;
    type: 'booking' | 'payment' | 'status' | 'system';
    createdAt: any;
    read: boolean;
}

interface NotificationContextType {
    notifications: AppNotification[];
    unreadCount: number;
    addNotification: (userId: string, title: string, message: string, type: AppNotification['type'], metadata?: any) => Promise<void>;
    markAsRead: (notificationId: string) => Promise<void>;
    clearAll: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) throw new Error('useNotifications must be used within a NotificationProvider');
    return context;
};

export function NotificationProvider({ children }: { children: React.ReactNode }) {
    const [notifications, setNotifications] = useState<AppNotification[]>([]);
    const { currentUser } = useAuth();

    useEffect(() => {
        const userPhone = localStorage.getItem('userPhone') || currentUser?.phone?.replace('+91', '');
        if (!userPhone) return;

        const q = query(
            collection(db, 'notifications'),
            where('userId', '==', userPhone),
            orderBy('createdAt', 'desc'),
            limit(50)
        );

        const unsubscribe = onSnapshot(q, (snap) => {
            const notifs = snap.docs.map(d => ({
                id: d.id,
                ...d.data()
            })) as AppNotification[];
            setNotifications(notifs);
        });

        return () => unsubscribe();
    }, [currentUser]);

    const addNotification = async (userId: string, title: string, message: string, type: AppNotification['type'], metadata?: any) => {
        try {
            await addDoc(collection(db, 'notifications'), {
                userId,
                title,
                message,
                type,
                metadata: metadata || {},
                read: false,
                createdAt: serverTimestamp()
            });
        } catch (err) {
            console.error("Add Notification Error:", err);
        }
    };

    const markAsRead = async (notificationId: string) => {
        const notifRef = doc(db, 'notifications', notificationId);
        await updateDoc(notifRef, { read: true });
    };

    const clearAll = async () => {
        // Simple implementation: marks all as read
        const unread = notifications.filter(n => !n.read);
        for (const n of unread) {
            await markAsRead(n.id);
        }
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount, addNotification, markAsRead, clearAll }}>
            {children}
        </NotificationContext.Provider>
    );
}