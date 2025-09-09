import React, { useState } from 'react';
import { Eye, EyeOff, Heart, Shield, Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useNotifications } from '../contexts/NotificationContext';
import LanguageSelector from '../components/LanguageSelector';
import LoadingSpinner from '../components/LoadingSpinner';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { t } = useLanguage();
  const { addNotification } = useNotifications();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const success = await login(email, password);
    
    if (!success) {
      addNotification({
        title: 'Login Failed',
        message: 'Please check your credentials and try again',
        type: 'error'
      });
    }
    
    setIsLoading(false);
  };

  const demoCredentials = [
    { role: 'Patient', email: 'patient@demo.com', icon: Users, color: 'text-blue-600' },
    { role: 'Doctor', email: 'doctor@demo.com', icon: Heart, color: 'text-green-600' },
    { role: 'Admin', email: 'admin@demo.com', icon: Shield, color: 'text-purple-600' },
  ];

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-healthcare-primary via-healthcare-accent to-healthcare-primary/80 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-healthcare-mustard rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
      </div>

      {/* Language Selector */}
      <div className="absolute top-6 right-6">
        <div className="bg-white/20 backdrop-blur-sm rounded-lg px-2 py-1">
          <LanguageSelector />
        </div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center">
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
            <Heart className="w-12 h-12 text-healthcare-mustard mx-auto" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-white">
          {t('welcome_back')}
        </h2>
        <p className="mt-2 text-center text-sm text-white/80">
          {t('sign_in')}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white/95 backdrop-blur-sm py-8 px-4 shadow-xl rounded-2xl sm:px-10 border border-white/20">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-healthcare-primary">
                {t('email')}
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-healthcare-primary focus:border-healthcare-primary transition-all duration-200"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-healthcare-primary">
                {t('password')}
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-3 pr-10 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-healthcare-primary focus:border-healthcare-primary transition-all duration-200"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-healthcare-primary hover:bg-healthcare-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-healthcare-primary transition-all duration-200 transform hover:scale-105"
              >
                {t('login')}
              </button>
            </div>
          </form>

          {/* Demo Credentials */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Demo Accounts</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3">
              {demoCredentials.map((demo) => {
                const Icon = demo.icon;
                return (
                  <button
                    key={demo.role}
                    onClick={() => {
                      setEmail(demo.email);
                      setPassword('demo123');
                    }}
                    className="group relative w-full flex items-center justify-center py-3 px-4 border border-gray-300 text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200 hover:shadow-md"
                  >
                    <Icon className={`w-4 h-4 mr-2 ${demo.color}`} />
                    {demo.role} Demo
                    <span className="ml-auto text-xs text-gray-500">{demo.email}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}