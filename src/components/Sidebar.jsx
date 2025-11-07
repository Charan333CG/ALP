import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, BookOpen, Upload, Users, Settings, LogOut } from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const menuItems = [
    { to: '/', label: 'Dashboard', icon: Home, roles: ['student', 'teacher', 'admin'] },
    { to: '/courses', label: 'Courses', icon: BookOpen, roles: ['student', 'teacher', 'admin'] },
    { to: '/upload', label: 'Upload Course', icon: Upload, roles: ['teacher', 'admin'] },
    { to: '/admin', label: 'Admin Panel', icon: Users, roles: ['admin'] },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="bg-white border-r border-gray-200 w-64 min-h-screen p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary">ALP</h1>
        <p className="text-sm text-gray-600">Accessible Learning Platform</p>
      </div>

      <nav className="space-y-2">
        {menuItems
          .filter(item => item.roles.includes(user?.role))
          .map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
      </nav>

      <div className="absolute bottom-4 left-4 right-4">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 px-4 py-3 w-full text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;