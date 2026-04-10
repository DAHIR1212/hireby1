import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { Upload, Camera, Clock, ChevronDown, CheckCircle, X } from 'lucide-react';
import Header from './Header';
import { db } from '../firebase/config';
import { doc, setDoc } from 'firebase/firestore';

export default function ProviderOnboarding() {
  const navigate = useNavigate();
  const [category, setCategory] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  // ✅ Document upload
  const [document, setDocument] = useState<string | null>(null);
  const [documentName, setDocumentName] = useState('');
  const documentInputRef = useRef<HTMLInputElement>(null);

  // ✅ Live selfie / photo
  const [photo, setPhoto] = useState<string | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  // ✅ Handle document upload (opens file storage)
  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setDocument(reader.result as string);
        setDocumentName(file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  // ✅ Handle live selfie (opens camera)
  const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleSubmit = async () => {
    if (!category) {
      alert('Please select a service category');
      return;
    }
    if (!name.trim()) {
      alert('Please enter your name');
      return;
    }
    setLoading(true);

    try {
      // Save to localStorage
      localStorage.setItem('userName', name);
      localStorage.setItem('userRole', 'provider');
      localStorage.setItem('userCategory', category);
      if (photo) localStorage.setItem('userPhoto', photo);

      // Save to Firestore
      const phone = localStorage.getItem('userPhone');
      if (phone) {
        await setDoc(doc(db, 'users', phone), {
          phone: `+91${phone}`,
          name,
          role: 'provider',
          category,
          photo: photo || null,
          document: document || null,
          profileComplete: true,
          createdAt: new Date().toISOString(),
        }, { merge: true });
      }

      navigate('/provider-skill-selection');
    } catch (err) {
      console.error(err);
      navigate('/provider-skill-selection');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="size-full flex flex-col bg-white">
      <Header title="HireBy" />

      <div className="flex-1 overflow-y-auto px-6 py-6 pb-32">
        <h2 className="text-3xl font-bold mb-2">Become a Partner</h2>
        <p className="text-gray-600 mb-6">
          Join our network of elite service providers.
        </p>

        <div className="space-y-6">

          {/* Name */}
          <div>
            <label className="block text-xs font-semibold mb-2 text-gray-700">YOUR NAME *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full px-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold mb-2 text-gray-700">SERVICE CATEGORY *</label>
            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 bg-gray-100 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="">Select your expertise</option>
                <option value="cleaning">Cleaning</option>
                <option value="plumbing">Plumbing</option>
                <option value="electrical">Electrical</option>
                <option value="painting">Painting</option>
                <option value="ac-repair">AC Repair</option>
                <option value="carpentry">Carpentry</option>
              </select>
              <ChevronDown className="w-5 h-5 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* ✅ Document Upload - opens file storage */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-start gap-3 mb-3">
              <Upload className="w-5 h-5 text-blue-600 mt-1" />
              <div className="flex-1">
                <p className="font-semibold mb-1">ID Proof</p>
                <p className="text-xs text-gray-600">GOVERNMENT ISSUED ID (Aadhar/PAN/Passport)</p>
              </div>
              {document && (
                <button onClick={() => { setDocument(null); setDocumentName(''); }}>
                  <X className="w-5 h-5 text-red-500" />
                </button>
              )}
            </div>

            {document ? (
              <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg p-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm text-green-700 flex-1 truncate">{documentName}</span>
              </div>
            ) : (
              <button
                onClick={() => documentInputRef.current?.click()}
                className="w-full py-3 bg-white border-2 border-dashed border-gray-300 rounded-lg text-blue-600 font-semibold text-sm hover:border-blue-600"
              >
                + Upload Document
              </button>
            )}

            {/* Hidden input - opens file storage */}
            <input
              ref={documentInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleDocumentUpload}
              className="hidden"
            />
          </div>

          {/* ✅ Live Selfie - opens camera */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-start gap-3 mb-3">
              <Camera className="w-5 h-5 text-blue-600 mt-1" />
              <div className="flex-1">
                <p className="font-semibold mb-1">Profile Photo</p>
                <p className="text-xs text-gray-600">TAKE A LIVE SELFIE</p>
              </div>
              {photo && (
                <button onClick={() => setPhoto(null)}>
                  <X className="w-5 h-5 text-red-500" />
                </button>
              )}
            </div>

            {photo ? (
              <div className="flex items-center gap-3">
                <img
                  src={photo}
                  alt="Selfie"
                  className="w-16 h-16 rounded-full object-cover border-2 border-green-500"
                />
                <div>
                  <p className="text-sm font-semibold text-green-600">✅ Photo captured!</p>
                  <button
                    onClick={() => photoInputRef.current?.click()}
                    className="text-xs text-blue-600 underline"
                  >
                    Retake
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => photoInputRef.current?.click()}
                className="w-full py-3 bg-white border-2 border-dashed border-gray-300 rounded-lg text-blue-600 font-semibold text-sm hover:border-blue-600 flex items-center justify-center gap-2"
              >
                <Camera className="w-5 h-5" />
                Take Selfie
              </button>
            )}

            {/* Hidden input - capture="user" opens front camera */}
            <input
              ref={photoInputRef}
              type="file"
              accept="image/*"
              capture="user"
              onChange={handlePhotoCapture}
              className="hidden"
            />
          </div>

          {/* Verification notice */}
          <div className="bg-blue-50 rounded-xl p-4 flex items-start gap-3">
            <Clock className="w-5 h-5 text-blue-600 mt-1" />
            <div>
              <p className="font-semibold mb-1">Verification process</p>
              <p className="text-sm text-gray-700">
                Verification takes <span className="font-semibold">24-48 hours</span>. You'll be notified once approved.
              </p>
            </div>
          </div>

        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full py-4 rounded-lg font-semibold flex items-center justify-center gap-2 ${loading ? 'bg-gray-300 text-gray-500' : 'bg-gray-900 text-white hover:bg-gray-800'
            }`}
        >
          {loading ? 'Submitting...' : 'Submit Application →'}
        </button>
      </div>
    </div>
  );
}