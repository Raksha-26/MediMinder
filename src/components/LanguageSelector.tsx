import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage, Language } from '../contexts/LanguageContext';

const languages = [
  { code: 'en' as Language, name: 'English', native: 'English' },
  { code: 'kn' as Language, name: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'hi' as Language, name: 'Hindi', native: 'हिंदी' },
  { code: 'ml' as Language, name: 'Malayalam', native: 'മലയാളം' },
  { code: 'mr' as Language, name: 'Marathi', native: 'मराठी' },
  { code: 'ur' as Language, name: 'Urdu', native: 'اردو' },
  { code: 'tcy' as Language, name: 'Tulu', native: 'ತುಳು' },
  { code: 'ta' as Language, name: 'Tamil', native: 'தமிழ்' },
  { code: 'te' as Language, name: 'Telugu', native: 'తెలుగు' },
];

export default function LanguageSelector() {
  const { currentLanguage, setLanguage } = useLanguage();

  return (
    <div className="relative group">
      <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:text-healthcare-primary transition-colors">
        <Globe className="w-4 h-4" />
        <span>{languages.find(lang => lang.code === currentLanguage)?.native}</span>
      </button>
      
      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        {languages.map((language) => (
          <button
            key={language.code}
            onClick={() => setLanguage(language.code)}
            className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg ${
              currentLanguage === language.code
                ? 'bg-healthcare-primary/10 text-healthcare-primary font-medium'
                : 'text-gray-700'
            }`}
          >
            <div>
              <div className="font-medium">{language.native}</div>
              <div className="text-xs text-gray-500">{language.name}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}