import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { useNotifications, Notification } from '../contexts/NotificationContext';

const iconMap = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const colorMap = {
  success: 'border-green-500 bg-green-50 text-green-800',
  error: 'border-red-500 bg-red-50 text-red-800',
  warning: 'border-yellow-500 bg-yellow-50 text-yellow-800',
  info: 'border-blue-500 bg-blue-50 text-blue-800',
};

export default function NotificationToast() {
  const { notifications, removeNotification } = useNotifications();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => {
        const Icon = iconMap[notification.type];
        const colorClasses = colorMap[notification.type];

        return (
          <div
            key={notification.id}
            className={`max-w-sm w-full border-l-4 p-4 rounded-lg shadow-lg backdrop-blur-sm ${colorClasses} animate-slide-in-right`}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <Icon className="w-5 h-5" />
              </div>
              <div className="ml-3 w-0 flex-1 pt-0.5">
                <p className="text-sm font-medium">{notification.title}</p>
                <p className="text-xs mt-1 opacity-90">{notification.message}</p>
              </div>
              <div className="ml-4 flex-shrink-0 flex">
                <button
                  className="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none"
                  onClick={() => removeNotification(notification.id)}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}