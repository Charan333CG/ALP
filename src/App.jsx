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
}

export default App;
