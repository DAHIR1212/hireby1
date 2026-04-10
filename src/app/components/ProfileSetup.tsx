import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Camera, MapPin, Mic, Sparkles } from 'lucide-react';
import { db } from '../firebase/config';
import { doc, updateDoc, setDoc } from 'firebase/firestore';

export default function ProfileSetup() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [showAISuggestions, setShowAISuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const aiSuggestions = [
    'Mumbai, Maharashtra',
    'Delhi, NCR',
    'Bangalore, Karnataka',
    'Rajkot, Gujarat',
    'Ahmedabad, Gujarat',
    'Surat, Gujarat',
  ];

  // ✅ Handle photo from gallery or camera
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setPhoto(base64);
        localStorage.setItem('userPhoto', base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleContinue = async () => {
    if (!name.trim()) {
      alert('Please enter your name');
      return;
    }
    setLoading(true);

    try {
      // ✅ Save to localStorage
      localStorage.setItem('userName', name);
      localStorage.setItem('userLocation', location);

      // ✅ Save to Firestore
      const phone = localStorage.getItem('userPhone');
      if (phone) {
        const userRef = doc(db, 'users', phone);
        await setDoc(userRef, {
          phone: `+91${phone}`,
          name,
          location,
          photo: photo || null,
          profileComplete: true,
          role: 'customer',
          updatedAt: new Date().toISOString(),
        }, { merge: true });
      }

      navigate('/home');
    } catch (err) {
      console.error(err);
      navigate('/home');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="size-full flex flex-col bg-white">
      <div className="px-4 py-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-1">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="font-bold text-lg">HireBy</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-8">
        <h2 className="text-3xl font-bold mb-2">Set up your profile</h2>
        <p className="text-gray-600 mb-8">Tell us a bit about yourself</p>

        <div className="space-y-6">

          {/* ✅ Profile Photo */}
          <div className="flex flex-col items-center mb-6">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-24 h-24 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 mb-3 cursor-pointer overflow-hidden relative"
            >
              {photo ? (
                <img src={photo} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <Camera className="w-8 h-8 text-gray-400" />
              )}
              <div className="absolute bottom-0 right-0 w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center">
                <Camera className="w-4 h-4 text-white" />
              </div>
            </div>
            <p className="font-semibold">Profile Picture</p>
            <p className="text-sm text-gray-500">Tap to upload photo</p>
            {/* Hidden file input - supports camera on mobile */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="user"
              onChange={handlePhotoChange}
              className="hidden"
            />
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">FULL NAME *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="w-full px-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">LOCATION</label>
            <div className="relative">
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onFocus={() => setShowAISuggestions(true)}
                onBlur={() => setTimeout(() => setShowAISuggestions(false), 200)}
                placeholder="City, State"
                className="w-full px-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 pr-24"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <Mic className="w-5 h-5 text-gray-400" />
                <Sparkles className="w-5 h-5 text-blue-600" />
              </div>
              {showAISuggestions && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 overflow-hidden">
                  {aiSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setLocation(suggestion);
                        setShowAISuggestions(false);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-2 border-b border-gray-100 last:border-b-0"
                    >
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span>{suggestion}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      <div className="px-6 pb-8">
        <button
          onClick={handleContinue}
          disabled={loading || !name.trim()}
          className={`w-full py-4 rounded-lg font-semibold mb-3 transition-colors ${name.trim() && !loading
              ? 'bg-gray-900 text-white hover:bg-gray-800'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
        >
          {loading ? 'Saving...' : 'Continue'}
        </button>
        <p className="text-center text-sm text-gray-500">You can update this later</p>
      </div>
    </div>
  );
}