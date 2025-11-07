import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-primary text-white p-4 sticky top-0 z-10" role="navigation" aria-label="Main navigation">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold" aria-label="Home">Accessible Learning Platform</Link>
        <div className="flex space-x-4">
          {user ? (
            <>
              <Link to="/" className="hover:underline" aria-label="Dashboard">Dashboard</Link>
              <Link to="/courses" className="hover:underline" aria-label="Courses">Courses</Link>
              <Link to="/sign-language" className="hover:underline" aria-label="Sign Language">Sign Language</Link>
              {user.role === 'teacher' && <Link to="/upload" className="hover:underline" aria-label="Upload">Upload</Link>}
              {user.role === 'admin' && <Link to="/admin" className="hover:underline" aria-label="Admin">Admin</Link>}
              <button onClick={handleLogout} className="hover:underline" aria-label="Logout">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:underline" aria-label="Login">Login</Link>
              <Link to="/register" className="hover:underline" aria-label="Register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;