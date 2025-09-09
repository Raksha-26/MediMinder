import React, { useState, useEffect } from 'react';
import { 
  Pill, 
  Calendar, 
  MessageSquare, 
  Video, 
  Clock, 
  CheckCircle, 
  Plus,
  History,
  Bot,
  Phone,
  User,
  LogOut,
  Image
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useNotifications } from '../contexts/NotificationContext';
import LanguageSelector from '../components/LanguageSelector';
import VoiceAssistant from '../components/VoiceAssistant';
import NotificationToast from '../components/NotificationToast';
import MedicineAlarm from '../components/MedicineAlarm';
import MedicineForm from '../components/MedicineForm';
import AppointmentBooking from '../components/AppointmentBooking';
import ChatWindow from '../components/ChatWindow';
import VideoCall from '../components/VideoCall';
import { v4 as uuidv4 } from 'uuid';

interface Medicine {
  id: string;
  name: string;
  dosage: string;
  time: string;
  taken: boolean;
  frequency: string;
  image?: string;
  alarmTriggered?: boolean;
  confirmationDeadline?: Date;
}

interface Appointment {
  id: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  type: 'video' | 'chat';
}

export default function PatientDashboard() {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const { addNotification } = useNotifications();
  const [activeTab, setActiveTab] = useState<'medicines' | 'appointments' | 'ai-assistant' | 'history'>('medicines');
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{type: 'user' | 'bot', message: string}>>([]);
  const [showMedicineForm, setShowMedicineForm] = useState(false);
  const [showAppointmentBooking, setShowAppointmentBooking] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<string>('');

  const [medicines, setMedicines] = useState<Medicine[]>([
    {
      id: uuidv4(),
      name: 'Paracetamol',
      dosage: '500mg',
      time: '08:00',
      taken: false,
      frequency: 'Twice daily'
    },
    {
      id: uuidv4(),
      name: 'Vitamin D3',
      dosage: '1000 IU',
      time: '12:00',
      taken: true,
      frequency: 'Once daily'
    },
    {
      id: uuidv4(),
      name: 'Omega-3',
      dosage: '1000mg',
      time: '20:00',
      taken: false,
      frequency: 'Once daily'
    }
  ]);

  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: '1',
      doctorName: 'Dr. Priya Sharma',
      specialty: 'Cardiology',
      date: '2024-01-15',
      time: '14:30',
      status: 'scheduled',
      type: 'video'
    },
    {
      id: '2',
      doctorName: 'Dr. Rajesh Kumar',
      specialty: 'General Medicine',
      date: '2024-01-18',
      time: '10:00',
      status: 'scheduled',
      type: 'chat'
    }
  ]);

  // Auto-reminder notifications
  useEffect(() => {
    // Check for expired confirmation deadlines
    const checkExpiredConfirmations = () => {
      const now = new Date();
      setMedicines(prev => prev.map(medicine => {
        if (medicine.confirmationDeadline && now > medicine.confirmationDeadline && !medicine.taken) {
          // Send caretaker notification
          addNotification({
            title: 'Missed Medicine Alert',
            message: `Patient missed taking ${medicine.name}. Caretaker has been notified.`,
            type: 'error'
          });
          
          return { ...medicine, confirmationDeadline: undefined, alarmTriggered: false };
        }
        return medicine;
      }));
    };

    const interval = setInterval(checkExpiredConfirmations, 30000);
    return () => clearInterval(interval);
  }, [medicines, addNotification]);

  const handleAlarmTriggered = (medicineId: string) => {
    const deadline = new Date();
    deadline.setMinutes(deadline.getMinutes() + 10); // 10 minutes from now
    
    setMedicines(prev => prev.map(medicine => 
      medicine.id === medicineId 
        ? { ...medicine, alarmTriggered: true, confirmationDeadline: deadline }
        : medicine
    ));
  };

  const markMedicineAsTaken = (id: string) => {
    setMedicines(prev => 
      prev.map(med => 
        med.id === id ? { 
          ...med, 
          taken: true, 
          alarmTriggered: false, 
          confirmationDeadline: undefined 
        } : med
      )
    );
    
    addNotification({
      title: 'Medicine Confirmed',
      message: 'Medicine has been marked as taken',
      type: 'success'
    });
  };

  const addMedicine = (medicineData: Omit<Medicine, 'id' | 'taken'>) => {
    const newMedicine: Medicine = {
      ...medicineData,
      id: uuidv4(),
      taken: false
    };
    setMedicines(prev => [...prev, newMedicine]);
  };

  const bookAppointment = (appointmentData: any) => {
    const newAppointment: Appointment = {
      id: uuidv4(),
      doctorName: appointmentData.doctorName,
      specialty: appointmentData.specialty,
      date: appointmentData.date,
      time: appointmentData.time,
      status: 'scheduled',
      type: appointmentData.type
    };
    setAppointments(prev => [...prev, newAppointment]);
  };

  const startVideoCall = (doctorName: string) => {
    setSelectedDoctor(doctorName);
    setShowVideoCall(true);
    
    // Simulate doctor invitation notification
    addNotification({
      title: 'Video Call Invitation',
      message: `${doctorName} has invited you to a video call`,
      type: 'info'
    });
  };

  const startChat = (doctorName: string) => {
    setSelectedDoctor(doctorName);
    setShowChat(true);
  };

  const handleAIChat = (message: string) => {
    if (!message.trim()) return;

    setChatHistory(prev => [...prev, { type: 'user', message }]);
    setChatMessage('');

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "I understand you need help with your medication. Please tell me more about your concerns.",
        "Based on your medication schedule, everything looks on track. Remember to take your medicines on time.",
        "I can help you with appointment booking. Would you like to schedule a consultation?",
        "For any medical emergencies, please contact your doctor immediately or call emergency services.",
        "Your health data shows good compliance. Keep up the great work!"
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      setChatHistory(prev => [...prev, { type: 'bot', message: randomResponse }]);
    }, 1000);
  };

  const renderMedicines = () => (
    <div className="space-y-6">
      <MedicineAlarm 
        medicines={medicines}
        onAlarmTriggered={handleAlarmTriggered}
      />
      
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-healthcare-primary">{t('medicine_reminders')}</h3>
        <button 
          onClick={() => setShowMedicineForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-healthcare-primary text-white rounded-lg hover:bg-healthcare-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          {t('add')}
        </button>
      </div>

      <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/20">
        <VoiceAssistant 
          context="medicine" 
          onMedicineConfirmed={() => {
            const nextUntaken = medicines.find(m => !m.taken);
            if (nextUntaken) markMedicineAsTaken(nextUntaken.id);
          }} 
        />
        <p className="text-sm text-gray-600 mt-2">{t('voice_command')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {medicines.map((medicine) => (
          <div key={medicine.id} className={`bg-white/70 backdrop-blur-sm rounded-xl p-6 border transition-all duration-200 hover:shadow-lg ${
            medicine.taken 
              ? 'border-green-200 bg-green-50/70' 
              : medicine.alarmTriggered 
              ? 'border-red-300 bg-red-50/70 animate-pulse' 
              : 'border-white/20'
          }`}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                {medicine.image && (
                  <div className="mb-3">
                    <img
                      src={medicine.image}
                      alt={medicine.name}
                      className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                    />
                  </div>
                )}
                <h4 className="font-semibold text-healthcare-primary text-lg">{medicine.name}</h4>
                <p className="text-gray-600">{medicine.dosage}</p>
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    {medicine.time}
                  </div>
                  <span className="text-sm text-gray-500">{medicine.frequency}</span>
                </div>
                {medicine.alarmTriggered && medicine.confirmationDeadline && (
                  <div className="mt-2 text-xs text-red-600">
                    Confirm within: {Math.max(0, Math.floor((medicine.confirmationDeadline.getTime() - Date.now()) / 60000))} minutes
                  </div>
                )}
              </div>
              <div className="flex flex-col items-center gap-2">
                {medicine.taken ? (
                  <CheckCircle className="w-8 h-8 text-green-500" />
                ) : (
                  <button
                    onClick={() => markMedicineAsTaken(medicine.id)}
                    className={`px-4 py-2 text-white rounded-lg transition-colors text-sm font-medium ${
                      medicine.alarmTriggered 
                        ? 'bg-red-500 hover:bg-red-600 animate-bounce' 
                        : 'bg-healthcare-mustard hover:bg-healthcare-mustard/90'
                    }`}
                  >
                    {t('mark_taken')}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {showMedicineForm && (
        <MedicineForm
          onAddMedicine={addMedicine}
          onClose={() => setShowMedicineForm(false)}
        />
      )}
    </div>
  );

  const renderAppointments = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-healthcare-primary">{t('upcoming_appointments')}</h3>
        <button 
          onClick={() => setShowAppointmentBooking(true)}
          className="flex items-center gap-2 px-4 py-2 bg-healthcare-primary text-white rounded-lg hover:bg-healthcare-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          {t('book_appointment')}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {appointments.map((appointment) => (
          <div key={appointment.id} className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:shadow-lg transition-all duration-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-semibold text-healthcare-primary text-lg">{appointment.doctorName}</h4>
                <p className="text-gray-600 mb-3">{appointment.specialty}</p>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    {new Date(appointment.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    {appointment.time}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => startVideoCall(appointment.doctorName)}
                    className="flex items-center gap-1 px-3 py-2 bg-healthcare-accent text-white rounded-lg hover:bg-healthcare-accent/90 transition-colors text-sm"
                  >
                    <Video className="w-4 h-4" />
                    {t('video_call')}
                  </button>
                  <button 
                    onClick={() => startChat(appointment.doctorName)}
                    className="flex items-center gap-1 px-3 py-2 bg-healthcare-mustard text-white rounded-lg hover:bg-healthcare-mustard/90 transition-colors text-sm"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Chat
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {showAppointmentBooking && (
        <AppointmentBooking
          onBookAppointment={bookAppointment}
          onClose={() => setShowAppointmentBooking(false)}
        />
      )}
    </div>
  );

  const renderAIAssistant = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-healthcare-primary">{t('ai_assistant')}</h3>
      
      <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-white/20 h-96 flex flex-col">
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {chatHistory.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              <Bot className="w-12 h-12 mx-auto mb-4 text-healthcare-primary" />
              <p>Hi! I'm your AI health assistant. How can I help you today?</p>
            </div>
          )}
          {chatHistory.map((chat, index) => (
            <div key={index} className={`flex ${chat.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                chat.type === 'user' 
                  ? 'bg-healthcare-primary text-white' 
                  : 'bg-gray-200 text-gray-800'
              }`}>
                {chat.message}
              </div>
            </div>
          ))}
        </div>
        
        <div className="border-t border-gray-200 p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAIChat(chatMessage)}
              placeholder="Type your message..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-healthcare-primary"
            />
            <button
              onClick={() => handleAIChat(chatMessage)}
              className="px-4 py-2 bg-healthcare-primary text-white rounded-lg hover:bg-healthcare-primary/90 transition-colors"
            >
              Send
            </button>
          </div>
        </div>
      </div>

      {/* Chat Window */}
      {showChat && (
        <ChatWindow
          recipientName={selectedDoctor}
          recipientId="doctor-id"
          onClose={() => setShowChat(false)}
        />
      )}

      {/* Video Call */}
      {showVideoCall && (
        <VideoCall
          isDoctor={false}
          doctorName={selectedDoctor}
          onEndCall={() => setShowVideoCall(false)}
        />
      )}
    </div>
  );

  const renderHistory = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-healthcare-primary">{t('medicine_history')}</h3>
      
      <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20">
        <div className="space-y-4">
          {medicines.filter(m => m.taken).map((medicine, index) => (
            <div key={index} className="flex items-center justify-between py-3 border-b border-gray-200 last:border-0">
              <div>
                <h4 className="font-medium text-healthcare-primary">{medicine.name}</h4>
                <p className="text-sm text-gray-600">{medicine.dosage} at {medicine.time}</p>
              </div>
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
          ))}
          
          {medicines.filter(m => m.taken).length === 0 && (
            <p className="text-gray-500 text-center py-8">No medicine history yet</p>
          )}
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'medicines' as const, label: t('medicine_reminders'), icon: Pill },
    { id: 'appointments' as const, label: t('appointments'), icon: Calendar },
    { id: 'ai-assistant' as const, label: t('ai_assistant'), icon: Bot },
    { id: 'history' as const, label: 'History', icon: History },
  ];

  // Helper function to format time to 12-hour format
  const formatTimeTo12Hour = (time24: string) => {
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <NotificationToast />
      
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <div className="bg-healthcare-primary/10 p-2 rounded-lg">
                <User className="w-6 h-6 text-healthcare-primary" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-healthcare-primary">
                  Welcome, {user?.name}
                </h1>
                <p className="text-sm text-gray-600">Patient Dashboard</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <LanguageSelector />
              <button
                onClick={logout}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-healthcare-primary transition-colors"
              >
                <LogOut className="w-4 h-4" />
                {t('logout')}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-white/20 p-2 mb-8">
          <nav className="flex space-x-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-healthcare-primary text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="transition-all duration-300">
          {activeTab === 'medicines' && renderMedicines()}
          {activeTab === 'appointments' && renderAppointments()}
          {activeTab === 'ai-assistant' && renderAIAssistant()}
          {activeTab === 'history' && renderHistory()}
        </div>
      </div>
    </div>
  );
}