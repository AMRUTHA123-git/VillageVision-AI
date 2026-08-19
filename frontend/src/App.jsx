import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import About from './components/About';
import Footer from './components/Footer';
import LoginPage from './components/LoginPage';
import SignUpPage from './components/SignUpPage';

// Import 6 Role-Based Dashboards
import CitizenDashboard from './components/dashboards/CitizenDashboard';
import AuthorityDashboard from './components/dashboards/AuthorityDashboard';
import NGODashboard from './components/dashboards/NGODashboard';
import VolunteerDashboard from './components/dashboards/VolunteerDashboard';
import DonorDashboard from './components/dashboards/DonorDashboard';
import BusinessDashboard from './components/dashboards/BusinessDashboard';

export default function App() {
  const [currentView, setCurrentView] = useState('landing');
  const [user, setUser] = useState(null);
  const [successNotice, setSuccessNotice] = useState('');

  // Restore authenticated user session if available
  useEffect(() => {
    const savedUser = localStorage.getItem('villagevision_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Failed to parse stored session');
      }
    }
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

  // Helper to render role-specific dashboard
  const renderDashboardForRole = () => {
    if (!user) return null;

    const role = user.role || 'Citizen';

    switch (role) {
      case 'Government Authority':
        return <AuthorityDashboard user={user} onLogout={handleLogout} />;
      case 'NGO':
        return <NGODashboard user={user} onLogout={handleLogout} />;
      case 'Volunteer':
        return <VolunteerDashboard user={user} onLogout={handleLogout} />;
      case 'NGO / Volunteer':
        // Check if user is a individual volunteer or NGO organization
        if (user.fullName?.toLowerCase().includes('volunteer') || user.identifier?.toLowerCase().includes('volunteer')) {
          return <VolunteerDashboard user={user} onLogout={handleLogout} />;
        }
        return <NGODashboard user={user} onLogout={handleLogout} />;
      case 'Donor':
        return <DonorDashboard user={user} onLogout={handleLogout} />;
      case 'Business / Entrepreneur':
      case 'Business':
        return <BusinessDashboard user={user} onLogout={handleLogout} />;
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
      ) : (
        <>
          {/* Show Navbar on Landing Page */}
          <Navbar 
            onNavigateToLogin={() => { setSuccessNotice(''); setCurrentView('login'); }}
            onNavigateToHome={() => { setSuccessNotice(''); setCurrentView('landing'); }}
            currentUser={user}
          />

          {currentView === 'login' ? (
            <LoginPage 
              onBackToHome={() => { setSuccessNotice(''); setCurrentView('landing'); }}
              onNavigateToSignUp={() => { setSuccessNotice(''); setCurrentView('signup'); }}
              onLoginSuccess={handleLoginSuccess}
              successNotice={successNotice}
            />
          ) : currentView === 'signup' ? (
            <SignUpPage 
              onNavigateToLogin={() => { setSuccessNotice(''); setCurrentView('login'); }}
              onSignUpSuccess={handleSignUpSuccess}
            />
          ) : (
            <main>
              <Hero onNavigateToLogin={() => { setSuccessNotice(''); setCurrentView('login'); }} />
              <Features />
              <About />
            </main>
          )}

          <Footer />
        </>
      )}
    </div>
  );
}
