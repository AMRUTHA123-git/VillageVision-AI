import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowLeft, 
  User, 
  Users, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle2, 
  Info, 
  Check, 
  Lock, 
  Mail 
} from 'lucide-react';
import villageBg from '../assets/village_bg.jpg';
import { authenticateUser } from '../utils/authManager';

export default function LoginPage({ 
  onBackToHome, 
  onLoginSuccess, 
  onNavigateToSignUp, 
  onNavigateToForgotPassword,
  successNotice,
  initialEmail = '',
  initialRole = 'Citizen'
}) {
  const [selectedRole, setSelectedRole] = useState(initialRole || 'Citizen');
  const [email, setEmail] = useState(initialEmail || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  const [errorMessage, setErrorMessage] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 2 Supported Roles
  const roles = [
    { 
      id: 'Citizen', 
      name: 'Citizen', 
      icon: <User size={18} />, 
      colorClass: 'role-icon-green' 
    },
    { 
      id: 'NGO / Volunteer', 
      name: 'NGO / Volunteer', 
      icon: <Users size={18} />, 
      colorClass: 'role-icon-blue' 
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setInfoMessage('');

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (!password) {
      setErrorMessage('Password is required. Please enter your password.');
      return;
    }

    if (!selectedRole) {
      setErrorMessage('Please select a login role.');
      return;
    }

    setIsLoading(true);

    // Strict Authentication Validation
    const authResult = authenticateUser({
      email: trimmedEmail,
      password: password,
      role: selectedRole
    });

    if (!authResult.success) {
      setIsLoading(false);
      setErrorMessage(authResult.error);
      return;
    }

    setIsLoading(false);

    if (onLoginSuccess) {
      onLoginSuccess(authResult.user);
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setInfoMessage('');
    if (onNavigateToForgotPassword) {
      onNavigateToForgotPassword();
    } else {
      setInfoMessage('Password reset instructions will be sent to your registered email.');
    }
  };

  return (
    <div 
      className="login-fullscreen-wrapper"
      style={{ backgroundImage: `url(${villageBg})` }}
    >
      {/* Subtle Warm Glass Overlay */}
      <div className="login-fullscreen-overlay"></div>

      {/* Floating Back to Home Button */}
      <button 
        className="floating-back-btn" 
        onClick={onBackToHome} 
        aria-label="Back to Home"
      >
        <ArrowLeft size={16} />
        <span>Back to Home</span>
      </button>

      {/* Centered Modern Glass Login Card */}
      <div className="centered-login-card">
        
        {/* Brand Header */}
        <div className="login-card-brand">
          <div className="brand-badge-row">
            <div className="brand-logo-icon">
              <Sparkles size={18} />
            </div>
            <h1 className="brand-main-title">
              VillageVision <span className="brand-ai-text">AI</span>
            </h1>
          </div>
          <p className="brand-platform-subtitle">Community Development Platform</p>
        </div>

        {/* Notifications & Alerts */}
        {successNotice && (
          <div className="success-alert-box">
            <CheckCircle2 size={16} className="success-alert-icon" />
            <span>{successNotice}</span>
          </div>
        )}

        {infoMessage && (
          <div className="info-alert-box">
            <Info size={16} className="info-alert-icon" />
            <span>{infoMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="error-alert-box">
            <AlertCircle size={16} className="error-alert-icon" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form-inner">
          
          {/* ROLE SELECTOR: 3 Roles */}
          <div className="role-selection-section">
            <label className="role-section-label">Login as</label>
            <div className="role-options-row">
              {roles.map((r) => {
                const isSelected = selectedRole === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    className={`role-tab-btn ${isSelected ? 'active' : ''}`}
                    onClick={() => { 
                      setSelectedRole(r.id); 
                      setErrorMessage(''); 
                      setInfoMessage(''); 
                    }}
                  >
                    {isSelected && (
                      <div className="role-check-indicator">
                        <Check size={11} strokeWidth={3} />
                      </div>
                    )}
                    <span className={`role-tab-icon ${r.colorClass}`}>{r.icon}</span>
                    <span className="role-tab-text">{r.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* FIELD 1: EMAIL */}
          <div className="form-group">
            <label className="input-label" htmlFor="email">EMAIL ADDRESS</label>
            <div className="input-wrapper">
              <Mail size={18} className="field-icon" />
              <input
                id="email"
                type="text"
                className="form-input"
                placeholder="e.g. citizen@villagevision.ai"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setErrorMessage(''); setInfoMessage(''); }}
                autoFocus
              />
            </div>
          </div>

          {/* FIELD 2: PASSWORD */}
          <div className="form-group">
            <label className="input-label" htmlFor="password">PASSWORD</label>
            <div className="input-wrapper">
              <Lock size={18} className="field-icon" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className="form-input"
                placeholder="Enter password"
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

          {/* REMEMBER ME & FORGOT PASSWORD */}
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

          {/* LOGIN SUBMIT BUTTON */}
          <button type="submit" className="login-green-btn" disabled={isLoading}>
            <Lock size={18} />
            <span>{isLoading ? "Logging in..." : "LOGIN"}</span>
          </button>

        </form>

        {/* SIGN UP FOOTER */}
        <div className="signup-footer-simple">
          <p>Don't have an account? <a href="#signup" onClick={(e) => { e.preventDefault(); if (onNavigateToSignUp) onNavigateToSignUp(); }} className="signup-link">Sign Up</a></p>
        </div>

      </div>
    </div>
  );
}
