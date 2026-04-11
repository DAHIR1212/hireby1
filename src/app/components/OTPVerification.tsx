import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Edit } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { db } from '../firebase/config';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { API_BASE_URL } from '../api.ts';

export default function OTPVerification() {
  const navigate = useNavigate();
  const location = useLocation();
  const phone = location.state?.phone || '';
  const { setCurrentUser } = useAuth();

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      const newOtp = [...otp];
      newOtp[index - 1] = '';
      setOtp(newOtp);
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = [...otp];
    pasted.split('').forEach((char, i) => { newOtp[i] = char; });
    setOtp(newOtp);
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const loadUserToLocalStorage = (userData: any) => {
    localStorage.setItem('userPhone', phone);
    if (userData.name) localStorage.setItem('userName', userData.name);
    if (userData.role) localStorage.setItem('userRole', userData.role);
    if (userData.photo) localStorage.setItem('userPhoto', userData.photo);
    if (userData.location) localStorage.setItem('userLocation', userData.location);
    if (userData.category) localStorage.setItem('userCategory', userData.category);
    if (userData.skills) localStorage.setItem('userSkills', JSON.stringify(userData.skills));
    if (userData.experience) localStorage.setItem('userExperience', userData.experience);
    if (userData.availability) localStorage.setItem('userAvailability', userData.availability);
    if (userData.hourlyRate) localStorage.setItem('userHourlyRate', userData.hourlyRate);
  };

  const handleVerify = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) return;
    setLoading(true);
    if (otpCode !== '123456') {
      setError('Invalid code. Please use 123456.');
      setLoading(false);
      return;
    }

    try {
      // Skip API verification, just proceed with Firestore logic
      localStorage.setItem('userPhone', phone);

      const userRef = doc(db, 'users', phone);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          phone: `+91${phone}`,
          createdAt: new Date().toISOString(),
          role: null,
          profileComplete: false,
          isOnline: true,
        });
        navigate('/role-selection');
      } else {
        const userData = userSnap.data();
        loadUserToLocalStorage(userData);
        setCurrentUser(userData);

        await setDoc(userRef, {
          isOnline: true,
          lastSeen: new Date().toISOString(),
        }, { merge: true });

        if (!userData.profileComplete) {
          if (!userData.role) {
            navigate('/role-selection');
          } else if (userData.role === 'provider') {
            navigate('/provider-onboarding');
          } else {
            navigate('/profile-setup');
          }
        } else if (userData.role === 'provider') {
          navigate('/provider-dashboard');
        } else {
          navigate('/home');
        }
      }
    } catch (err: any) {
      console.error(err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = () => {
    setOtp(['', '', '', '', '', '']);
    setError('');
    inputRefs.current[0]?.focus();
    alert('A new OTP has been "sent" (Simulated)');
  };

  return (
    <div className="size-full flex flex-col bg-white">
      <div className="px-6 py-6">
        <h1 className="font-bold text-lg">HireBy</h1>
      </div>

      <div className="flex-1 px-6 py-12">
        <h2 className="text-4xl font-bold mb-4">Verify your number</h2>
        <p className="text-gray-600 mb-8">
          Enter the 6-digit code sent to{' '}
          <span className="font-bold">+91 {phone}</span><br />
          <span className="text-blue-600 text-sm font-semibold inline-block mt-2">
            *Demo: Please use 123456 as the OTP
          </span>
        </p>

        <div className="flex gap-3 mb-8">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => { inputRefs.current[index] = el; }}
              type="tel"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className="w-full aspect-square text-center text-3xl font-bold bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          ))}
        </div>

        {error && (
          <p className="text-red-500 text-sm mb-4">{error}</p>
        )}

        <button
          onClick={handleVerify}
          disabled={otp.join('').length !== 6 || loading}
          className={`w-full py-4 rounded-xl font-bold mb-8 transition-colors ${otp.join('').length === 6 && !loading
              ? 'bg-gray-900 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
        >
          {loading ? 'Verifying...' : 'Verify'}
        </button>

        <div className="text-center space-y-6">
          <p className="text-gray-600">
            Didn't receive the code?{' '}
            <button onClick={handleResend} className="text-blue-600 font-bold">
              Resend
            </button>
          </p>
          <div className="w-20 h-1 bg-gray-200 mx-auto rounded-full"></div>
          <button
            onClick={() => navigate('/login')}
            className="flex items-center justify-center gap-2 text-gray-600 mx-auto"
          >
            <Edit className="w-4 h-4" />
            <span>Change phone number</span>
          </button>
        </div>
      </div>
    </div>
  );
}