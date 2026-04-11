import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebase/config';
import {
  collection, addDoc, onSnapshot,
  query, where, orderBy, serverTimestamp,
  doc, updateDoc, limit
} from 'firebase/firestore';

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'booking' | 'payment' | 'status' | 'system';
  createdAt: any;
  read: boolean;
  metadata?: any;
}

interface NotificationContextType {
  notifications: AppNotification[];
  unreadCount: number;
  addNotification: (userId: string, title: string, message: string, type: AppNotification['type'], metadata?: any) => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  clearAll: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
};

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  const userPhone = (localStorage.getItem('userPhone') || '').replace(/\D/g, '').slice(-10);

  useEffect(() => {
    if (!userPhone) return;

    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', userPhone),
      orderBy('createdAt', 'desc'),
      limit(50)
    );

    const unsub = onSnapshot(q,
      (snap) => {
        setNotifications(snap.docs.map(d => ({ id: d.id, ...d.data() })) as AppNotification[]);
      },
      (err) => console.error('Notification error:', err)
    );

    return () => unsub();
  }, [userPhone]);

  const addNotification = async (
    userId: string, title: string, message: string,
    type: AppNotification['type'], metadata?: any
  ) => {
    try {
      await addDoc(collection(db, 'notifications'), {
        userId, title, message, type,
        metadata: metadata || {},
        read: false,
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      console.error('addNotification error:', err);
    }
  };

  const markAsRead = async (id: string) => {
    await updateDoc(doc(db, 'notifications', id), { read: true });
  };

  const clearAll = async () => {
    const unread = notifications.filter(n => !n.read);
    await Promise.all(unread.map(n => markAsRead(n.id)));
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount: notifications.filter(n => !n.read).length,
      addNotification,
      markAsRead,
      clearAll,
    }}>
      {children}
    </NotificationContext.Provider>
  );
}