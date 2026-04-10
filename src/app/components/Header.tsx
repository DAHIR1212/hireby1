import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Globe, ChevronDown } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.tsx';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  showLanguage?: boolean;
  rightContent?: React.ReactNode;
}

export default function Header({ title = "HireBy", showBack = true, showLanguage = false, rightContent }: HeaderProps) {
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  const languages = [
    { code: 'EN' as const, name: 'English' },
    { code: 'HI' as const, name: 'हिंदी' },
    { code: 'GU' as const, name: 'ગુજરાતી' },
  ];

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white relative border-b border-gray-100">
      <div className="flex items-center gap-2">
        {showBack && (
          <button onClick={() => navigate(-1)} className="p-1">
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <h1 className="font-bold text-base">{title}</h1>
      </div>
      {rightContent ? (
        rightContent
      ) : showLanguage && (
        <div className="relative">
          <button
            onClick={() => setShowLanguageMenu(!showLanguageMenu)}
            className="flex items-center gap-1 text-sm text-gray-600 px-2 py-1 rounded-lg hover:bg-gray-100"
          >
            <Globe className="w-4 h-4" />
            <span>{language}</span>
            <ChevronDown className="w-3 h-3" />
          </button>

          {showLanguageMenu && (
            <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg py-2 min-w-[140px] z-50">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code);
                    setShowLanguageMenu(false);
                  }}
                  className={`w-full px-4 py-2 text-left hover:bg-gray-100 ${
                    language === lang.code ? 'bg-blue-50 text-blue-600 font-semibold' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{lang.name}</span>
                    <span className="text-xs text-gray-500">{lang.code}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
