import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import About from './components/About';
import Footer from './components/Footer';
import LoginPage from './components/LoginPage';
import SignUpPage from './components/SignUpPage';
import ForgotPasswordPage from './components/ForgotPasswordPage';
import ResetPasswordPage from './components/ResetPasswordPage';

// Import Role-Based Dashboards
import CitizenDashboard from './components/dashboards/CitizenDashboard';
import NGODashboard from './components/dashboards/NGODashboard';

export default function App() {
  const [currentView, setCurrentView] = useState('landing');
  const [user, setUser] = useState(null);
  const [successNotice, setSuccessNotice] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [loginPrefill, setLoginPrefill] = useState({ email: '', role: 'Citizen' });

  // Detect ?token=... or ?resetToken=... on mount and popstate
  useEffect(() => {
    const checkUrlParams = () => {
      try {
        if (typeof window !== 'undefined' && window.location) {
          const params = new URLSearchParams(window.location.search);
          const token = params.get('token') || params.get('resetToken');
          const view = params.get('view');

          if (token) {
            setResetToken(token);
            setCurrentView('reset-password');
          } else if (view === 'forgot-password') {
            setCurrentView('forgot-password');
          }
        }
      } catch (e) {
        console.error('Failed to parse URL query params:', e);
      }
    };

    checkUrlParams();
    window.addEventListener('popstate', checkUrlParams);
    return () => window.removeEventListener('popstate', checkUrlParams);
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem('villagevision_user', JSON.stringify(userData));
    setSuccessNotice('');
    setCurrentView('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSignUpSuccess = (message) => {
    setSuccessNotice(message);
    setCurrentView('login');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('villagevision_user');
    setSuccessNotice('');
    setCurrentView('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Helper to render role-specific dashboard (Citizen or NGO / Volunteer)
  const renderDashboardForRole = () => {
    if (!user) return null;

    const role = user.role || 'Citizen';

    switch (role) {
      case 'NGO':
      case 'Volunteer':
      case 'NGO / Volunteer':
        return <NGODashboard user={user} onLogout={handleLogout} />;
      case 'Citizen':
      default:
        return <CitizenDashboard user={user} onLogout={handleLogout} />;
    }
  };

  return (
    <div className="app-container">
      {/* If user is logged in, show their role-based dashboard */}
      {user ? (
        renderDashboardForRole()
      ) : currentView === 'login' ? (
        /* Standalone Focused Fullscreen Login Page */
        <LoginPage 
          onBackToHome={() => { setSuccessNotice(''); setCurrentView('landing'); }}
          onNavigateToSignUp={() => { setSuccessNotice(''); setCurrentView('signup'); }}
          onNavigateToForgotPassword={() => { setSuccessNotice(''); setCurrentView('forgot-password'); }}
          onLoginSuccess={handleLoginSuccess}
          successNotice={successNotice}
          initialEmail={loginPrefill.email}
          initialRole={loginPrefill.role}
        />
      ) : currentView === 'signup' ? (
        /* Standalone Focused Sign Up Page */
        <SignUpPage 
          onNavigateToLogin={() => { setSuccessNotice(''); setCurrentView('login'); }}
          onSignUpSuccess={handleSignUpSuccess}
        />
      ) : currentView === 'forgot-password' ? (
        /* Standalone Focused Forgot Password Page */
        <ForgotPasswordPage 
          onBackToLogin={() => { setSuccessNotice(''); setCurrentView('login'); }}
          onBackToHome={() => { setSuccessNotice(''); setCurrentView('landing'); }}
          onOpenResetLink={(token) => {
            setResetToken(token);
            setCurrentView('reset-password');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      ) : currentView === 'reset-password' ? (
        /* Standalone Focused Reset Password Page */
        <ResetPasswordPage 
          token={resetToken}
          onResetSuccess={(msg, email, role) => {
            setSuccessNotice(msg);
            if (email) setLoginPrefill({ email, role: role || 'Citizen' });
            setCurrentView('login');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onNavigateToLogin={() => { setSuccessNotice(''); setCurrentView('login'); }}
          onBackToHome={() => { setSuccessNotice(''); setCurrentView('landing'); }}
          onRequestNewLink={() => { setSuccessNotice(''); setCurrentView('forgot-password'); }}
        />
      ) : (
        /* Landing Page with Navbar, Hero, Features, About, and Footer */
        <>
          <Navbar 
            onNavigateToLogin={() => { setSuccessNotice(''); setCurrentView('login'); }}
            onNavigateToHome={() => { setSuccessNotice(''); setCurrentView('landing'); }}
            currentUser={user}
          />
          <main>
            <Hero onNavigateToLogin={() => { setSuccessNotice(''); setCurrentView('login'); }} />
            <Features />
            <About />
          </main>
          <Footer />
        </>
      )}
    </div>
  );
}

