import React, { useEffect, useState } from 'react';
import { Bell, BellOff, Volume2, VolumeX } from 'lucide-react';
import { useNotifications } from '../contexts/NotificationContext';

interface MedicineAlarmProps {
  medicines: Array<{
    id: string;
    name: string;
    time: string;
    taken: boolean;
  }>;
  onAlarmTriggered: (medicineId: string) => void;
}

export default function MedicineAlarm({ medicines, onAlarmTriggered }: MedicineAlarmProps) {
  const [activeAlarms, setActiveAlarms] = useState<Set<string>>(new Set());
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const { addNotification } = useNotifications();

  useEffect(() => {
    // Initialize Web Audio API for alarm sounds that work in silent mode
    const initAudio = async () => {
      try {
        const context = new (window.AudioContext || (window as any).webkitAudioContext)();
        setAudioContext(context);
      } catch (error) {
        console.warn('Web Audio API not supported');
      }
    };

    initAudio();
  }, []);

  useEffect(() => {
    const checkMedicineTime = () => {
      const now = new Date();
      const currentTime = now.toTimeString().slice(0, 5);

      medicines.forEach(medicine => {
        if (medicine.time === currentTime && !medicine.taken && !activeAlarms.has(medicine.id)) {
          triggerAlarm(medicine.id, medicine.name);
        }
      });
    };

    const interval = setInterval(checkMedicineTime, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [medicines, activeAlarms]);

  const triggerAlarm = (medicineId: string, medicineName: string) => {
    setActiveAlarms(prev => new Set(prev).add(medicineId));
    
    // Play enhanced alarm sound using Web Audio API (works even in silent mode)
    playAlarmSound();
    
    // Show browser notification
    showBrowserNotification(medicineName);
    
    // Show in-app notification
    addNotification({
      title: 'Medicine Reminder',
      message: `Time to take ${medicineName}`,
      type: 'warning',
      duration: 0 // Don't auto-dismiss
    });

    // Trigger callback
    onAlarmTriggered(medicineId);

    // Set 10-minute timeout for missed medicine
    setTimeout(() => {
      if (activeAlarms.has(medicineId)) {
        handleMissedMedicine(medicineId, medicineName);
      }
    }, 10 * 60 * 1000); // 10 minutes
  };

  const showBrowserNotification = (medicineName: string) => {
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        const notification = new Notification('Medicine Reminder', {
          body: `Time to take ${medicineName}`,
          icon: '/vite.svg',
          badge: '/vite.svg',
          tag: 'medicine-reminder',
          requireInteraction: true,
          silent: false
        });
        
        // Auto close after 10 minutes
        setTimeout(() => notification.close(), 10 * 60 * 1000);
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            showBrowserNotification(medicineName);
          }
        });
      }
    }
  };

  const playAlarmSound = () => {
    if (!audioContext) return;

    try {
      // Create enhanced alarm sound with multiple tones
      const playTone = (frequency: number, duration: number, delay: number = 0) => {
        setTimeout(() => {
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();

          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);

          oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
          oscillator.type = 'sine';

          gainNode.gain.setValueAtTime(0.4, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + duration);
        }, delay);
      };

      // Play alarm pattern: high-low-high-low
      playTone(800, 0.5, 0);
      playTone(600, 0.5, 600);
      playTone(800, 0.5, 1200);
      playTone(600, 0.5, 1800);

      // Repeat alarm every 30 seconds for 10 minutes
      const alarmInterval = setInterval(() => {
        if (audioContext.state === 'running') {
          playTone(800, 0.5, 0);
          playTone(600, 0.5, 600);
          playTone(800, 0.5, 1200);
          playTone(600, 0.5, 1800);
        }
      }, 30000);

      setTimeout(() => clearInterval(alarmInterval), 10 * 60 * 1000);
    } catch (error) {
      console.warn('Could not play alarm sound:', error);
    }
  };

  const handleMissedMedicine = (medicineId: string, medicineName: string) => {
    // Send enhanced notification to caretaker (simulated)
    addNotification({
      title: 'Missed Medicine Alert',
      message: `Patient missed taking ${medicineName}. Caretaker has been notified via SMS and email.`,
      type: 'error'
    });

    // Simulate caretaker notification (in real app, this would send SMS/email)
    console.log(`🚨 CARETAKER ALERT: Patient missed ${medicineName} at ${new Date().toLocaleTimeString()}`);
    
    // Show browser notification for caretaker alert
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Caretaker Alert', {
        body: `Patient missed taking ${medicineName}`,
        icon: '/vite.svg',
        tag: 'caretaker-alert',
        requireInteraction: true
      });
    }
    
    setActiveAlarms(prev => {
      const newSet = new Set(prev);
      newSet.delete(medicineId);
      return newSet;
    });
  };

  const dismissAlarm = (medicineId: string) => {
    setActiveAlarms(prev => {
      const newSet = new Set(prev);
      newSet.delete(medicineId);
      return newSet;
    });
  };

  return (
    <div className="space-y-2">
      {Array.from(activeAlarms).map(medicineId => {
        const medicine = medicines.find(m => m.id === medicineId);
        if (!medicine) return null;

        return (
          <div key={medicineId} className="bg-red-100 border border-red-300 rounded-lg p-4 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-6 h-6 text-red-600 animate-bounce" />
                <div>
                  <h4 className="font-semibold text-red-800">Medicine Reminder</h4>
                  <p className="text-red-700">Time to take {medicine.name}</p>
                  <p className="text-sm text-red-600">
                    ⏰ You have 10 minutes to confirm or caretaker will be notified
                  </p>
                </div>
              </div>
              <button
                onClick={() => dismissAlarm(medicineId)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}