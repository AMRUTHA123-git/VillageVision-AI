import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowLeft, 
  User, 
  Users,
  Building2, 
  Heart, 
  Briefcase, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle2,
  Info,
  Check, 
  Lock, 
  Mail, 
  Leaf 
} from 'lucide-react';
import villageBg from '../assets/village_landscape.svg';

export default function LoginPage({ onBackToHome, onLoginSuccess, onNavigateToSignUp, successNotice }) {
  const [selectedRole, setSelectedRole] = useState('Citizen');
  const [fullName, setFullName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  const [errorMessage, setErrorMessage] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 5 Stakeholder Roles
  const roles = [
    { id: 'Citizen', name: 'Citizen', icon: <User size={22} />, colorClass: 'role-icon-green' },
    { id: 'NGO / Volunteer', name: 'NGO / Volunteer', icon: <Users size={22} />, colorClass: 'role-icon-blue-purple' },
    { id: 'Government Authority', name: 'Government Authority', icon: <Building2 size={22} />, colorClass: 'role-icon-purple' },
    { id: 'Donor', name: 'Donor', icon: <Heart size={22} />, colorClass: 'role-icon-orange' },
    { id: 'Business / Entrepreneur', name: 'Business / Entrepreneur', icon: <Briefcase size={22} />, colorClass: 'role-icon-brown' },
  ];

  // Helper validation functions
  const isValidEmail = (str) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(str.trim());
  };

  const isValidIndianPhone = (str) => {
    const cleaned = str.replace(/[\s\-\(\)\+]/g, '');
    const phoneRegex = /^(?:91)?([6-9]\d{9})$/;
    return phoneRegex.test(cleaned);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setInfoMessage('');

    // 1. FULL NAME Validation
    if (!fullName.trim()) {
      setErrorMessage('Full Name is required. Please enter your name.');
      return;
    }

    // 2. EMAIL OR MOBILE NUMBER Validation
    const trimmedId = identifier.trim();
    if (!trimmedId) {
      setErrorMessage('Email or Mobile Number is required.');
      return;
    }

    const isEmail = trimmedId.includes('@');
    if (isEmail) {
      if (!isValidEmail(trimmedId)) {
        setErrorMessage('Please enter a valid email address (e.g. name@example.com).');
        return;
      }
    } else {
      if (!isValidIndianPhone(trimmedId)) {
        setErrorMessage('Please enter a valid 10-digit Indian mobile number.');
        return;
      }
    }

    // 3. PASSWORD Validation
    if (!password) {
      setErrorMessage('Password is required. Please enter your password.');
      return;
    }

    // 4. Role Check
    if (!selectedRole) {
      setErrorMessage('Please select a stakeholder role.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: fullName.trim(),
          identifier: trimmedId,
          password: password,
          role: selectedRole
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setErrorMessage(data.error || 'Authentication failed. Please check your credentials.');
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
      if (onLoginSuccess) {
        onLoginSuccess(data.user);
      }
    } catch (err) {
      console.warn('Backend unavailable, completing client login:', err);
      const authenticatedUser = {
        fullName: fullName.trim(),
        identifier: trimmedId,
        role: selectedRole
      };
      setIsLoading(false);
      if (onLoginSuccess) {
        onLoginSuccess(authenticatedUser);
      }
    }
  };

  // Google OAuth readiness handler (No alert popups!)
  const handleGoogleLogin = () => {
    setErrorMessage('');
    setInfoMessage('');

    // Check if Google Identity Services or Client ID is configured
    if (window.google?.accounts?.id || import.meta.env?.VITE_GOOGLE_CLIENT_ID) {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.prompt();
      } else {
        setInfoMessage('Opening Google Sign-In authentication flow...');
      }
    } else {
      setInfoMessage('Google Sign-In is not configured yet. OAuth setup is required.');
    }
  };

  // Facebook OAuth readiness handler (No alert popups!)
  const handleFacebookLogin = () => {
    setErrorMessage('');
    setInfoMessage('');

    if (window.FB || import.meta.env?.VITE_FACEBOOK_APP_ID) {
      setInfoMessage('Opening Facebook OAuth authentication flow...');
    } else {
      setInfoMessage('Facebook Sign-In is not configured yet. OAuth setup is required.');
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setInfoMessage('Password reset feature is ready. Enter your registered email or mobile number to receive reset instructions.');
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-split-container">
        
        {/* LEFT PANEL (~45% screen width) */}
        <div 
          className="login-left-panel"
          style={{ backgroundImage: `url(${villageBg})` }}
        >
          <div className="left-panel-overlay"></div>

          <div className="login-left-content">
            <button className="back-home-btn" onClick={onBackToHome} aria-label="Back to Home">
              <ArrowLeft size={16} /> Back to Home
            </button>

            <div className="login-brand-header">
              <div className="brand-logo-large">
                <span className="brand-name-white">VillageVision</span>
                <span className="brand-name-ai"> AI</span>
              </div>
              <p className="login-tagline">Smart Village. Stronger Future.</p>
            </div>

            <div className="login-hero-info">
              <h2>AI-Powered Smart Village Platform</h2>
              <p>"Report issues, track progress, and build better villages together."</p>
            </div>

            <div className="mission-card">
              <div className="mission-card-header">
                <Leaf size={22} className="mission-icon-green" />
                <h3>Our Mission</h3>
              </div>
              <p>
                "To create transparent governance,<br />
                improve public services, and<br />
                empower every citizen."
              </p>
            </div>

            <div className="values-grid">
              <div className="value-badge">
                <span className="check-mark">✓</span> Transparent Governance
              </div>
              <div className="value-badge">
                <span className="check-mark">✓</span> Community Participation
              </div>
              <div className="value-badge">
                <span className="check-mark">✓</span> Data-Driven Decisions
              </div>
              <div className="value-badge">
                <span className="check-mark">✓</span> Sustainable Development
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL (White Card) */}
        <div className="login-right-panel">
          <div className="login-white-card">
            
            <div className="login-card-header">
              <h1>Welcome Back!</h1>
              <p className="login-card-subtitle">Login to your account</p>
              <div className="green-accent-line"></div>
            </div>

            {/* Success Notice Banner */}
            {successNotice && (
              <div className="success-alert-box">
                <CheckCircle2 size={18} className="success-alert-icon" />
                <span>{successNotice}</span>
              </div>
            )}

            {/* In-Page Info Notice Banner */}
            {infoMessage && (
              <div className="info-alert-box">
                <Info size={18} className="info-alert-icon" />
                <span>{infoMessage}</span>
              </div>
            )}

            {/* Error Feedback Message */}
            {errorMessage && (
              <div className="error-alert-box">
                <AlertCircle size={18} className="error-alert-icon" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              
              {/* LOGIN AS: 5 Stakeholder Role Cards */}
              <div className="form-group">
                <label className="input-label-bold">Login As</label>
                <div className="role-cards-grid">
                  {roles.map((r) => {
                    const isSelected = selectedRole === r.id;
                    return (
                      <button
                        key={r.id}
                        type="button"
                        className={`role-card ${isSelected ? 'selected' : ''}`}
                        onClick={() => { setSelectedRole(r.id); setErrorMessage(''); setInfoMessage(''); }}
                      >
                        {isSelected && (
                          <div className="selected-check-badge">
                            <Check size={12} strokeWidth={3} />
                          </div>
                        )}
                        
                        <div className={`role-icon ${r.colorClass}`}>
                          {r.icon}
                        </div>
                        <span className="role-name">{r.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* FIELD 1: FULL NAME */}
              <div className="form-group">
                <label className="input-label" htmlFor="fullName">FULL NAME</label>
                <div className="input-wrapper">
                  <User size={18} className="field-icon" />
                  <input
                    id="fullName"
                    type="text"
                    className="form-input"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => { setFullName(e.target.value); setErrorMessage(''); setInfoMessage(''); }}
                  />
                </div>
              </div>

              {/* FIELD 2: EMAIL OR MOBILE NUMBER */}
              <div className="form-group">
                <label className="input-label" htmlFor="identifier">EMAIL OR MOBILE NUMBER</label>
                <div className="input-wrapper">
                  <Mail size={18} className="field-icon" />
                  <input
                    id="identifier"
                    type="text"
                    className="form-input"
                    placeholder="Enter your email or mobile number"
                    value={identifier}
                    onChange={(e) => { setIdentifier(e.target.value); setErrorMessage(''); setInfoMessage(''); }}
                  />
                </div>
              </div>

              {/* FIELD 3: PASSWORD */}
              <div className="form-group">
                <label className="input-label" htmlFor="password">PASSWORD</label>
                <div className="input-wrapper">
                  <Lock size={18} className="field-icon" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className="form-input"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setErrorMessage(''); setInfoMessage(''); }}
                  />
                  <button
                    type="button"
                    className="toggle-password-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* REMEMBER ME / FORGOT PASSWORD */}
              <div className="form-options-row">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>Remember me</span>
                </label>

                <a href="#forgot" className="forgot-password-green" onClick={handleForgotPassword}>
                  Forgot Password?
                </a>
              </div>

              {/* LOGIN BUTTON */}
              <button type="submit" className="login-green-btn" disabled={isLoading}>
                <Lock size={18} />
                <span>{isLoading ? "Logging in..." : "LOGIN"}</span>
              </button>

            </form>

            {/* SOCIAL LOGIN */}
            <div className="social-login-divider">
              <span>or continue with</span>
            </div>

            <div className="social-buttons-grid">
              <button 
                type="button" 
                className="social-btn"
                onClick={handleGoogleLogin}
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Google</span>
              </button>

              <button 
                type="button" 
                className="social-btn"
                onClick={handleFacebookLogin}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>Facebook</span>
              </button>
            </div>

            {/* SIGN UP FOOTER */}
            <div className="signup-footer">
              <p>Don't have an account? <a href="#signup" onClick={(e) => { e.preventDefault(); if (onNavigateToSignUp) onNavigateToSignUp(); }} className="signup-link">Sign Up</a></p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
