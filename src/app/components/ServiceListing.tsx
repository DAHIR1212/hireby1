import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { ArrowLeft, Search, Star, MapPin, Filter } from 'lucide-react';
import { db } from '../firebase/config';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import BottomNav from './BottomNav.tsx';
import ProviderBottomNav from './ProviderBottomNav.tsx';

export default function ServiceListing() {
  const navigate = useNavigate();
  const location = useLocation();
  const role = localStorage.getItem('userRole');
  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(location.state?.category || 'All');

  const categories = [
    'All', 'Cleaning', 'Plumbing', 'Electrical',
    'Painting', 'AC Repair', 'Carpentry'
  ];

  useEffect(() => {
    // ✅ Real-time providers from Firestore
    const q = query(
      collection(db, 'users'),
      where('role', '==', 'provider'),
      where('profileComplete', '==', true)
    );

    const unsubscribe = onSnapshot(q, (snap) => {
      const data = snap.docs.map(d => ({
        id: d.id,
        ...d.data()
      }));
      setProviders(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // ✅ Filter providers
  const filtered = providers.filter(p => {
    const matchCategory = selectedCategory === 'All' ||
      p.category?.toLowerCase() === selectedCategory.toLowerCase();
    const matchSearch = searchQuery === '' ||
      p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.skills?.some((s: string) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCategory && matchSearch;
  });

  return (
    <div className="size-full flex flex-col bg-gray-50">

      {/* Header */}
      <div className="bg-white px-4 py-4 flex items-center gap-3 border-b border-gray-100 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="p-1">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="font-bold text-lg flex-1">Find Services</h1>
        <button className="p-1">
          <Filter className="w-6 h-6 text-gray-600" />
        </button>
      </div>

      {/* Search */}
      <div className="bg-white px-4 py-3 border-b border-gray-100">
        <div className="relative">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search services or providers..."
            className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white px-4 py-3 border-b border-gray-100">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${selectedCategory === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Providers List */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-500 text-sm">Loading providers...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 py-20">
            <p className="text-4xl">🔍</p>
            <p className="font-bold text-gray-700">No providers found</p>
            <p className="text-sm text-gray-500 text-center">
              No service providers registered yet. Check back soon!
            </p>
          </div>
        ) : (
          filtered.map((provider) => (
            <div
              key={provider.id}
              onClick={() => navigate(`/provider-profile/${provider.id}`)}
              className="bg-white rounded-2xl p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">

                {/* Photo */}
                <div className="relative flex-shrink-0">
                  {provider.photo ? (
                    <img
                      src={provider.photo}
                      alt={provider.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                      {provider.name?.[0]?.toUpperCase() || 'P'}
                    </div>
                  )}
                  {/* Online indicator */}
                  <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${provider.isOnline ? 'bg-green-500' : 'bg-gray-400'
                    }`} />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <h3 className="font-bold text-gray-900">{provider.name}</h3>
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star className="w-4 h-4 fill-yellow-500" />
                      <span className="text-sm font-semibold">{provider.rating ? provider.rating.toFixed(1) : 'New'}</span>
                      <span className="text-xs text-gray-400 font-bold uppercase tracking-tight ml-1">({provider.ratingCount || 0})</span>
                    </div>
                  </div>

                  <p className="text-sm text-blue-600 font-medium capitalize">
                    {provider.category}
                  </p>

                  {provider.location && (
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3" />
                      {provider.location}
                    </p>
                  )}

                  {/* Skills */}
                  {provider.skills && provider.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {provider.skills.slice(0, 3).map((skill: string) => (
                        <span
                          key={skill}
                          className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                      {provider.skills.length > 3 && (
                        <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">
                          +{provider.skills.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Price + Experience */}
                  <div className="flex items-center justify-between mt-3">
                    <div>
                      <span className="text-sm font-bold text-gray-900">
                        {provider.hourlyRate
                          ? `₹${provider.hourlyRate}/hr`
                          : 'Negotiable'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${provider.isOnline
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-500'
                        }`}>
                        {provider.isOnline ? '🟢 Online' : '⚫ Offline'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Book Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/provider-profile/${provider.id}`);
                }}
                className="w-full mt-3 py-2 bg-blue-600 text-white rounded-xl font-semibold text-sm"
              >
                View & Book
              </button>
            </div>
          ))
        )}
      </div>
      <div className="pb-24" /> {/* Spacer */}
      {role === 'provider' ? <ProviderBottomNav /> : <BottomNav />}
    </div>
  );
}