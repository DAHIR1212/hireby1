import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Send, Phone, ArrowLeft, MessageSquare, Mic, MicOff, Sparkles, X, Volume2 } from 'lucide-react';
import { db } from '../firebase/config';
import {
  collection, addDoc, onSnapshot,
  query, orderBy, serverTimestamp
} from 'firebase/firestore';

// ── Types ──────────────────────────────────────────────────────────────────────
interface Message {
  id: string;
  text: string;
  senderId: string;
  createdAt: any;
  type?: 'text' | 'ai';
}

// ── AI Quick Reply Engine ──────────────────────────────────────────────────────
const AI_REPLIES: Record<string, string[]> = {
  price: ['My rate is negotiable. What is your budget?', 'Let me check my current pricing and get back to you.'],
  time: ['I can be there in 30 to 45 mins.', 'What time works best for you?', 'I am available from 9 AM to 7 PM today.'],
  available: ['Yes, I am available right now!', 'I have a slot open this afternoon.', 'Let me check my schedule and confirm.'],
  hello: ['Hi! How can I help you today?', 'Hello! Ready to assist.', 'Hey there! What service do you need?'],
  done: ['Job completed! Please confirm and rate the service.', 'All done! Let me know if anything needs attention.'],
  address: ['Please share your exact address or pin location.', 'Can you confirm the service address?'],
  pay: ['You can pay via UPI, cash, or card after the job.', 'Payment is due after service completion.'],
  default: ['Got it! I will get back to you shortly.', 'Understood. On my way!', 'Sure, I can help with that.'],
};

function getAIReply(input: string): string {
  const lower = input.toLowerCase();
  let pool = AI_REPLIES.default;
  if (lower.match(/price|rate|cost|charge|fee/)) pool = AI_REPLIES.price;
  else if (lower.match(/time|when|how long|eta|soon/)) pool = AI_REPLIES.time;
  else if (lower.match(/available|free|busy|slot/)) pool = AI_REPLIES.available;
  else if (lower.match(/hi|hello|hey|namaste|good/)) pool = AI_REPLIES.hello;
  else if (lower.match(/done|finish|complet|over/)) pool = AI_REPLIES.done;
  else if (lower.match(/address|location|where|area/)) pool = AI_REPLIES.address;
  else if (lower.match(/pay|payment|upi|cash|gpay/)) pool = AI_REPLIES.pay;
  return pool[Math.floor(Math.random() * pool.length)];
}

// ── Voice Recognition Hook ─────────────────────────────────────────────────────
function useVoiceRecognition(onResult: (text: string) => void) {
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(false);
  const recRef = useRef<any>(null);

  useEffect(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;
    setSupported(true);
    const rec = new SR();
    rec.lang = 'en-IN';
    rec.continuous = false;
    rec.interimResults = false;
    rec.onresult = (e: any) => {
      onResult(e.results[0][0].transcript);
      setListening(false);
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
    recRef.current = rec;
  }, [onResult]);

  const startListening = () => {
    if (recRef.current && !listening) {
      try { recRef.current.start(); setListening(true); } catch { setListening(false); }
    }
  };
  const stopListening = () => {
    if (recRef.current && listening) { recRef.current.stop(); setListening(false); }
  };

  return { listening, supported, startListening, stopListening };
}

