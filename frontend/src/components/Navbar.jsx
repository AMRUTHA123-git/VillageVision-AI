import React, { useState } from 'react';
import { Sparkles, Menu, X, ArrowRight, UserCheck } from 'lucide-react';

export default function Navbar({ onNavigateToLogin, onNavigateToHome, currentUser }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (hash) => {
    setMobileMenuOpen(false);
    if (onNavigateToHome) {
      onNavigateToHome();
    }
    // Allow smooth scroll after returning to home
    setTimeout(() => {
      const el = document.querySelector(hash);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <nav className="navbar">
      <div className="container nav-container">
        <a href="#" className="brand-logo" onClick={(e) => { e.preventDefault(); onNavigateToHome(); }}>
          <div className="logo-icon">
            <Sparkles size={20} />
          </div>
          <span>VillageVision <span className="gradient-text">AI</span></span>
        </a>

        <ul className="nav-links">
          <li><a href="#home" className="nav-link" onClick={() => handleNavClick('#home')}>Home</a></li>
          <li><a href="#about" className="nav-link" onClick={() => handleNavClick('#about')}>About</a></li>
          <li><a href="#features" className="nav-link" onClick={() => handleNavClick('#features')}>Features</a></li>
          
          {currentUser ? (
            <li>
              <span className="btn btn-outline" style={{ cursor: 'default', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                <UserCheck size={16} /> {currentUser.fullName} ({currentUser.role})
              </span>
            </li>
          ) : (
            <>
              <li>
                <button className="btn btn-outline" onClick={onNavigateToLogin}>
                  Login
                </button>
              </li>
              <li>
                <button className="btn btn-primary" onClick={onNavigateToLogin}>
                  Get Started <ArrowRight size={16} />
                </button>
              </li>
            </>
          )}
        </ul>

        <button 
          className="mobile-toggle" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="mobile-menu open">
          <a href="#home" className="nav-link" onClick={() => handleNavClick('#home')}>Home</a>
          <a href="#about" className="nav-link" onClick={() => handleNavClick('#about')}>About</a>
          <a href="#features" className="nav-link" onClick={() => handleNavClick('#features')}>Features</a>
          
          {currentUser ? (
            <div className="btn btn-outline" style={{ textAlign: 'center' }}>
              Logged in as {currentUser.fullName} ({currentUser.role})
            </div>
          ) : (
            <>
              <button className="btn btn-outline" onClick={() => { setMobileMenuOpen(false); onNavigateToLogin(); }}>
                Login
              </button>
              <button className="btn btn-primary" onClick={() => { setMobileMenuOpen(false); onNavigateToLogin(); }}>
                Get Started <ArrowRight size={16} />
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
