import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useNotifications } from '../contexts/NotificationContext';

interface VoiceAssistantProps {
  onMedicineConfirmed?: () => void;
  context?: 'medicine' | 'general';
}

export default function VoiceAssistant({ onMedicineConfirmed, context = 'general' }: VoiceAssistantProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const { t, currentLanguage } = useLanguage();
  const { addNotification } = useNotifications();

  useEffect(() => {
    if (typeof window !== 'undefined' && 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = getLanguageCode(currentLanguage);
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        setTranscript(transcript);
        handleVoiceCommand(transcript);
      };
      
      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => {
        setIsListening(false);
        addNotification({
          title: 'Voice Recognition Error',
          message: 'Please try again or use manual input',
          type: 'warning'
        });
      };
      
      setRecognition(recognition);
      setIsSupported(true);
    }
  }, [currentLanguage]);

  const getLanguageCode = (lang: string) => {
    const codes = {
      en: 'en-US',
      hi: 'hi-IN',
      kn: 'kn-IN',
      ml: 'ml-IN',
      mr: 'mr-IN'
    };
    return codes[lang] || 'en-US';
  };

  const handleVoiceCommand = (transcript: string) => {
    // Medicine confirmation patterns
    const medicinePatterns = [
      'taken', 'medicine', 'pill', 'tablet', 'dose', 'medication',
      'ಔಷಧಿ', 'ತೆಗೆದುಕೊಂಡಿದ್ದೇನೆ', 'ಮಾತ್ರೆ',
      'दवा', 'ली', 'गोली', 'खुराक',
      'മരുന്ന്', 'എടുത്തു', 'ഗുളിക',
      'औषध', 'घेतले', 'गोळी'
    ];

    const confirmationPatterns = [
      'yes', 'taken', 'done', 'completed', 'finished',
      'ಹೌದು', 'ತೆಗೆದುಕೊಂಡಿದ್ದೇನೆ', 'ಮುಗಿದಿದೆ',
      'हाँ', 'हो गया', 'पूरा',
      'അതെ', 'എടുത്തു', 'തീർന്നു',
      'होय', 'झाले', 'पूर्ण'
    ];

    if (context === 'medicine' && onMedicineConfirmed) {
      const hasMedicineKeyword = medicinePatterns.some(pattern => transcript.includes(pattern));
      const hasConfirmation = confirmationPatterns.some(pattern => transcript.includes(pattern));
      
      if (hasMedicineKeyword || hasConfirmation) {
        onMedicineConfirmed();
        speakResponse('Medicine marked as taken successfully!');
        addNotification({
          title: 'Voice Command Recognized',
          message: 'Medicine has been marked as taken',
          type: 'success'
        });
      }
    }
  };

  const speakResponse = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = getLanguageCode(currentLanguage);
      speechSynthesis.speak(utterance);
    }
  };

  const toggleListening = () => {
    if (!isSupported || !recognition) {
      addNotification({
        title: 'Voice Recognition Not Supported',
        message: 'Please use manual input instead',
        type: 'error'
      });
      return;
    }

    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
  };

  if (!isSupported) {
    return (
      <div className="flex items-center gap-2 text-gray-500 text-sm">
        <MicOff className="w-4 h-4" />
        <span>Voice not supported</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={toggleListening}
        className={`p-3 rounded-full transition-all duration-200 ${
          isListening
            ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
            : 'bg-healthcare-primary hover:bg-healthcare-primary/90 text-white'
        }`}
        title={isListening ? 'Stop Listening' : 'Start Voice Command'}
      >
        {isListening ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
      </button>
      
      {transcript && (
        <div className="flex-1 bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 text-sm">
          <span className="text-gray-600">Heard: </span>
          <span className="font-medium">{transcript}</span>
        </div>
      )}
    </div>
  );
}