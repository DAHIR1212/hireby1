import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { useAuth } from './AuthContext.tsx';
import {
    collection, addDoc, onSnapshot,
    query, where, orderBy, serverTimestamp,
    doc, updateDoc, deleteDoc, getDoc,
    increment, limit
} from 'firebase/firestore';

export interface Booking {
    id: string;
    customerId: string;
    customerName: string;
    customerPhone: string;
    providerId: string;
    providerName: string;
    providerPhone?: string; // Added for direct calling
    instructions?: string; // Added for special requirements
    service: string;
    status: 'pending' | 'accepted' | 'active' | 'completed' | 'cancelled' | 'declined';
    price: string;
    address: string;
    scheduledTime: string;
    createdAt: any;
    updatedAt?: any;
    paymentStatus?: 'pending' | 'paid';
    paymentMethod?: string;
    rated?: boolean;
    rating?: number;
    feedback?: string;
    startTime?: any;
    endTime?: any;
    totalHours?: number;
}

interface BookingContextType {
    myBookings: Booking[];
    providerBookings: Booking[];
    createBooking: (booking: Omit<Booking, 'id' | 'createdAt'>) => Promise<string>;
    updateBookingStatus: (bookingId: string, status: Booking['status']) => Promise<void>;
    updateBooking: (bookingId: string, data: Partial<Booking>) => Promise<void>;
    deleteBooking: (bookingId: string) => Promise<void>;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const useBooking = () => {
    const context = useContext(BookingContext);
    if (!context) throw new Error('useBooking must be used within a BookingProvider');
    return context;
};

export function BookingProvider({ children }: { children: React.ReactNode }) {
    const [myBookings, setMyBookings] = useState<Booking[]>([]);
    const [providerBookings, setProviderBookings] = useState<Booking[]>([]);

    const { currentUser } = useAuth();

    useEffect(() => {
        // Use clean variables from localStorage for stability
        const rawPhone = localStorage.getItem('userPhone');
        const userRole = localStorage.getItem('userRole');
        
        if (!rawPhone || !userRole) return;

        const cleanPhone = rawPhone.replace(/\D/g, '').slice(-10);

        console.log(`[FIREBASE] Initializing stable listener for ${userRole}: ${cleanPhone}`);

        const collectionRef = collection(db, 'bookings');
        const q = query(
            collectionRef,
            where(userRole === 'customer' ? 'customerPhone' : 'providerId', '==', cleanPhone)
        );

        let isSubscribed = true;

        const unsubscribe = onSnapshot(q, (snap) => {
            if (!isSubscribed) return;

            const bookings = snap.docs.map(d => ({
                id: d.id,
                ...d.data()
            })) as Booking[];
            
            const sorted = bookings.sort((a, b) => {
                const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
                const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
                return dateB.getTime() - dateA.getTime();
            });

            if (userRole === 'customer') setMyBookings(prev => JSON.stringify(prev) === JSON.stringify(sorted) ? prev : sorted);
            else setProviderBookings(prev => JSON.stringify(prev) === JSON.stringify(sorted) ? prev : sorted);
            
        }, (error) => {
            console.error("Firestore Error:", error);
        });

        return () => {
            isSubscribed = false;
            unsubscribe();
        };
    }, []); // Only run once on mount or manual refresh for stability


    // ✅ Create real booking
    const createBooking = async (bookingData: Omit<Booking, 'id' | 'createdAt'>) => {
        const docRef = await addDoc(collection(db, 'bookings'), {
            ...bookingData,
            createdAt: serverTimestamp(),
            paymentStatus: 'pending',
        });

        // 🔔 Notify Provider of new booking
        await addDoc(collection(db, 'notifications'), {
            userId: bookingData.providerId,
            title: 'Hiring Request!',
            message: `Someone wants to hire you for ${bookingData.service} mission!`,
            type: 'booking',
            read: false,
            createdAt: serverTimestamp()
        });

        return docRef.id;
    };

    // ✅ Update booking status (accept/decline/complete)
    const updateBookingStatus = async (bookingId: string, status: Booking['status']) => {
        const bookingRef = doc(db, 'bookings', bookingId);
        const snap = await getDoc(bookingRef);
        
        await updateDoc(bookingRef, {
            status,
            updatedAt: serverTimestamp(),
        });

        if (snap.exists()) {
            const data = snap.data();
            // 🔔 Notify Customer when status changes
            if (status === 'accepted') {
                await addDoc(collection(db, 'notifications'), {
                    userId: data.customerPhone,
                    title: 'Mission Accepted!',
                    message: `${data.providerName} has accepted your request for ${data.service}.`,
                    type: 'status',
                    read: false,
                    createdAt: serverTimestamp()
                });
            } else if (status === 'completed') {
                  const providerRef = doc(db, 'users', data.providerId);
                  await updateDoc(providerRef, { jobsDone: increment(1) });
            }
        }
    };

    // ✅ Flexible update
    const updateBooking = async (bookingId: string, data: Partial<Booking>) => {
        const bookingRef = doc(db, 'bookings', bookingId);
        const snap = await getDoc(bookingRef);
        
        await updateDoc(bookingRef, {
            ...data,
            updatedAt: serverTimestamp(),
        });

        if (snap.exists()) {
            const bookingData = snap.data();
            
            // 🔔 Notify Provider when paid
            if (data.paymentStatus === 'paid') {
                await addDoc(collection(db, 'notifications'), {
                    userId: bookingData.providerId,
                    title: 'Payment Received!',
                    message: `${bookingData.customerName} has paid ₹${bookingData.price} for the ${bookingData.service} quest.`,
                    type: 'payment',
                    read: false,
                    createdAt: serverTimestamp()
                });
            }
        }
    };

    // ✅ Delete booking
    const deleteBooking = async (bookingId: string) => {
        const bookingRef = doc(db, 'bookings', bookingId);
        await deleteDoc(bookingRef);
    };

    return (
        <BookingContext.Provider value={{ myBookings, providerBookings, createBooking, updateBookingStatus, updateBooking, deleteBooking }}>
            {children}
        </BookingContext.Provider>
    );
}