// ── TTS helper ─────────────────────────────────────────────────────────────────
function speak(text: string) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(text);
  utt.lang = 'en-IN';
  utt.rate = 0.95;
  window.speechSynthesis.speak(utt);
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function Chat() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [connected, setConnected] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [aiTyping, setAiTyping] = useState(false);
  const [speakAuto, setSpeakAuto] = useState(false);
  const [sendingAI, setSendingAI] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Identity
  const myPhone = (localStorage.getItem('userPhone') || '').replace(/\D/g, '').slice(-10);
  const myName = localStorage.getItem('userName') || 'Me';
  const myRole = localStorage.getItem('userRole') || 'customer';

  const rawTarget = searchParams.get('providerId') || searchParams.get('customerId') || '';
  const targetId = rawTarget.replace(/\D/g, '').slice(-10);
  const targetName = searchParams.get('providerName') || searchParams.get('customerName') || 'Contact';

  const chatId = myPhone && targetId ? [myPhone, targetId].sort().join('_') : null;

  // ── Real-time Firebase listener ──────────────────────────────────────────────
  useEffect(() => {
    if (!chatId) return;
    const q = query(
      collection(db, 'chats', chatId, 'messages'),
      orderBy('createdAt', 'asc')
    );
    const unsub = onSnapshot(q,
      (snap) => {
        const msgs = snap.docs.map(d => ({ id: d.id, ...d.data() })) as Message[];
        setMessages(msgs);
        setConnected(true);
        setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' }), 80);
        // Auto-speak last received message
        if (speakAuto && msgs.length) {
          const last = msgs[msgs.length - 1];
          if (last.senderId !== myPhone) speak(last.text);
        }
      },
      (err) => {
        console.error('Chat error:', err);
        setConnected(false);
      }
    );
    return () => unsub();
  }, [chatId, speakAuto, myPhone]);

  // ── Send message ─────────────────────────────────────────────────────────────
  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const text = message.trim();
    if (!text || !chatId || !myPhone) return;
    setMessage('');

    await addDoc(collection(db, 'chats', chatId, 'messages'), {
      text,
      senderId: myPhone,
      senderName: myName,
      createdAt: serverTimestamp(),
      type: 'text',
    });
  };

  // ── AI suggested reply (sends as the other side for demo) ────────────────────
  const sendAISuggestion = async (text: string) => {
    if (!chatId) return;
    setShowAI(false);
    setMessage(text);
    inputRef.current?.focus();
  };

  // ── Voice recognition ─────────────────────────────────────────────────────────
  const handleVoiceResult = useCallback((text: string) => {
    setMessage(prev => prev ? prev + ' ' + text : text);
    inputRef.current?.focus();
  }, []);

  const { listening, supported, startListening, stopListening } = useVoiceRecognition(handleVoiceResult);

  // ── Quick reply suggestions ───────────────────────────────────────────────────
  const suggestions = myRole === 'provider'
    ? ['I am on my way! ETA 20 mins', 'Job completed', 'Please share your address', 'Available now!', 'Need 1 hour for this job', 'Payment after completion']
    : ['When can you arrive?', 'What is your rate?', 'Are you available now?', 'Please call me', 'How long will it take?', 'I will pay after the job'];

  if (!chatId) {
    return (
      <div className="size-full flex flex-col items-center justify-center bg-white gap-4 p-10 text-center">
        <p className="text-4xl">warning</p>
        <h2 className="font-bold text-gray-800">Chat session invalid</h2>
        <p className="text-gray-500 text-sm">Missing contact info. Go back and try again.</p>
        <button onClick={() => navigate(-1)} className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold">Go Back</button>
      </div>
    );
  }

  return (
    <div className="size-full flex flex-col bg-[#F9FAFB]">

      {/* ── Header ── */}
      <div className="px-4 pt-10 pb-4 flex items-center justify-between border-b border-gray-100 bg-white sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center active:scale-95 transition-all">
            <ArrowLeft className="w-5 h-5 text-gray-900" />
          </button>
          <div className="w-11 h-11 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-blue-100">
            {targetName[0]?.toUpperCase()}
          </div>
          <div>
            <h1 className="font-black text-base text-gray-900 leading-tight">{targetName}</h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`} />
              <p className={`text-[10px] font-black uppercase tracking-widest ${connected ? 'text-green-500' : 'text-gray-400'}`}>
                {connected ? 'Live' : 'Connecting...'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSpeakAuto(v => !v)}
            className={`w-10 h-10 rounded-xl flex items-center justify-center active:scale-95 transition-all ${speakAuto ? 'bg-blue-600 text-white' : 'bg-gray-50 text-gray-400'}`}
            title="Auto read messages aloud"
          >
            <Volume2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => window.open(`tel:+91${targetId}`)}
            className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center active:scale-95 transition-all"
          >
            <Phone className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-4 px-8 text-center py-20">
            <div className="w-20 h-20 bg-white rounded-[28px] flex items-center justify-center shadow-sm border border-gray-100">
              <MessageSquare className="w-10 h-10 text-gray-200" />
            </div>
            <p className="font-black text-gray-800 text-lg">Say Hello</p>
            <p className="text-sm text-gray-400 leading-relaxed">
              Messages are synced in real time. Use <span className="font-bold text-blue-600">the sparkle button</span> for quick replies or <span className="font-bold text-blue-600">hold the mic</span> to speak.
            </p>
          </div>
        )}

        {messages.map((msg) => {
          const isMe = msg.senderId?.replace(/\D/g, '').slice(-10) === myPhone;
          const time = msg.createdAt?.toDate
            ? new Date(msg.createdAt.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : 'sending...';

          return (
            <div key={msg.id} className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}>
              {!isMe && (
                <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-xs flex-shrink-0">
                  {targetName[0]?.toUpperCase()}
                </div>
              )}
              <div className={`max-w-[78%] px-4 py-3 shadow-sm ${isMe
                ? 'bg-gray-900 text-white rounded-[20px] rounded-tr-[4px]'
                : 'bg-white text-gray-900 rounded-[20px] rounded-tl-[4px] border border-gray-100'
                }`}>
                <p className="text-sm font-medium leading-relaxed">{msg.text}</p>
                <div className={`mt-1.5 flex items-center gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <p className="text-[9px] font-black uppercase tracking-widest opacity-40">{time}</p>
                  {!isMe && (
                    <button onClick={() => speak(msg.text)} className="opacity-30 hover:opacity-80 transition-opacity">
                      <Volume2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {aiTyping && (
          <div className="flex items-end gap-2 justify-start">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-xs flex-shrink-0">
              {targetName[0]?.toUpperCase()}
            </div>
            <div className="bg-white border border-gray-100 rounded-[20px] rounded-tl-[4px] px-4 py-3 shadow-sm">
              <div className="flex items-center gap-1">
                {[0, 1, 2].map(i => (
                  <div key={i} className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
                ))}
              </div>
            </div>
          </div>
        )}

        <div ref={scrollRef} />
      </div>

      {/* ── AI Quick Replies Panel ── */}
      {showAI && (
        <div className="bg-white border-t border-gray-100 px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-black text-gray-700 uppercase tracking-widest">Quick Replies</span>
            </div>
            <button onClick={() => setShowAI(false)} className="w-6 h-6 flex items-center justify-center text-gray-400">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => sendAISuggestion(s)}
                className="px-3 py-2 bg-blue-50 text-blue-700 rounded-xl text-xs font-bold border border-blue-100 active:scale-95 transition-all hover:bg-blue-100"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Input Bar ── */}
      <div className="px-4 py-3 bg-white border-t border-gray-100 sticky bottom-0">
        <form onSubmit={handleSend} className="flex items-center gap-2">

          {/* AI toggle */}
          <button
            type="button"
            onClick={() => setShowAI(v => !v)}
            className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all active:scale-90 ${showAI ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-gray-100 text-blue-600'}`}
          >
            <Sparkles className="w-5 h-5" />
          </button>

          {/* Text input + mic */}
          <div className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl flex items-center px-4 py-2.5 gap-2">
            <input
              ref={inputRef}
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={listening ? 'Listening...' : 'Type a message...'}
              className="flex-1 bg-transparent text-gray-900 font-medium text-sm focus:outline-none placeholder:text-gray-400"
            />
            {supported && (
              <button
                type="button"
                onMouseDown={startListening}
                onMouseUp={stopListening}
                onTouchStart={startListening}
                onTouchEnd={stopListening}
                className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all active:scale-90 ${listening ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-200 text-gray-500'}`}
                title="Hold to speak"
              >
                {listening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
            )}
          </div>

          {/* Send */}
          <button
            type="submit"
            disabled={!message.trim()}
            className="w-11 h-11 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-100 active:scale-90 transition-all disabled:opacity-40 disabled:shadow-none flex-shrink-0"
          >
            <Send className="w-5 h-5 fill-white" />
          </button>
        </form>

        {supported && (
          <p className="text-center text-[9px] text-gray-300 font-black uppercase tracking-widest mt-1.5">
            {listening ? 'Recording — release to stop' : 'Hold mic to voice type'}
          </p>
        )}
      </div>
    </div>
  );
}