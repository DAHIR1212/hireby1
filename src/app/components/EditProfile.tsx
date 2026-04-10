import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Camera, Mail, Phone, User, Loader2, MapPin } from 'lucide-react';
import { db } from '../firebase/config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export default function EditProfile() {
  const navigate = useNavigate();
  const [name, setName] = useState(localStorage.getItem('userName') || '');
  const [email, setEmail] = useState(localStorage.getItem('userEmail') || '');
  const [phone, setPhone] = useState(localStorage.getItem('userPhone') || '');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const cleanPhone = phone.replace(/\D/g, '').slice(-10);

  useEffect(() => {
    if (!cleanPhone) { setFetching(false); return; }
    getDoc(doc(db, 'users', cleanPhone)).then(snap => {
      if (snap.exists()) {
        const data = snap.data();
        setName(data.name || '');
        setEmail(data.email || '');
        setCity(data.city || '');
        setState(data.state || '');
        
        // If city/state missing but location exists, try to parse
        if (!data.city && data.location) {
           const parts = data.location.split(',');
           if (parts.length >= 2) {
             setCity(parts[0].trim());
             setState(parts[1].trim());
           }
        }
      }
      setFetching(false);
    });
  }, [cleanPhone]);

  const handleSave = async () => {
    if (!name.trim()) return alert('Name is required');
    setLoading(true);
    try {
      const userRef = doc(db, 'users', cleanPhone);
      const location = city && state ? `${city}, ${state}` : (city || state || '');
      
      await updateDoc(userRef, {
        name: name.trim(),
        email: email.trim(),
        city: city.trim(),
        state: state.trim(),
        location: location.trim()
      });

      localStorage.setItem('userName', name.trim());
      localStorage.setItem('userEmail', email.trim());
      localStorage.setItem('userLocation', location.trim());
      
      alert('Profile updated successfully!');
      navigate('/profile');
    } catch (err) {
      console.error(err);
      alert('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="size-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="size-full flex flex-col bg-white">
      <div className="px-4 py-4 flex items-center gap-3 border-b border-gray-100">
        <button onClick={() => navigate(-1)} className="p-1">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="font-bold text-lg">Edit Profile</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-3 relative">
            <Camera className="w-8 h-8 text-gray-400" />
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <Camera className="w-4 h-4 text-white" />
            </button>
          </div>
          <p className="text-sm text-gray-600">Change profile picture</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">FULL NAME</label>
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 pl-12"
              />
              <User className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">EMAIL</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 pl-12"
              />
              <Mail className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">PHONE NUMBER</label>
            <div className="relative">
              <input
                disabled
                type="tel"
                value={phone}
                className="w-full px-4 py-3 bg-gray-50 text-gray-400 rounded-lg focus:outline-none pl-12 border border-gray-100 italic font-medium"
              />
              <Phone className="w-5 h-5 text-gray-300 absolute left-4 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">CITY</label>
              <div className="relative">
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 pl-10 text-sm font-bold"
                  placeholder="e.g. Mumbai"
                />
                <MapPin className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">STATE</label>
              <div className="relative">
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 pl-10 text-sm font-bold"
                  placeholder="e.g. MH"
                />
                <MapPin className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 pb-8">
        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-gray-200 active:scale-95 transition-all disabled:opacity-50"
        >
          {loading ? 'Transmitting...' : 'Update Records'}
        </button>
      </div>
    </div>
  );
}
