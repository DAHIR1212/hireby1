import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Search, Home as HomeIcon, Wrench, Zap, Paintbrush, Wind, Hammer, Sparkles, TrendingUp, Mic, Star, MapPin } from 'lucide-react';
import BottomNav from './BottomNav.tsx';
import { useTranslation } from '../hooks/useTranslation.ts';
import { useBooking, Booking } from '../context/BookingContext.tsx';
import { db } from '../firebase/config';
import { collection, query, where, limit, onSnapshot, orderBy } from 'firebase/firestore';

export default function Home() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const { myBookings } = useBooking();
  const [realProviders, setRealProviders] = useState<any[]>([]);
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);

  useEffect(() => {
    // ✅ Fetch top rated providers from Firestore
    const q = query(
      collection(db, 'users'),
      where('role', '==', 'provider'),
      where('profileComplete', '==', true),
      orderBy('rating', 'desc'),
      limit(10)
    );
    const unsubscribe = onSnapshot(q, (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setRealProviders(data);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Show location prompt mock if not asked before
    if (!localStorage.getItem('locationAsked')) {
      const timer = setTimeout(() => setShowLocationPrompt(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleLocationAllow = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          localStorage.setItem('userGeoLat', pos.coords.latitude.toString());
          localStorage.setItem('userGeoLng', pos.coords.longitude.toString());
        },
        () => console.log('Location denied by browser') // Ignore silently
      );
    }
    localStorage.setItem('locationAsked', 'true');
    setShowLocationPrompt(false);
  };

  const latestBooking = myBookings[0];

  // ✅ Get real user data
  const userName = localStorage.getItem('userName') || 'there';
  const userPhoto = localStorage.getItem('userPhoto');
  const firstName = userName.split(' ')[0];

  const services = [
    { id: 1, nameKey: 'cleaning' as const, icon: HomeIcon, color: 'bg-blue-100 text-blue-600' },
    { id: 2, nameKey: 'plumbing' as const, icon: Wrench, color: 'bg-purple-100 text-purple-600' },
    { id: 3, nameKey: 'electrical' as const, icon: Zap, color: 'bg-yellow-100 text-yellow-600' },
    { id: 4, nameKey: 'painting' as const, icon: Paintbrush, color: 'bg-green-100 text-green-600' },
    { id: 5, nameKey: 'acRepair' as const, icon: Wind, color: 'bg-cyan-100 text-cyan-600' },
    { id: 6, nameKey: 'carpentry' as const, icon: Hammer, color: 'bg-orange-100 text-orange-600' },
  ];

  const aiSuggestions = [
    { text: 'Deep home cleaning', trending: true },
    { text: 'AC repair and maintenance', trending: true },
    { text: 'Plumbing emergency services', trending: false },
    { text: 'Interior painting', trending: false },
    { text: 'Electrical safety inspection', trending: true },
  ];

  const startVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice search not supported. Please use Chrome or Edge.');
      return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setSearchQuery(transcript);
      setShowSearchSuggestions(false);
      setIsListening(false);
      setTimeout(() => navigate('/search-results', { state: { query: transcript } }), 500);
    };
    recognition.onerror = (event: any) => {
      setIsListening(false);
      if (event.error === 'no-speech') alert('No speech detected. Try again.');
      else if (event.error === 'not-allowed') alert('Microphone permission denied.');
    };
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };





  return (
    <div className="size-full flex flex-col bg-gray-50">
      <div className="flex-1 overflow-y-auto pb-24">

        {/* Sticky Header */}
        <div className="bg-white px-6 pt-6 pb-4 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              {/* ✅ Real name shows here */}
              <h1 className="text-2xl font-bold">{t('hello')}, {firstName} 👋</h1>
              <p className="text-gray-500 text-sm">{t('whatServiceNeed')}</p>
            </div>
            {/* ✅ Real photo shows here */}
            <button onClick={() => navigate('/profile')}>
              {userPhoto ? (
                <img
                  src={userPhoto}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover border-2 border-blue-600"
                />
              ) : (
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  {firstName[0]?.toUpperCase() || 'U'}
                </div>
              )}
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 z-10" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowSearchSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSearchSuggestions(false), 200)}
              placeholder={t('searchServices')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchQuery.trim()) {
                  navigate('/search-results', { state: { query: searchQuery } });
                }
              }}
              className="w-full pl-12 pr-24 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 z-10">
              <button
                onClick={startVoiceSearch}
                className={`p-1 rounded transition-colors ${isListening ? 'bg-red-100 animate-pulse' : 'hover:bg-gray-200'}`}
              >
                <Mic className={`w-5 h-5 ${isListening ? 'text-red-600' : 'text-gray-600'}`} />
              </button>
              <Sparkles className="w-5 h-5 text-blue-600" />
            </div>

            {showSearchSuggestions && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-hidden">
                <div className="px-4 py-3 bg-blue-50 border-b border-blue-100 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-semibold text-blue-600">AI Predictions</span>
                </div>
                {aiSuggestions
                  .filter(s => s.text.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSearchQuery(suggestion.text);
                        setShowSearchSuggestions(false);
                        navigate('/search-results', { state: { query: suggestion.text } });
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 border-b border-gray-100 last:border-b-0"
                    >
                      <Search className="w-4 h-4 text-gray-400" />
                      <span className="flex-1 text-sm">{suggestion.text}</span>
                      {suggestion.trending && (
                        <div className="flex items-center gap-1 text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">
                          <TrendingUp className="w-3 h-3" />
                          <span>Trending</span>
                        </div>
                      )}
                    </button>
                  ))}
                {searchQuery && !aiSuggestions.some(s => s.text.toLowerCase().includes(searchQuery.toLowerCase())) && (
                   <button
                   onClick={() => {
                     setShowSearchSuggestions(false);
                     navigate('/search-results', { state: { query: searchQuery } });
                   }}
                   className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3"
                 >
                   <Search className="w-4 h-4 text-gray-400" />
                   <span className="flex-1 text-sm font-semibold">Search for "{searchQuery}"</span>
                 </button>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="px-6 py-4 space-y-6">

          {/* Banner */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-6 text-white">
            <p className="text-xs font-semibold text-blue-200 mb-1">LIMITED TIME</p>
            <h3 className="text-lg font-bold mb-1">{t('specialOffer')} 🎉</h3>
            <p className="text-sm mb-4 text-blue-100">{t('specialOfferDesc')}</p>
            <button
              onClick={() => navigate('/services')}
              className="bg-white text-blue-600 px-5 py-2 rounded-xl text-sm font-bold"
            >
              {t('bookNow')}
            </button>
          </div>

          {/* Services */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">{t('popularServices')}</h2>
              <button onClick={() => navigate('/services')} className="text-blue-600 text-sm font-semibold">See all</button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {services.map((service) => (
                <button
                  key={service.id}
                  onClick={() => navigate('/services', { state: { category: t(service.nameKey) } })}
                  className="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow group active:scale-95 transition-all"
                >
                  <div className={`w-12 h-12 rounded-xl ${service.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <service.icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-black text-center text-gray-700 uppercase tracking-tighter">{t(service.nameKey)}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Top Providers */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-black uppercase tracking-tighter italic">Top Specialists</h2>
              <button onClick={() => navigate('/services')} className="text-blue-600 text-xs font-black uppercase tracking-widest">See all</button>
            </div>
            <div className="space-y-3">
              {realProviders.length === 0 ? (
                 <div className="p-8 bg-white rounded-2xl border border-dashed border-gray-100 text-center animate-pulse">
                   <p className="text-xs text-gray-400 font-bold uppercase tracking-widest leading-none">Scanning for Elite Agents...</p>
                 </div>
              ) : realProviders.map((provider) => (
                <div
                  key={provider.id}
                  onClick={() => navigate(`/provider-profile/${provider.id}`)}
                  className="bg-white rounded-[24px] p-4 flex items-center gap-4 shadow-sm cursor-pointer hover:shadow-md transition-all active:scale-[0.98] border border-gray-50"
                >
                  <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-xl shadow-blue-100 overflow-hidden">
                    {provider.photo ? (
                      <img 
                        src={provider.photo} 
                        className="size-full object-cover" 
                        alt={provider.name} 
                        loading="lazy"
                      />
                    ) : provider.name[0]}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-black text-gray-900 leading-tight truncate">{provider.name}</h3>
                    <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest mt-0.5">{provider.category || 'Specialist'}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-sm font-black text-yellow-500">
                       <Star className="w-4 h-4 fill-yellow-400" />
                       {provider.rating ? provider.rating.toFixed(1) : 'New'}
                    </div>
                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                      {provider.ratingCount || 0} REVIEWS
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Bookings */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-black uppercase tracking-tighter italic">{t('recentBookings')}</h2>
              <button onClick={() => navigate('/my-bookings')} className="text-blue-600 text-xs font-black uppercase tracking-widest">{t('viewAll')}</button>
            </div>
            {latestBooking ? (
              <div 
                onClick={() => navigate(`/booking-detail/${latestBooking.id}`)}
                className="bg-gray-900 rounded-[28px] p-6 flex items-center gap-4 shadow-2xl shadow-gray-200 cursor-pointer active:scale-[0.98] transition-all border-l-8 border-blue-500"
              >
                <div className="w-14 h-14 bg-white/10 rounded-[18px] flex items-center justify-center text-white backdrop-blur-md">
                   {latestBooking.service.toLowerCase().includes('clean') ? <HomeIcon /> : <Zap />}
                </div>
                <div className="flex-1">
                  <h3 className="font-black text-white text-lg leading-tight uppercase tracking-tighter truncate">{latestBooking.service}</h3>
                  <p className="text-[10px] text-white/50 font-black uppercase tracking-widest mt-0.5">With {latestBooking.providerName}</p>
                  <p className="text-[10px] text-blue-400 font-black uppercase mt-1">Status: {latestBooking.status}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-white">₹{latestBooking.price}</p>
                  <div className="text-[10px] font-black text-green-400 uppercase tracking-widest mt-1">SECURE</div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-8 border-2 border-dashed border-gray-100 text-center">
                 <p className="text-xs text-gray-400 font-bold uppercase tracking-widest leading-none">Recordings Clear. Ready for Mission.</p>
              </div>
            )}
          </div>

          {/* How it works */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h2 className="text-lg font-bold mb-4">How it works</h2>
            <div className="space-y-4">
              {[
                { step: '1', title: 'Choose a service', desc: 'Browse from 50+ home services', color: 'bg-blue-100 text-blue-600' },
                { step: '2', title: 'Book instantly', desc: 'Pick date, time and confirm', color: 'bg-purple-100 text-purple-600' },
                { step: '3', title: 'Get it done', desc: 'Expert arrives at your door', color: 'bg-green-100 text-green-600' },
              ].map((item) => (
                <div key={item.step} className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full ${item.color} flex items-center justify-center font-bold text-sm`}>
                    {item.step}
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">{item.title}</h3>
                    <p className="text-xs text-gray-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {showLocationPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-gray-900/40 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-[32px] w-full max-w-sm shadow-2xl relative overflow-hidden text-center animate-in fade-in zoom-in duration-300">
            <div className="w-20 h-20 bg-blue-50 rounded-full mx-auto mb-6 flex items-center justify-center border border-blue-100">
               <MapPin className="w-8 h-8 text-blue-600 mb-1 animate-bounce" />
            </div>
            <h3 className="text-2xl font-black mb-2 text-gray-900 leading-tight tracking-tighter">Enable Live Tracking</h3>
            <p className="text-sm text-gray-500 mb-8 font-medium">We need your location to show accurate specialist arrival times and live map tracking.</p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={handleLocationAllow}
                className="w-full py-4 rounded-2xl bg-blue-600 text-white font-bold tracking-tight shadow-lg shadow-blue-200 active:scale-95 transition-all"
              >
                Allow GPS Access
              </button>
              <button 
                onClick={() => {
                  localStorage.setItem('locationAsked', 'true');
                  setShowLocationPrompt(false);
                }}
                className="w-full py-4 rounded-2xl bg-gray-50 text-gray-500 font-bold active:scale-95 transition-all"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}