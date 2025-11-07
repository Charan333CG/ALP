import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  const quickLinks = [
    { to: '/courses', label: 'Continue Learning', icon: '📚' },
    { to: '/sign-language', label: 'Learn Sign Language', icon: '🤟' },
    { to: '/courses', label: 'My Courses', icon: '🎓' },
  ];

  if (user.role === 'teacher') {
    quickLinks.push({ to: '/upload', label: 'Upload Course', icon: '📤' });
  }

  if (user.role === 'admin') {
    quickLinks.push({ to: '/admin', label: 'Admin Panel', icon: '⚙️' });
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8" id="dashboard-heading">Welcome back, {user.name}!</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" aria-labelledby="dashboard-heading">
        {quickLinks.map((link, index) => (
          <Link
            key={index}
            to={link.to}
            className="card hover:shadow-lg transition-shadow p-6 text-center"
            aria-label={link.label}
          >
            <div className="text-4xl mb-4">{link.icon}</div>
            <h3 className="text-xl font-semibold">{link.label}</h3>
          </Link>
        ))}
      </div>
      <div className="mt-8 card p-6">
        <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
        <p className="text-gray-600">No recent activity yet. Start learning!</p>
      </div>
    </div>
  );
};

export default Dashboard;