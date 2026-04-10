import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { ArrowLeft, Search, SlidersHorizontal, Star, MapPin, X, Loader2 } from 'lucide-react';
import { db } from '../firebase/config';
import { collection, query, where, onSnapshot, orderBy, limit } from 'firebase/firestore';
import BottomNav from './BottomNav.tsx';
import ProviderBottomNav from './ProviderBottomNav.tsx';

export default function SearchResults() {
  const navigate = useNavigate();
  const location = useLocation();
  const role = localStorage.getItem('userRole');
  const initialQuery = location.state?.query || '';
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [rating, setRating] = useState('all');
  const [sortBy, setSortBy] = useState('relevance');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Fetch all qualified providers
    const q = query(
      collection(db, 'users'),
      where('role', '==', 'provider'),
      where('profileComplete', '==', true),
      orderBy('rating', 'desc'),
      limit(20)
    );

    const unsubscribe = onSnapshot(q, (snap) => {
      const allProviders = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as any[];

      // In-memory filtering for more flexible search (name or service)
      const filtered = allProviders.filter(p => {
        const queryLower = searchQuery.toLowerCase();
        const matchesName = p.name?.toLowerCase().includes(queryLower);
        const matchesService = p.category?.toLowerCase().includes(queryLower);
        return matchesName || matchesService;
      });

      setResults(filtered);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching search results:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [searchQuery]);

  return (
    <div className="size-full flex flex-col bg-white">
      <div className="px-4 py-4 border-b border-gray-100">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={() => navigate(-1)} className="p-1">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search services..."
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        </div>
        <p className="text-sm text-gray-600">{results.length} results for "{searchQuery}"</p>
      </div>

      {showFilters && (
        <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold">Filters</h3>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setPriceRange('all');
                setRating('all');
                setSortBy('relevance');
              }}
              className="text-sm text-blue-600 font-semibold"
            >
              Reset All
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-2 text-gray-700">SORT BY</label>
              <div className="flex flex-wrap gap-2">
                {['Relevance', 'Price: Low to High', 'Price: High to Low', 'Rating'].map((option) => (
                  <button
                    key={option}
                    onClick={() => setSortBy(option.toLowerCase())}
                    className={`px-3 py-2 rounded-lg text-sm font-medium ${
                      sortBy === option.toLowerCase()
                        ? 'bg-gray-900 text-white'
                        : 'bg-white text-gray-700 border border-gray-200'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-2 text-gray-700">PRICE RANGE</label>
              <div className="flex flex-wrap gap-2">
                {['All', '₹0-500', '₹500-1000', '₹1000+'].map((option) => (
                  <button
                    key={option}
                    onClick={() => setPriceRange(option.toLowerCase())}
                    className={`px-3 py-2 rounded-lg text-sm font-medium ${
                      priceRange === option.toLowerCase()
                        ? 'bg-gray-900 text-white'
                        : 'bg-white text-gray-700 border border-gray-200'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-2 text-gray-700">MINIMUM RATING</label>
              <div className="flex flex-wrap gap-2">
                {['All', '4+', '4.5+', '4.8+'].map((option) => (
                  <button
                    key={option}
                    onClick={() => setRating(option.toLowerCase())}
                    className={`px-3 py-2 rounded-lg text-sm font-medium ${
                      rating === option.toLowerCase()
                        ? 'bg-gray-900 text-white'
                        : 'bg-white text-gray-700 border border-gray-200'
                    }`}
                  >
                    {option === 'All' ? option : `${option} ★`}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-6 py-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-40 gap-3">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            <p className="text-gray-500 text-sm">Searching for experts...</p>
          </div>
        ) : results.length > 0 ? (
          <div className="space-y-3">
            {results.map((result) => (
              <button
                key={result.id}
                onClick={() => navigate(`/provider-profile/${result.id}`)}
                className="w-full bg-white border border-gray-200 rounded-xl p-4 text-left hover:border-gray-300 transition-colors shadow-sm"
              >
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 bg-blue-100 rounded-xl flex-shrink-0 overflow-hidden flex items-center justify-center text-blue-600 font-bold text-xl">
                    {result.photo ? (
                      <img src={result.photo} className="w-full h-full object-cover" alt={result.name} loading="lazy" />
                    ) : (
                      result.name?.[0]?.toUpperCase() || 'P'
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg mb-0.5 truncate">{result.name}</h3>
                    <p className="text-sm font-semibold text-blue-600 mb-2 uppercase tracking-wide">
                      {result.category || 'Professional'}
                    </p>
                    <div className="flex items-center gap-3 text-sm mb-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-bold">{result.rating ? result.rating.toFixed(1) : 'New'}</span>
                        <span className="text-gray-500">({result.ratingCount || 0})</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600">
                        <MapPin className="w-3 h-3" />
                        <span className="text-xs">{result.location || 'Nearby'}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-xl font-black text-gray-900">
                        ₹{result.hourlyRate || '500'}
                        <span className="text-xs text-gray-400 font-normal">/hr</span>
                      </span>
                      <div className={`px-3 py-1 text-[10px] font-black rounded-full uppercase tracking-widest border ${
                        result.isOnline ? 'bg-green-50 text-green-700 border-green-100' : 'bg-gray-50 text-gray-500 border-gray-100'
                      }`}>
                        {result.isOnline ? 'Available' : 'Offline'}
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-60 text-center px-10">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="font-bold text-lg mb-2">No results found</h3>
            <p className="text-sm text-gray-500">
              We couldn't find any experts matching "{searchQuery}". Try searching for categories like "cleaning" or "plumbing".
            </p>
          </div>
        )}
      </div>
      <div className="pb-24" /> {/* Spacer */}
      {role === 'provider' ? <ProviderBottomNav /> : <BottomNav />}
    </div>
  );
}
