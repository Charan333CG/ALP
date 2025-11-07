import { Routes, Route } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { AccessibilityProvider } from './context/AccessibilityContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import SignLanguage from './pages/SignLanguage';
import TeacherUpload from './pages/TeacherUpload';
import AdminPanel from './pages/AdminPanel';

function App() {
  const { user, loading } = useAuth();

  console.log('App component rendering, user:', user, 'loading:', loading);

  // Temporary debug UI to verify rendering
  return (
    <div style={{
      padding: '50px',
      color: 'white',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '20px' }}>🚀 Accessible Learning Platform Loaded Successfully!</h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '20px' }}>
        If you can see this, React is rendering correctly.
      </p>
      <div style={{ background: 'rgba(255,255,255,0.1)', padding: '20px', borderRadius: '10px' }}>
        <p><strong>Debug Info:</strong></p>
        <p>User: {user ? JSON.stringify(user) : 'Not logged in'}</p>
        <p>Loading: {loading ? 'Yes' : 'No'}</p>
        <p>API URL: {import.meta.env.VITE_API_URL || 'Not set'}</p>
        <p>Current Path: {window.location.pathname}</p>
      </div>
      <div style={{ marginTop: '30px' }}>
        <button
          onClick={() => window.location.href = '/login'}
          style={{
            padding: '10px 20px',
            background: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          Go to Login
        </button>
        <button
          onClick={() => window.location.href = '/dashboard'}
          style={{
            padding: '10px 20px',
            background: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );

  // Original code (commented out temporarily)
  /*
  if (loading) {
    console.log('Showing loading screen');
    return <div style={{ padding: '40px', color: 'white', background: 'black' }}>Loading Accessible Learning Platform...</div>;
  }

  console.log('Rendering main app content');

  return (
    <AccessibilityProvider>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={user ? <Dashboard /> : <Login />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:id" element={<CourseDetail />} />
            <Route path="/sign-language" element={<SignLanguage />} />
            <Route path="/upload" element={<TeacherUpload />} />
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
        </main>
      </div>
    </AccessibilityProvider>
  );
  */
}

export default App;
