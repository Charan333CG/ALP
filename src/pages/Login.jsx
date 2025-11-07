import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      console.log('Submitting login form for:', formData.email);
      await login(formData.email, formData.password);
      console.log('Login successful, navigating to dashboard');
      navigate('/');
    } catch (err) {
      console.error('Login failed:', err);
      setError(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 transform transition-all duration-300 hover:scale-105">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2" id="login-heading">Welcome Back</h2>
          <p className="text-gray-600">Sign in to continue your learning journey</p>
        </div>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 animate-pulse" role="alert">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} aria-labelledby="login-heading" className="space-y-6">
          <div className="group">
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2 transition-colors group-focus-within:text-accent">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-200 outline-none"
              aria-describedby="email-help"
              placeholder="your@email.com"
            />
            <span id="email-help" className="sr-only">Enter your registered email address</span>
          </div>
          <div className="group">
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2 transition-colors group-focus-within:text-accent">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-200 outline-none"
              aria-describedby="password-help"
              placeholder="Enter your password"
            />
            <span id="password-help" className="sr-only">Enter your password</span>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-accent to-green-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-green-600 hover:to-accent transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            aria-label="Login to your account"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing In...
              </span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            New to our platform?{' '}
            <Link to="/register" className="text-accent hover:text-green-600 font-semibold transition-colors duration-200">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;