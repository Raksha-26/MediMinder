import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'kn' | 'hi' | 'ml' | 'mr' | 'ur' | 'tcy' | 'ta' | 'te';

interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Common
    'login': 'Login',
    'logout': 'Logout',
    'dashboard': 'Dashboard',
    'settings': 'Settings',
    'save': 'Save',
    'cancel': 'Cancel',
    'delete': 'Delete',
    'edit': 'Edit',
    'add': 'Add',
    'search': 'Search',
    'loading': 'Loading...',
    
    // Auth
    'email': 'Email',
    'password': 'Password',
    'welcome_back': 'Welcome Back',
    'sign_in': 'Sign in to your account',
    
    // Patient
    'medicine_reminders': 'Medicine Reminders',
    'appointments': 'Appointments',
    'ai_assistant': 'AI Assistant',
    'voice_command': 'Say "I have taken my medicine"',
    'mark_taken': 'Mark as Taken',
    'book_appointment': 'Book Appointment',
    'upcoming_appointments': 'Upcoming Appointments',
    'medicine_history': 'Medicine History',
    'video_call_invitation': 'Video Call Invitation',
    
    // Doctor
    'patient_list': 'Patient List',
    'slot_management': 'Slot Management',
    'incoming_requests': 'Incoming Requests',
    'video_call': 'Video Call',
    
    // Admin
    'user_management': 'User Management',
    'finance_management': 'Finance Management',
    'overview': 'Overview',
    'total_patients': 'Total Patients',
    'total_doctors': 'Total Doctors',
    'total_appointments': 'Total Appointments'
  },
  kn: {
    // Common
    'login': 'ಲಾಗಿನ್',
    'logout': 'ಲಾಗ್ ಔಟ್',
    'dashboard': 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    'settings': 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು',
    'save': 'ಉಳಿಸು',
    'cancel': 'ರದ್ದುಗೊಳಿಸು',
    'delete': 'ಅಳಿಸು',
    'edit': 'ಸಂಪಾದಿಸು',
    'add': 'ಸೇರಿಸು',
    'search': 'ಹುಡುಕು',
    'loading': 'ಲೋಡ್ ಆಗುತ್ತಿದೆ...',
    
    // Auth
    'email': 'ಇಮೇಲ್',
    'password': 'ಪಾಸ್‌ವರ್ಡ್',
    'welcome_back': 'ಮತ್ತೆ ಸ್ವಾಗತ',
    'sign_in': 'ನಿಮ್ಮ ಖಾತೆಗೆ ಸೈನ್ ಇನ್ ಮಾಡಿ',
    
    // Patient
    'medicine_reminders': 'ಔಷಧಿ ಜ್ಞಾಪನೆಗಳು',
    'appointments': 'ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್‌ಗಳು',
    'ai_assistant': 'ಎಐ ಸಹಾಯಕ',
    'voice_command': '"ನಾನು ನನ್ನ ಔಷಧಿ ತೆಗೆದುಕೊಂಡಿದ್ದೇನೆ" ಎಂದು ಹೇಳಿ',
    'mark_taken': 'ತೆಗೆದುಕೊಂಡಿದ್ದೇನೆ ಎಂದು ಗುರುತಿಸಿ',
    'book_appointment': 'ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಬುಕ್ ಮಾಡಿ',
    'upcoming_appointments': 'ಮುಂಬರುವ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್‌ಗಳು',
    'medicine_history': 'ಔಷಧಿ ಇತಿಹಾಸ',
    'video_call_invitation': 'ವೀಡಿಯೋ ಕಾಲ್ ಆಮಂತ್ರಣ',
    
    // Doctor
    'patient_list': 'ರೋಗಿಗಳ ಪಟ್ಟಿ',
    'slot_management': 'ಸ್ಲಾಟ್ ನಿರ್ವಹಣೆ',
    'incoming_requests': 'ಬರುತ್ತಿರುವ ವಿನಂತಿಗಳು',
    'video_call': 'ವೀಡಿಯೋ ಕಾಲ್',
    
    // Admin
    'user_management': 'ಬಳಕೆದಾರ ನಿರ್ವಹಣೆ',
    'finance_management': 'ಹಣಕಾಸು ನಿರ್ವಹಣೆ',
    'overview': 'ಅವಲೋಕನ',
    'total_patients': 'ಒಟ್ಟು ರೋಗಿಗಳು',
    'total_doctors': 'ಒಟ್ಟು ವೈದ್ಯರು',
    'total_appointments': 'ಒಟ್ಟು ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್‌ಗಳು'
  },
  hi: {
    // Common
    'login': 'लॉगिन',
    'logout': 'लॉग आउट',
    'dashboard': 'डैशबोर्ड',
    'settings': 'सेटिंग्स',
    'save': 'सेव करें',
    'cancel': 'रद्द करें',
    'delete': 'हटाएं',
    'edit': 'संपादित करें',
    'add': 'जोड़ें',
    'search': 'खोजें',
    'loading': 'लोड हो रहा है...',
    
    // Auth
    'email': 'ईमेल',
    'password': 'पासवर्ड',
    'welcome_back': 'वापस स्वागत है',
    'sign_in': 'अपने खाते में साइन इन करें',
    
    // Patient
    'medicine_reminders': 'दवा रिमाइंडर',
    'appointments': 'अपॉइंटमेंट्स',
    'ai_assistant': 'एआई सहायक',
    'voice_command': '"मैंने अपनी दवा ली है" कहें',
    'mark_taken': 'लिया गया मार्क करें',
    'book_appointment': 'अपॉइंटमेंट बुक करें',
    'upcoming_appointments': 'आगामी अपॉइंटमेंट्स',
    'medicine_history': 'दवा का इतिहास',
    'video_call_invitation': 'वीडियो कॉल आमंत्रण',
    
    // Doctor
    'patient_list': 'मरीज़ों की सूची',
    'slot_management': 'स्लॉट प्रबंधन',
    'incoming_requests': 'आने वाले अनुरोध',
    'video_call': 'वीडियो कॉल',
    
    // Admin
    'user_management': 'उपयोगकर्ता प्रबंधन',
    'finance_management': 'वित्त प्रबंधन',
    'overview': 'अवलोकन',
    'total_patients': 'कुल मरीज़',
    'total_doctors': 'कुल डॉक्टर',
    'total_appointments': 'कुल अपॉइंटमेंट्स'
  },
  ml: {
    // Common
    'login': 'ലോഗിൻ',
    'logout': 'ലോഗ് ഔട്ട്',
    'dashboard': 'ഡാഷ്‌ബോർഡ്',
    'settings': 'സെറ്റിംഗ്‌സ്',
    'save': 'സേവ് ചെയ്യുക',
    'cancel': 'റദ്ദാക്കുക',
    'delete': 'ഡിലീറ്റ് ചെയ്യുക',
    'edit': 'എഡിറ്റ് ചെയ്യുക',
    'add': 'ചേർക്കുക',
    'search': 'തിരയുക',
    'loading': 'ലോഡ് ചെയ്യുന്നു...',
    
    // Auth
    'email': 'ഇമെയിൽ',
    'password': 'പാസ്‌വേഡ്',
    'welcome_back': 'തിരികെ സ്വാഗതം',
    'sign_in': 'നിങ്ങളുടെ അക്കൗണ്ടിൽ സൈൻ ഇൻ ചെയ്യുക',
    
    // Patient
    'medicine_reminders': 'മരുന്ന് റിമൈൻഡറുകൾ',
    'appointments': 'അപ്പോയിന്റ്മെന്റുകൾ',
    'ai_assistant': 'എഐ അസിസ്റ്റന്റ്',
    'voice_command': '"ഞാൻ എന്റെ മരുന്ന് എടുത്തു" എന്ന് പറയുക',
    'mark_taken': 'എടുത്തു എന്ന് അടയാളപ്പെടുത്തുക',
    'book_appointment': 'അപ്പോയിന്റ്മെന്റ് ബുക്ക് ചെയ്യുക',
    'upcoming_appointments': 'വരാനിരിക്കുന്ന അപ്പോയിന്റ്മെന്റുകൾ',
    'medicine_history': 'മരുന്നിന്റെ ചരിത്രം',
    'video_call_invitation': 'വീഡിയോ കോൾ ക്ഷണം'
  },
  mr: {
    // Common
    'login': 'लॉगिन',
    'logout': 'लॉग आउट',
    'dashboard': 'डॅशबोर्ड',
    'settings': 'सेटिंग्स',
    'save': 'जतन करा',
    'cancel': 'रद्द करा',
    'delete': 'हटवा',
    'edit': 'संपादित करा',
    'add': 'जोडा',
    'search': 'शोधा',
    'loading': 'लोड होत आहे...',
    
    // Auth
    'email': 'ईमेल',
    'password': 'पासवर्ड',
    'welcome_back': 'पुन्हा स्वागत',
    'sign_in': 'तुमच्या खात्यात साइन इन करा',
    
    // Patient
    'medicine_reminders': 'औषध स्मरणपत्र',
    'appointments': 'भेटी',
    'ai_assistant': 'एआय सहाय्यक',
    'voice_command': '"मी माझे औषध घेतले आहे" म्हणा',
    'mark_taken': 'घेतले म्हणून चिन्हांकित करा',
    'book_appointment': 'भेट बुक करा',
    'upcoming_appointments': 'येणाऱ्या भेटी',
    'medicine_history': 'औषधाचा इतिहास',
    'video_call_invitation': 'व्हिडिओ कॉल आमंत्रण'
  },
  ur: {
    // Common
    'login': 'لاگ ان',
    'logout': 'لاگ آؤٹ',
    'dashboard': 'ڈیش بورڈ',
    'settings': 'سیٹنگز',
    'save': 'محفوظ کریں',
    'cancel': 'منسوخ کریں',
    'delete': 'حذف کریں',
    'edit': 'ترمیم کریں',
    'add': 'شامل کریں',
    'search': 'تلاش کریں',
    'loading': 'لوڈ ہو رہا ہے...',
    
    // Auth
    'email': 'ای میل',
    'password': 'پاس ورڈ',
    'welcome_back': 'واپس خوش آمدید',
    'sign_in': 'اپنے اکاؤنٹ میں سائن ان کریں',
    
    // Patient
    'medicine_reminders': 'دوا کی یاد دہانی',
    'appointments': 'ملاقاتیں',
    'ai_assistant': 'اے آئی اسسٹنٹ',
    'voice_command': '"میں نے اپنی دوا لی ہے" کہیں',
    'mark_taken': 'لیا گیا نشان لگائیں',
    'book_appointment': 'ملاقات بک کریں',
    'upcoming_appointments': 'آنے والی ملاقاتیں',
    'medicine_history': 'دوا کی تاریخ',
    'video_call_invitation': 'ویڈیو کال کی دعوت'
  },
  tcy: {
    // Common (Tulu)
    'login': 'ಲಾಗಿನ್',
    'logout': 'ಲಾಗ್ ಔಟ್',
    'dashboard': 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    'settings': 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು',
    'save': 'ಉಳಿಸು',
    'cancel': 'ರದ್ದುಗೊಳಿಸು',
    'delete': 'ಅಳಿಸು',
    'edit': 'ಸಂಪಾದಿಸು',
    'add': 'ಸೇರಿಸು',
    'search': 'ಹುಡುಕು',
    'loading': 'ಲೋಡ್ ಆಗುತ್ತಿದೆ...',
    
    // Patient
    'medicine_reminders': 'ಔಷಧಿ ಜ್ಞಾಪನೆಗಳು',
    'appointments': 'ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್‌ಗಳು',
    'ai_assistant': 'ಎಐ ಸಹಾಯಕ',
    'voice_command': '"ನಾನು ನನ್ನ ಔಷಧಿ ತೆಗೆದುಕೊಂಡಿದ್ದೇನೆ" ಎಂದು ಹೇಳಿ',
    'mark_taken': 'ತೆಗೆದುಕೊಂಡಿದ್ದೇನೆ ಎಂದು ಗುರುತಿಸಿ',
    'book_appointment': 'ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಬುಕ್ ಮಾಡಿ',
    'upcoming_appointments': 'ಮುಂಬರುವ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್‌ಗಳು',
    'medicine_history': 'ಔಷಧಿ ಇತಿಹಾಸ',
    'video_call_invitation': 'ವೀಡಿಯೋ ಕಾಲ್ ಆಮಂತ್ರಣ'
  },
  ta: {
    // Common (Tamil)
    'login': 'உள்நுழைவு',
    'logout': 'வெளியேறு',
    'dashboard': 'டாஷ்போர்டு',
    'settings': 'அமைப்புகள்',
    'save': 'சேமி',
    'cancel': 'ரத்து செய்',
    'delete': 'நீக்கு',
    'edit': 'திருத்து',
    'add': 'சேர்',
    'search': 'தேடு',
    'loading': 'ஏற்றுகிறது...',
    
    // Patient
    'medicine_reminders': 'மருந்து நினைவூட்டல்கள்',
    'appointments': 'சந்திப்புகள்',
    'ai_assistant': 'AI உதவியாளர்',
    'voice_command': '"நான் என் மருந்தை எடுத்துக்கொண்டேன்" என்று சொல்லுங்கள்',
    'mark_taken': 'எடுத்துக்கொண்டதாக குறிக்கவும்',
    'book_appointment': 'சந்திப்பு முன்பதிவு',
    'upcoming_appointments': 'வரவிருக்கும் சந்திப்புகள்',
    'medicine_history': 'மருந்து வரலாறு',
    'video_call_invitation': 'வீடியோ அழைப்பு அழைப்பிதழ்'
  },
  te: {
    // Common (Telugu)
    'login': 'లాగిన్',
    'logout': 'లాగ్ అవుట్',
    'dashboard': 'డాష్‌బోర్డ్',
    'settings': 'సెట్టింగులు',
    'save': 'సేవ్ చేయండి',
    'cancel': 'రద్దు చేయండి',
    'delete': 'తొలగించండి',
    'edit': 'సవరించండి',
    'add': 'జోడించండి',
    'search': 'వెతకండి',
    'loading': 'లోడ్ అవుతోంది...',
    
    // Patient
    'medicine_reminders': 'మందుల రిమైండర్లు',
    'appointments': 'అపాయింట్‌మెంట్లు',
    'ai_assistant': 'AI అసిస్టెంట్',
    'voice_command': '"నేను నా మందు తీసుకున్నాను" అని చెప్పండి',
    'mark_taken': 'తీసుకున్నట్లు గుర్తించండి',
    'book_appointment': 'అపాయింట్‌మెంట్ బుక్ చేయండి',
    'upcoming_appointments': 'రాబోయే అపాయింట్‌మెంట్లు',
    'medicine_history': 'మందుల చరిత్ర',
    'video_call_invitation': 'వీడియో కాల్ ఆహ్వానం'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');

  const setLanguage = (language: Language) => {
    setCurrentLanguage(language);
    localStorage.setItem('preferredLanguage', language);
  };

  const t = (key: string): string => {
    return translations[currentLanguage]?.[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}