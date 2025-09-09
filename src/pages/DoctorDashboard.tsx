import React, { useState } from 'react';
import { 
  Users, 
  Calendar, 
  Clock, 
  Video, 
  MessageSquare,
  Plus,
  CheckCircle,
  X,
  User,
  LogOut,
  Stethoscope,
  Phone
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useNotifications } from '../contexts/NotificationContext';
import LanguageSelector from '../components/LanguageSelector';
import NotificationToast from '../components/NotificationToast';
import DoctorSlotForm from '../components/DoctorSlotForm';
import ChatWindow from '../components/ChatWindow';
import VideoCall from '../components/VideoCall';
import { v4 as uuidv4 } from 'uuid';

interface Patient {
  id: string;
  name: string;
  age: number;
  condition: string;
  lastVisit: string;
  medicineCompliance: number;
  profilePicture?: string;
}

interface TimeSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  available: boolean;
}

interface AppointmentRequest {
  id: string;
  patientName: string;
  date: string;
  time: string;
  reason: string;
  type: 'video' | 'chat';
}

export default function DoctorDashboard() {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const { addNotification } = useNotifications();
  const [activeTab, setActiveTab] = useState<'patients' | 'slots' | 'requests' | 'calls'>('patients');
  const [showSlotForm, setShowSlotForm] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<string>('');

  const [patients] = useState<Patient[]>([
    {
      id: '1',
      name: 'Rajesh Kumar',
      age: 45,
      condition: 'Hypertension',
      lastVisit: '2024-01-10',
      medicineCompliance: 85,
      profilePicture: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    {
      id: '2',
      name: 'Anita Sharma',
      age: 38,
      condition: 'Diabetes',
      lastVisit: '2024-01-12',
      medicineCompliance: 95,
      profilePicture: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    {
      id: '3',
      name: 'Suresh Reddy',
      age: 52,
      condition: 'Heart Disease',
      lastVisit: '2024-01-08',
      medicineCompliance: 78,
      profilePicture: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    }
  ]);

  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([
    {
      id: uuidv4(),
      date: '2024-01-15',
      startTime: '09:00',
      endTime: '09:30',
      available: true
    },
    {
      id: uuidv4(),
      date: '2024-01-15',
      startTime: '10:00',
      endTime: '10:30',
      available: false
    },
    {
      id: uuidv4(),
      date: '2024-01-16',
      startTime: '14:00',
      endTime: '14:30',
      available: true
    }
  ]);

  const [appointmentRequests, setAppointmentRequests] = useState<AppointmentRequest[]>([
    {
      id: uuidv4(),
      patientName: 'Rajesh Kumar',
      date: '2024-01-15',
      time: '14:30',
      reason: 'Follow-up consultation',
      type: 'video'
    },
    {
      id: uuidv4(),
      patientName: 'Meera Patel',
      date: '2024-01-16',
      time: '10:00',
      reason: 'Medicine adjustment',
      type: 'chat'
    }
  ]);

  const handleAppointmentAction = (id: string, action: 'accept' | 'reject') => {
    setAppointmentRequests(prev => prev.filter(req => req.id !== id));
    
    addNotification({
      title: `Appointment ${action}ed`,
      message: `The appointment has been ${action}ed successfully`,
      type: action === 'accept' ? 'success' : 'info'
    });
  };

  const addTimeSlot = (slotData: Omit<TimeSlot, 'id' | 'available'>) => {
    const newSlot: TimeSlot = {
      ...slotData,
      id: uuidv4(),
      available: true
    };
    setTimeSlots(prev => [...prev, newSlot]);
  };

  const startVideoCall = (patientName: string) => {
    setSelectedPatient(patientName);
    setShowVideoCall(true);
    
    // Send notification to patient
    addNotification({
      title: 'Video Call Started',
      message: `Video call invitation sent to ${patientName}`,
      type: 'info'
    });
  };

  const startChat = (patientName: string) => {
    setSelectedPatient(patientName);
    setShowChat(true);
  };

  const renderPatients = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-healthcare-primary">{t('patient_list')}</h3>
        <div className="text-sm text-gray-500">Total Patients: {patients.length}</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {patients.map((patient) => (
          <div key={patient.id} className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:shadow-lg transition-all duration-200">
            <div className="flex items-start gap-4">
              {patient.profilePicture ? (
                <img
                  src={patient.profilePicture}
                  alt={patient.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 bg-healthcare-primary/10 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-healthcare-primary" />
                </div>
              )}
              
              <div className="flex-1">
                <h4 className="font-semibold text-healthcare-primary text-lg">{patient.name}</h4>
                <p className="text-gray-600 mb-1">Age: {patient.age}</p>
                <p className="text-sm text-gray-500 mb-3">{patient.condition}</p>
                
                <div className="space-y-2">
                  <div className="text-xs text-gray-500">
                    Last Visit: {new Date(patient.lastVisit).toLocaleDateString()}
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Medicine Compliance</span>
                      <span>{patient.medicineCompliance}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          patient.medicineCompliance >= 90 
                            ? 'bg-green-500' 
                            : patient.medicineCompliance >= 70 
                            ? 'bg-yellow-500' 
                            : 'bg-red-500'
                        }`}
                        style={{ width: `${patient.medicineCompliance}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <button 
                    onClick={() => startVideoCall(patient.name)}
                    className="flex items-center gap-1 px-3 py-2 bg-healthcare-accent text-white rounded-lg hover:bg-healthcare-accent/90 transition-colors text-sm"
                  >
                    <Video className="w-4 h-4" />
                    Call
                  </button>
                  <button 
                    onClick={() => startChat(patient.name)}
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
    </div>
  );

  const renderSlots = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-healthcare-primary">{t('slot_management')}</h3>
        <button 
          onClick={() => setShowSlotForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-healthcare-primary text-white rounded-lg hover:bg-healthcare-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Slot
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {timeSlots.map((slot) => (
          <div key={slot.id} className={`bg-white/70 backdrop-blur-sm rounded-xl p-6 border transition-all duration-200 hover:shadow-lg ${
            slot.available ? 'border-green-200' : 'border-red-200'
          }`}>
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-healthcare-primary" />
                  <span className="font-medium">{new Date(slot.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">{slot.startTime} - {slot.endTime}</span>
                </div>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                slot.available 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {slot.available ? 'Available' : 'Booked'}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {showSlotForm && (
        <DoctorSlotForm
          onAddSlot={addTimeSlot}
          onClose={() => setShowSlotForm(false)}
        />
      )}
    </div>
  );

  const renderRequests = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-healthcare-primary">{t('incoming_requests')}</h3>
        <div className="text-sm text-gray-500">Pending: {appointmentRequests.length}</div>
      </div>

      <div className="space-y-4">
        {appointmentRequests.map((request) => (
          <div key={request.id} className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:shadow-lg transition-all duration-200">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h4 className="font-semibold text-healthcare-primary text-lg">{request.patientName}</h4>
                <p className="text-gray-600 mb-2">{request.reason}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(request.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {request.time}
                  </div>
                  <div className="flex items-center gap-1">
                    {request.type === 'video' ? <Video className="w-4 h-4" /> : <MessageSquare className="w-4 h-4" />}
                    {request.type}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => handleAppointmentAction(request.id, 'accept')}
                  className="flex items-center gap-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  <CheckCircle className="w-4 h-4" />
                  Accept
                </button>
                <button
                  onClick={() => handleAppointmentAction(request.id, 'reject')}
                  className="flex items-center gap-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                  Reject
                </button>
              </div>
            </div>
          </div>
        ))}

        {appointmentRequests.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No pending appointment requests</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderCalls = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-healthcare-primary">Video Calls & Chat</h3>
      
      <div className="bg-white/70 backdrop-blur-sm rounded-xl p-8 border border-white/20 text-center">
        <Video className="w-24 h-24 text-healthcare-primary mx-auto mb-4" />
        <h4 className="text-xl font-semibold text-healthcare-primary mb-2">Video Call Interface</h4>
        <p className="text-gray-600 mb-6">Start a video consultation with your patients</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto">
          <button 
            onClick={() => startVideoCall('Selected Patient')}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-healthcare-accent text-white rounded-lg hover:bg-healthcare-accent/90 transition-colors"
          >
            <Video className="w-5 h-5" />
            Start Video Call
          </button>
          <button 
            onClick={() => startChat('Selected Patient')}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-healthcare-mustard text-white rounded-lg hover:bg-healthcare-mustard/90 transition-colors"
          >
            <MessageSquare className="w-5 h-5" />
            Open Chat
          </button>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'patients' as const, label: t('patient_list'), icon: Users },
    { id: 'slots' as const, label: t('slot_management'), icon: Clock },
    { id: 'requests' as const, label: t('incoming_requests'), icon: Calendar },
    { id: 'calls' as const, label: 'Video & Chat', icon: Video },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <NotificationToast />
      
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <div className="bg-healthcare-primary/10 p-2 rounded-lg">
                <Stethoscope className="w-6 h-6 text-healthcare-primary" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-healthcare-primary">
                  Welcome, {user?.name}
                </h1>
                <p className="text-sm text-gray-600">Doctor Dashboard</p>
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
          {activeTab === 'patients' && renderPatients()}
          {activeTab === 'slots' && renderSlots()}
          {activeTab === 'requests' && renderRequests()}
          {activeTab === 'calls' && renderCalls()}
        </div>
      </div>

      {/* Chat Window */}
      {showChat && (
        <ChatWindow
          recipientName={selectedPatient}
          recipientId="patient-id"
          onClose={() => setShowChat(false)}
        />
      )}

      {/* Video Call */}
      {showVideoCall && (
        <VideoCall
          isDoctor={true}
          patientName={selectedPatient}
          onEndCall={() => setShowVideoCall(false)}
        />
      )}
    </div>
  );
}