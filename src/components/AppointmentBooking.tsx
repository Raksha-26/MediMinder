import React, { useState } from 'react';
import { Calendar, Clock, User, X, Video, MessageSquare } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useNotifications } from '../contexts/NotificationContext';

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  profilePicture?: string;
  availableSlots: TimeSlot[];
}

interface TimeSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  available: boolean;
}

interface AppointmentBookingProps {
  onClose: () => void;
  onBookAppointment: (appointment: {
    doctorId: string;
    doctorName: string;
    specialty: string;
    date: string;
    time: string;
    type: 'video' | 'chat';
  }) => void;
}

export default function AppointmentBooking({ onClose, onBookAppointment }: AppointmentBookingProps) {
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [appointmentType, setAppointmentType] = useState<'video' | 'chat'>('video');
  const [reason, setReason] = useState('');
  const { t } = useLanguage();
  const { addNotification } = useNotifications();

  const doctors: Doctor[] = [
    {
      id: '1',
      name: 'Dr. Priya Sharma',
      specialty: 'Cardiology',
      profilePicture: 'https://images.pexels.com/photos/5327921/pexels-photo-5327921.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      availableSlots: [
        { id: '1', date: '2024-01-16', startTime: '09:00', endTime: '09:30', available: true },
        { id: '2', date: '2024-01-16', startTime: '10:00', endTime: '10:30', available: true },
        { id: '3', date: '2024-01-17', startTime: '14:00', endTime: '14:30', available: true },
        { id: '4', date: '2024-01-17', startTime: '15:00', endTime: '15:30', available: true },
      ]
    },
    {
      id: '2',
      name: 'Dr. Rajesh Kumar',
      specialty: 'General Medicine',
      profilePicture: 'https://images.pexels.com/photos/612608/pexels-photo-612608.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      availableSlots: [
        { id: '5', date: '2024-01-16', startTime: '11:00', endTime: '11:30', available: true },
        { id: '6', date: '2024-01-17', startTime: '09:00', endTime: '09:30', available: true },
        { id: '7', date: '2024-01-18', startTime: '16:00', endTime: '16:30', available: true },
      ]
    },
    {
      id: '3',
      name: 'Dr. Anita Patel',
      specialty: 'Dermatology',
      profilePicture: 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      availableSlots: [
        { id: '8', date: '2024-01-16', startTime: '13:00', endTime: '13:30', available: true },
        { id: '9', date: '2024-01-17', startTime: '10:00', endTime: '10:30', available: true },
        { id: '10', date: '2024-01-18', startTime: '11:00', endTime: '11:30', available: true },
      ]
    }
  ];

  const handleBookAppointment = () => {
    if (!selectedDoctor || !selectedSlot) {
      addNotification({
        title: 'Missing Selection',
        message: 'Please select a doctor and time slot',
        type: 'error'
      });
      return;
    }

    onBookAppointment({
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      specialty: selectedDoctor.specialty,
      date: selectedSlot.date,
      time: `${selectedSlot.startTime} - ${selectedSlot.endTime}`,
      type: appointmentType
    });

    addNotification({
      title: 'Appointment Booked',
      message: `Your appointment with ${selectedDoctor.name} has been scheduled`,
      type: 'success'
    });

    onClose();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-semibold text-healthcare-primary">Book Appointment</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Doctor Selection */}
          <div>
            <h4 className="text-lg font-semibold text-healthcare-primary mb-4">Select Doctor</h4>
            <div className="space-y-4">
              {doctors.map((doctor) => (
                <div
                  key={doctor.id}
                  onClick={() => setSelectedDoctor(doctor)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                    selectedDoctor?.id === doctor.id
                      ? 'border-healthcare-primary bg-healthcare-primary/5'
                      : 'border-gray-200 hover:border-healthcare-primary/50'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {doctor.profilePicture ? (
                      <img
                        src={doctor.profilePicture}
                        alt={doctor.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-healthcare-primary/10 rounded-full flex items-center justify-center">
                        <User className="w-8 h-8 text-healthcare-primary" />
                      </div>
                    )}
                    <div>
                      <h5 className="font-semibold text-healthcare-primary">{doctor.name}</h5>
                      <p className="text-gray-600">{doctor.specialty}</p>
                      <p className="text-sm text-gray-500">
                        {doctor.availableSlots.filter(slot => slot.available).length} slots available
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Time Slot Selection */}
          <div>
            <h4 className="text-lg font-semibold text-healthcare-primary mb-4">
              {selectedDoctor ? `Available Slots - ${selectedDoctor.name}` : 'Select a doctor first'}
            </h4>
            
            {selectedDoctor ? (
              <div className="space-y-4">
                {selectedDoctor.availableSlots
                  .filter(slot => slot.available)
                  .reduce((acc, slot) => {
                    const date = slot.date;
                    if (!acc[date]) acc[date] = [];
                    acc[date].push(slot);
                    return acc;
                  }, {} as Record<string, TimeSlot[]>)
                  && Object.entries(
                    selectedDoctor.availableSlots
                      .filter(slot => slot.available)
                      .reduce((acc, slot) => {
                        const date = slot.date;
                        if (!acc[date]) acc[date] = [];
                        acc[date].push(slot);
                        return acc;
                      }, {} as Record<string, TimeSlot[]>)
                  ).map(([date, slots]) => (
                    <div key={date} className="border border-gray-200 rounded-lg p-4">
                      <h6 className="font-medium text-healthcare-primary mb-3 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {formatDate(date)}
                      </h6>
                      <div className="grid grid-cols-2 gap-2">
                        {slots.map((slot) => (
                          <button
                            key={slot.id}
                            onClick={() => setSelectedSlot(slot)}
                            className={`p-3 rounded-lg border transition-all duration-200 ${
                              selectedSlot?.id === slot.id
                                ? 'border-healthcare-primary bg-healthcare-primary text-white'
                                : 'border-gray-300 hover:border-healthcare-primary hover:bg-healthcare-primary/5'
                            }`}
                          >
                            <div className="flex items-center justify-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span className="text-sm font-medium">
                                {slot.startTime} - {slot.endTime}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p>Please select a doctor to view available time slots</p>
              </div>
            )}
          </div>
        </div>

        {/* Appointment Details */}
        {selectedDoctor && selectedSlot && (
          <div className="mt-8 p-6 bg-gray-50 rounded-xl">
            <h4 className="text-lg font-semibold text-healthcare-primary mb-4">Appointment Details</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Appointment Type
                </label>
                <div className="flex gap-4">
                  <button
                    onClick={() => setAppointmentType('video')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                      appointmentType === 'video'
                        ? 'border-healthcare-primary bg-healthcare-primary text-white'
                        : 'border-gray-300 hover:border-healthcare-primary'
                    }`}
                  >
                    <Video className="w-4 h-4" />
                    Video Call
                  </button>
                  <button
                    onClick={() => setAppointmentType('chat')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                      appointmentType === 'chat'
                        ? 'border-healthcare-primary bg-healthcare-primary text-white'
                        : 'border-gray-300 hover:border-healthcare-primary'
                    }`}
                  >
                    <MessageSquare className="w-4 h-4" />
                    Chat Only
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Visit (Optional)
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-healthcare-primary"
                  rows={3}
                  placeholder="Describe your symptoms or reason for the appointment..."
                />
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleBookAppointment}
                className="flex-1 px-6 py-3 bg-healthcare-primary text-white rounded-lg hover:bg-healthcare-primary/90 transition-colors"
              >
                Book Appointment
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}