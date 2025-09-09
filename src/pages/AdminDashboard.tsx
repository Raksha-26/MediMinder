import React, { useState } from 'react';
import { 
  Users, 
  DollarSign, 
  Calendar, 
  Settings,
  TrendingUp,
  UserPlus,
  Shield,
  CreditCard,
  Edit,
  Trash2,
  LogOut,
  Activity
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useNotifications } from '../contexts/NotificationContext';
import LanguageSelector from '../components/LanguageSelector';
import NotificationToast from '../components/NotificationToast';

interface DashboardStats {
  totalPatients: number;
  totalDoctors: number;
  totalAppointments: number;
  monthlyRevenue: number;
  activeUsers: number;
  pendingPayments: number;
}

interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: 'patient' | 'doctor';
  joinDate: string;
  status: 'active' | 'inactive';
  lastLogin: string;
}

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const { addNotification } = useNotifications();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'finance' | 'settings'>('overview');

  const [stats] = useState<DashboardStats>({
    totalPatients: 1245,
    totalDoctors: 87,
    totalAppointments: 3456,
    monthlyRevenue: 125000,
    activeUsers: 892,
    pendingPayments: 23
  });

  const [users, setUsers] = useState<SystemUser[]>([
    {
      id: '1',
      name: 'Rajesh Kumar',
      email: 'patient@demo.com',
      role: 'patient',
      joinDate: '2023-12-01',
      status: 'active',
      lastLogin: '2024-01-14'
    },
    {
      id: '2',
      name: 'Dr. Priya Sharma',
      email: 'doctor@demo.com',
      role: 'doctor',
      joinDate: '2023-11-15',
      status: 'active',
      lastLogin: '2024-01-14'
    },
    {
      id: '3',
      name: 'Anita Patel',
      email: 'anita.patel@example.com',
      role: 'patient',
      joinDate: '2023-12-10',
      status: 'inactive',
      lastLogin: '2024-01-05'
    }
  ]);

  const [subscriptionFee, setSubscriptionFee] = useState(299);

  const handleDeleteUser = (id: string) => {
    setUsers(prev => prev.filter(user => user.id !== id));
    addNotification({
      title: 'User Deleted',
      message: 'User has been successfully removed from the system',
      type: 'success'
    });
  };

  const toggleUserStatus = (id: string) => {
    setUsers(prev => prev.map(user => 
      user.id === id 
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
        : user
    ));
    
    addNotification({
      title: 'User Status Updated',
      message: 'User status has been changed successfully',
      type: 'info'
    });
  };

  const renderOverview = () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-semibold text-healthcare-primary mb-6">{t('overview')}</h3>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:shadow-lg transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{t('total_patients')}</p>
                <p className="text-2xl font-bold text-healthcare-primary">{stats.totalPatients}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:shadow-lg transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{t('total_doctors')}</p>
                <p className="text-2xl font-bold text-healthcare-primary">{stats.totalDoctors}</p>
              </div>
              <Shield className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:shadow-lg transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{t('total_appointments')}</p>
                <p className="text-2xl font-bold text-healthcare-primary">{stats.totalAppointments}</p>
              </div>
              <Calendar className="w-8 h-8 text-purple-500" />
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:shadow-lg transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Monthly Revenue</p>
                <p className="text-2xl font-bold text-healthcare-primary">₹{stats.monthlyRevenue.toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:shadow-lg transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active Users</p>
                <p className="text-2xl font-bold text-healthcare-primary">{stats.activeUsers}</p>
              </div>
              <Activity className="w-8 h-8 text-healthcare-accent" />
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:shadow-lg transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending Payments</p>
                <p className="text-2xl font-bold text-healthcare-primary">{stats.pendingPayments}</p>
              </div>
              <CreditCard className="w-8 h-8 text-red-500" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <h4 className="text-lg font-semibold text-healthcare-primary mb-4">Quick Actions</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="flex items-center gap-3 p-4 bg-healthcare-primary text-white rounded-lg hover:bg-healthcare-primary/90 transition-colors">
              <UserPlus className="w-5 h-5" />
              Add New User
            </button>
            <button className="flex items-center gap-3 p-4 bg-healthcare-accent text-white rounded-lg hover:bg-healthcare-accent/90 transition-colors">
              <TrendingUp className="w-5 h-5" />
              View Analytics
            </button>
            <button className="flex items-center gap-3 p-4 bg-healthcare-mustard text-white rounded-lg hover:bg-healthcare-mustard/90 transition-colors">
              <Settings className="w-5 h-5" />
              System Settings
            </button>
            <button className="flex items-center gap-3 p-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
              <CreditCard className="w-5 h-5" />
              Manage Payments
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-healthcare-primary">{t('user_management')}</h3>
        <button className="flex items-center gap-2 px-4 py-2 bg-healthcare-primary text-white rounded-lg hover:bg-healthcare-primary/90 transition-colors">
          <UserPlus className="w-4 h-4" />
          Add User
        </button>
      </div>

      <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-healthcare-primary/5">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-healthcare-primary">Name</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-healthcare-primary">Email</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-healthcare-primary">Role</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-healthcare-primary">Status</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-healthcare-primary">Join Date</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-healthcare-primary">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-white/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-healthcare-primary">{user.name}</div>
                    <div className="text-sm text-gray-500">Last login: {new Date(user.lastLogin).toLocaleDateString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.role === 'doctor' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleUserStatus(user.id)}
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full transition-colors ${
                        user.status === 'active'
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                      }`}
                    >
                      {user.status}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {new Date(user.joinDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex gap-2">
                      <button className="p-2 text-healthcare-primary hover:bg-healthcare-primary/10 rounded-lg transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(user.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderFinance = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-healthcare-primary">{t('finance_management')}</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <h4 className="text-lg font-semibold text-healthcare-primary mb-4">Subscription Settings</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Monthly Subscription Fee (₹)
              </label>
              <input
                type="number"
                value={subscriptionFee}
                onChange={(e) => setSubscriptionFee(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-healthcare-primary"
              />
            </div>
            
            <button className="w-full px-4 py-2 bg-healthcare-primary text-white rounded-lg hover:bg-healthcare-primary/90 transition-colors">
              Update Subscription Fee
            </button>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <h4 className="text-lg font-semibold text-healthcare-primary mb-4">Revenue Overview</h4>
          
          <div className="space-y-4">
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-600">This Month</span>
              <span className="font-semibold text-healthcare-primary">₹{stats.monthlyRevenue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-600">Pending Payments</span>
              <span className="font-semibold text-red-500">₹45,000</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Total Revenue</span>
              <span className="font-semibold text-green-600">₹1,250,000</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20">
        <h4 className="text-lg font-semibold text-healthcare-primary mb-4">Payment History</h4>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-healthcare-primary/5">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-healthcare-primary">Date</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-healthcare-primary">User</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-healthcare-primary">Amount</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-healthcare-primary">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-3 text-sm text-gray-600">2024-01-14</td>
                <td className="px-4 py-3 text-sm text-healthcare-primary font-medium">Dr. Priya Sharma</td>
                <td className="px-4 py-3 text-sm text-gray-600">₹299</td>
                <td className="px-4 py-3">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    Completed
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm text-gray-600">2024-01-13</td>
                <td className="px-4 py-3 text-sm text-healthcare-primary font-medium">Rajesh Kumar</td>
                <td className="px-4 py-3 text-sm text-gray-600">₹199</td>
                <td className="px-4 py-3">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    Pending
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-healthcare-primary">System Settings</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <h4 className="text-lg font-semibold text-healthcare-primary mb-4">Platform Configuration</h4>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Email Notifications</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-healthcare-primary"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-700">SMS Notifications</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-healthcare-primary"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Auto-backup</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-healthcare-primary"></div>
              </label>
            </div>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <h4 className="text-lg font-semibold text-healthcare-primary mb-4">Security Settings</h4>
          
          <div className="space-y-4">
            <button className="w-full text-left px-4 py-3 bg-healthcare-primary/10 text-healthcare-primary rounded-lg hover:bg-healthcare-primary/20 transition-colors">
              Change Admin Password
            </button>
            <button className="w-full text-left px-4 py-3 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 transition-colors">
              Export System Logs
            </button>
            <button className="w-full text-left px-4 py-3 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors">
              Reset System Database
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'overview' as const, label: t('overview'), icon: TrendingUp },
    { id: 'users' as const, label: t('user_management'), icon: Users },
    { id: 'finance' as const, label: t('finance_management'), icon: DollarSign },
    { id: 'settings' as const, label: t('settings'), icon: Settings },
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
                <Shield className="w-6 h-6 text-healthcare-primary" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-healthcare-primary">
                  Welcome, {user?.name}
                </h1>
                <p className="text-sm text-gray-600">Admin Dashboard</p>
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
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'users' && renderUsers()}
          {activeTab === 'finance' && renderFinance()}
          {activeTab === 'settings' && renderSettings()}
        </div>
      </div>
    </div>
  );
}