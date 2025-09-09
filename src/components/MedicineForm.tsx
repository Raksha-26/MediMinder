import React, { useState } from 'react';
import { Plus, Upload, X, Clock, Pill } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useNotifications } from '../contexts/NotificationContext';

interface Medicine {
  id: string;
  name: string;
  dosage: string;
  time: string;
  frequency: string;
  image?: string;
  taken: boolean;
}

interface MedicineFormProps {
  onAddMedicine: (medicine: Omit<Medicine, 'id' | 'taken'>) => void;
  onClose: () => void;
}

export default function MedicineForm({ onAddMedicine, onClose }: MedicineFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    time: '',
    frequency: 'Once daily'
  });
  const [medicineImage, setMedicineImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { t } = useLanguage();
  const { addNotification } = useNotifications();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        addNotification({
          title: 'File Too Large',
          message: 'Please select an image smaller than 5MB',
          type: 'error'
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setMedicineImage(e.target?.result as string);
        setImageFile(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.dosage || !formData.time) {
      addNotification({
        title: 'Missing Information',
        message: 'Please fill in all required fields',
        type: 'error'
      });
      return;
    }

    onAddMedicine({
      ...formData,
      image: medicineImage || undefined
    });

    addNotification({
      title: 'Medicine Added',
      message: `${formData.name} has been added to your reminders`,
      type: 'success'
    });

    onClose();
  };

  const frequencyOptions = [
    'Once daily',
    'Twice daily',
    'Three times daily',
    'Four times daily',
    'Every 6 hours',
    'Every 8 hours',
    'Every 12 hours',
    'As needed'
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-healthcare-primary">Add New Medicine</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Medicine Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Medicine Image (Optional)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-healthcare-primary transition-colors">
              {medicineImage ? (
                <div className="relative">
                  <img
                    src={medicineImage}
                    alt="Medicine"
                    className="w-32 h-32 object-cover rounded-lg mx-auto mb-2"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setMedicineImage(null);
                      setImageFile(null);
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div>
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 mb-2">Upload medicine image</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="medicine-image"
                  />
                  <label
                    htmlFor="medicine-image"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-healthcare-primary text-white rounded-lg hover:bg-healthcare-primary/90 transition-colors cursor-pointer"
                  >
                    <Upload className="w-4 h-4" />
                    Choose Image
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Medicine Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Medicine Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-healthcare-primary"
              placeholder="Enter medicine name"
              required
            />
          </div>

          {/* Dosage */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dosage *
            </label>
            <input
              type="text"
              value={formData.dosage}
              onChange={(e) => setFormData(prev => ({ ...prev, dosage: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-healthcare-primary"
              placeholder="e.g., 500mg, 1 tablet"
              required
            />
          </div>

          {/* Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Time *
            </label>
            <div className="grid grid-cols-2 gap-2">
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-healthcare-primary"
                  required
                />
              </div>
              <select
                value={formData.time.includes('12:') || formData.time.includes('13:') || formData.time.includes('14:') || formData.time.includes('15:') || formData.time.includes('16:') || formData.time.includes('17:') || formData.time.includes('18:') || formData.time.includes('19:') || formData.time.includes('20:') || formData.time.includes('21:') || formData.time.includes('22:') || formData.time.includes('23:') ? 'PM' : 'AM'}
                onChange={(e) => {
                  const currentTime = formData.time;
                  if (currentTime) {
                    const [hours, minutes] = currentTime.split(':');
                    let newHours = parseInt(hours);
                    
                    if (e.target.value === 'PM' && newHours < 12) {
                      newHours += 12;
                    } else if (e.target.value === 'AM' && newHours >= 12) {
                      newHours -= 12;
                    }
                    
                    const formattedHours = newHours.toString().padStart(2, '0');
                    setFormData(prev => ({ ...prev, time: `${formattedHours}:${minutes}` }));
                  }
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-healthcare-primary"
              >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Select the time when you need to take this medicine
            </p>
          </div>

          {/* Display Time in 12-hour format */}
          {formData.time && (
            <div className="bg-healthcare-primary/5 rounded-lg p-3">
              <p className="text-sm text-healthcare-primary font-medium">
                Medicine Time: {formatTimeTo12Hour(formData.time)}
              </p>
            </div>
          )}

          {/* Frequency */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Frequency
            </label>
            <select
              value={formData.frequency}
              onChange={(e) => setFormData(prev => ({ ...prev, frequency: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-healthcare-primary"
            >
              {frequencyOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          {/* Additional Instructions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Instructions (Optional)
            </label>
            <textarea
              value={formData.instructions || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-healthcare-primary"
              rows={3}
              placeholder="e.g., Take with food, Before meals, etc."
            />
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
              Add Medicine
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
}
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-healthcare-primary"
                required
              />
            </div>
          </div>

          {/* Frequency */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Frequency
            </label>
            <select
              value={formData.frequency}
              onChange={(e) => setFormData(prev => ({ ...prev, frequency: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-healthcare-primary"
            >
              {frequencyOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
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
              Add Medicine
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}