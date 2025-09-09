import React, { useState } from 'react';
import { Plus, X, Calendar, Clock } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useNotifications } from '../contexts/NotificationContext';

interface TimeSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  available: boolean;
}

interface DoctorSlotFormProps {
  onAddSlot: (slot: Omit<TimeSlot, 'id' | 'available'>) => void;
  onClose: () => void;
}

export default function DoctorSlotForm({ onAddSlot, onClose }: DoctorSlotFormProps) {
  const [formData, setFormData] = useState({
    date: '',
    startTime: '',
    endTime: ''
  });
  const [multipleSlots, setMultipleSlots] = useState(false);
  const [slotDuration, setSlotDuration] = useState(30); // minutes
  const { t } = useLanguage();
  const { addNotification } = useNotifications();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.date || !formData.startTime || !formData.endTime) {
      addNotification({
        title: 'Missing Information',
        message: 'Please fill in all required fields',
        type: 'error'
      });
      return;
    }

    if (formData.startTime >= formData.endTime) {
      addNotification({
        title: 'Invalid Time Range',
        message: 'End time must be after start time',
        type: 'error'
      });
      return;
    }

    if (multipleSlots) {
      generateMultipleSlots();
    } else {
      onAddSlot({
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime
      });
    }

    addNotification({
      title: 'Slot(s) Added',
      message: multipleSlots ? 'Multiple slots have been created' : 'Time slot has been added',
      type: 'success'
    });

    onClose();
  };

  const generateMultipleSlots = () => {
    const startTime = new Date(`2000-01-01T${formData.startTime}:00`);
    const endTime = new Date(`2000-01-01T${formData.endTime}:00`);
    const duration = slotDuration * 60 * 1000; // Convert to milliseconds

    let currentTime = new Date(startTime);
    
    while (currentTime < endTime) {
      const slotEndTime = new Date(currentTime.getTime() + duration);
      
      if (slotEndTime <= endTime) {
        onAddSlot({
          date: formData.date,
          startTime: currentTime.toTimeString().slice(0, 5),
          endTime: slotEndTime.toTimeString().slice(0, 5)
        });
      }
      
      currentTime = new Date(slotEndTime);
    }
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-healthcare-primary">Add Time Slot</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date *
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                min={getTomorrowDate()}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-healthcare-primary"
                required
              />
            </div>
          </div>

          {/* Time Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Time *
              </label>
              <div className="space-y-2">
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-healthcare-primary"
                    required
                  />
                </div>
                {formData.startTime && (
                  <p className="text-xs text-gray-500">
                    {formatTimeTo12Hour(formData.startTime)}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Time *
              </label>
              <div className="space-y-2">
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-healthcare-primary"
                    required
                  />
                </div>
                {formData.endTime && (
                  <p className="text-xs text-gray-500">
                    {formatTimeTo12Hour(formData.endTime)}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Time Range Display */}
          {formData.startTime && formData.endTime && (
            <div className="bg-healthcare-primary/5 rounded-lg p-3">
              <p className="text-sm text-healthcare-primary font-medium">
                📅 Slot Duration: {formatTimeTo12Hour(formData.startTime)} - {formatTimeTo12Hour(formData.endTime)}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Total duration: {calculateDuration(formData.startTime, formData.endTime)} minutes
              </p>
            </div>
          )}

          {/* Multiple Slots Option */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="multipleSlots"
                checked={multipleSlots}
                onChange={(e) => setMultipleSlots(e.target.checked)}
                className="w-4 h-4 text-healthcare-primary border-gray-300 rounded focus:ring-healthcare-primary"
              />
              <label htmlFor="multipleSlots" className="text-sm font-medium text-gray-700">
                Create multiple slots automatically
              </label>
            </div>

            {multipleSlots && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slot Duration (minutes)
                </label>
                <select
                  value={slotDuration}
                  onChange={(e) => setSlotDuration(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-healthcare-primary"
                >
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={45}>45 minutes</option>
                  <option value={60}>60 minutes</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  This will create multiple {slotDuration}-minute slots between your start and end time
                </p>
                {formData.startTime && formData.endTime && (
                  <p className="text-xs text-healthcare-primary mt-1 font-medium">
                    Will create approximately {Math.floor(calculateDuration(formData.startTime, formData.endTime) / slotDuration)} slots
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-healthcare-primary text-white rounded-lg hover:bg-healthcare-primary/90 transition-colors"
            >
              {multipleSlots ? 'Create Slots' : 'Add Slot'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  // Helper function to format time to 12-hour format
  function formatTimeTo12Hour(time24: string) {
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  }

  // Helper function to calculate duration between two times
  function calculateDuration(startTime: string, endTime: string) {
    const start = new Date(`2000-01-01T${startTime}:00`);
    const end = new Date(`2000-01-01T${endTime}:00`);
    return Math.abs(end.getTime() - start.getTime()) / (1000 * 60); // Return minutes
  }
}
                <input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-healthcare-primary"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Time *
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-healthcare-primary"
                  required
                />
              </div>
            </div>
          </div>

          {/* Multiple Slots Option */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="multipleSlots"
                checked={multipleSlots}
                onChange={(e) => setMultipleSlots(e.target.checked)}
                className="w-4 h-4 text-healthcare-primary border-gray-300 rounded focus:ring-healthcare-primary"
              />
              <label htmlFor="multipleSlots" className="text-sm font-medium text-gray-700">
                Create multiple slots automatically
              </label>
            </div>

            {multipleSlots && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slot Duration (minutes)
                </label>
                <select
                  value={slotDuration}
                  onChange={(e) => setSlotDuration(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-healthcare-primary"
                >
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={45}>45 minutes</option>
                  <option value={60}>60 minutes</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  This will create multiple {slotDuration}-minute slots between your start and end time
                </p>
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-healthcare-primary text-white rounded-lg hover:bg-healthcare-primary/90 transition-colors"
            >
              {multipleSlots ? 'Create Slots' : 'Add Slot'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}