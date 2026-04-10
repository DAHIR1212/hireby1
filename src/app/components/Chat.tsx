import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Send, Phone, MoreVertical, ArrowLeft, MessageSquare } from 'lucide-react';
import { db } from '../firebase/config';
import { 
  collection, addDoc, onSnapshot, query, 
  orderBy, serverTimestamp, doc, getDoc 
} from 'firebase/firestore';
import { useAuth } from '../context/AuthContext.tsx';
import { useNotifications } from '../context/NotificationContext.tsx';

export default function Chat() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { currentUser } = useAuth();
  const { addNotification } = useNotifications();
  
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [otherUser, setOtherUser] = useState<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // ✅ Standardize phone ID for comparison
  const getCleanPhone = (p: string | null | undefined) => {
    if (!p) return null;
    // Remove non-numeric characters (handles +91, spaces, symbols)
    const numeric = p.replace(/\D/g, '');
    // Take last 10 digits to be uniform
    return numeric.length >= 10 ? numeric.slice(-10) : numeric;
  };

  const myPhoneRaw = localStorage.getItem('userPhone') || currentUser?.phone;
  const targetIdRaw = searchParams.get('providerId') || searchParams.get('customerId');
  
  const myPhone = getCleanPhone(myPhoneRaw);
  const targetId = getCleanPhone(targetIdRaw);
  
  const targetName = searchParams.get('providerName') || searchParams.get('customerName') || 'Partner';
  const chatId = (myPhone && targetId) ? [myPhone, targetId].sort().join('_') : null;

  useEffect(() => {
    if (!chatId) {
       console.warn("Chat session incomplete: myPhone or targetId missing", { myPhone, targetId });
       return;
    }
    
    console.log("Chat Session Initialized:", { chatId, myPhone, targetId });

    // Real-time message listener
    const messagesRef = collection(db, 'chats', chatId, 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'asc'));

    const unsubscribe = onSnapshot(q, (snap) => {
      const msgs = snap.docs.map(d => ({
        id: d.id,
        ...d.data()
      }));
      console.log(`[CHAT LOG] Received ${msgs.length} messages for room: ${chatId}`);
      setMessages(msgs);
      setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'auto' }), 100);
    }, (error) => {
      console.error("[CHAT ERROR] Snapshot Failed:", error);
    });

    // Fetch other user info (online status etc)
    const fetchOther = async () => {
       if (!targetId) return;
       try {
         console.log("[CHAT LOG] Fetching target details for:", targetId);
         const snap = await getDoc(doc(db, 'users', targetId));
         if (snap.exists()) setOtherUser(snap.data());
       } catch (err) {
         console.warn("[CHAT WARNING] Failed to fetch partner info:", err);
       }
    };
    fetchOther();

    return () => unsubscribe();
  }, [chatId]); // chatId is stable enough

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !chatId || !myPhone || !targetId) {
      console.error("[CHAT ERROR] Send aborted, state invalid:", { chatId, myPhone, targetId });
      return;
    }

    const text = message.trim();
    setMessage('');

    try {
      console.log("[CHAT LOG] Sending message to:", chatId);
      // Add message to Firestore
      await addDoc(collection(db, 'chats', chatId, 'messages'), {
        text,
        senderId: myPhone,
        createdAt: serverTimestamp(),
      });

      // Trigger Notification for the other party
      const myName = localStorage.getItem('userName') || 'Partner';
      const role = localStorage.getItem('userRole');
      
      await addNotification(
        targetId,
        '💬 New Message',
        `${myName}: ${text}`,
        'system',
        { 
           [role === 'provider' ? 'providerId' : 'customerId']: myPhone,
           [role === 'provider' ? 'providerName' : 'customerName']: myName
        }
      );
    } catch (err) {
      console.error("[CHAT ERROR] Message Transmission Failed:", err);
    }
  };

  return (
    <div className="size-full flex flex-col bg-[#F9FAFB]">
      {/* Header */}
      <div className="px-6 pt-12 pb-6 flex items-center justify-between border-b border-gray-100 bg-white sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center active:scale-95 transition-all">
            <ArrowLeft className="w-5 h-5 text-gray-900" />
          </button>
          <div className="flex items-center gap-3">
             <div className="w-12 h-12 rounded-[18px] bg-blue-600 flex items-center justify-center text-white font-black text-lg overflow-hidden border-2 border-white shadow-xl shadow-blue-100">
               {otherUser?.photo ? (
                 <img src={otherUser.photo} alt="Profile" className="w-full h-full object-cover" />
               ) : (
                 targetName[0]?.toUpperCase()
               )}
             </div>
             <div>
                <h1 className="font-black text-lg text-gray-900 leading-tight uppercase tracking-tighter">{targetName}</h1>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className={`w-2 h-2 rounded-full ${otherUser?.isOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`} />
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">
                    {otherUser?.isOnline ? 'MISSION LIVE' : 'OPERATIONAL OFFLINE'}
                  </p>
                </div>
             </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => window.open(`tel:+91${targetId}`)}
            className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center active:scale-95 transition-all"
          >
            <Phone className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 bg-gray-50 text-gray-400 rounded-xl flex items-center justify-center active:scale-95 transition-all">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {chatId === null ? (
           <div className="flex flex-col items-center justify-center h-full text-red-500 font-bold p-10 text-center">
              Channel Handshake Failed. Please return to booking and try again.
           </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 px-12 text-center">
             <div className="w-20 h-20 bg-white rounded-[28px] flex items-center justify-center shadow-sm">
                <MessageSquare className="w-10 h-10 text-gray-200" />
             </div>
             <p className="font-black text-gray-900 uppercase tracking-tight text-lg">Communication Channel Open</p>
             <p className="text-sm text-gray-400 font-medium leading-relaxed italic">
                All communications on HireBy are encrypted and logged for mission safety.
             </p>
          </div>
        ) : (
          messages.map((msg) => {
            const msgSenderId = getCleanPhone(msg.senderId);
            const isMe = msgSenderId === myPhone;
            return (
              <div
                key={msg.id}
                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] px-5 py-4 shadow-sm border transition-all animate-in fade-in slide-in-from-bottom-2 ${
                    isMe
                      ? 'bg-gray-900 text-white rounded-[24px] rounded-tr-[4px] border-gray-900 shadow-xl shadow-gray-100'
                      : 'bg-white text-gray-900 rounded-[24px] rounded-tl-[4px] border-gray-100'
                  }`}
                >
                  <p className="text-sm font-bold leading-relaxed">{msg.text}</p>
                  <div className={`mt-2 flex items-center gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <p className={`text-[9px] font-black uppercase tracking-widest ${isMe ? 'text-white/40' : 'text-gray-300'}`}>
                      {msg.createdAt?.toDate ? 
                        new Date(msg.createdAt.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 
                        'TRANSMITTING...'}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input */}
      <div className="px-6 py-6 bg-white border-t border-gray-100 sticky bottom-0">
        <form onSubmit={handleSend} className="bg-gray-50 border border-gray-100 rounded-[28px] p-2 flex items-center gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Transmit data..."
            className="flex-1 px-4 py-3 bg-transparent text-gray-900 font-bold text-sm focus:outline-none placeholder:text-gray-300 placeholder:uppercase placeholder:tracking-widest"
          />
          <button 
            type="submit"
            disabled={!message.trim()}
            className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-blue-100 active:scale-90 transition-all disabled:opacity-50 disabled:shadow-none"
          >
            <Send className="w-5 h-5 fill-white" />
          </button>
        </form>
      </div>
    </div>
  );
}
