import React, { useState } from 'react';
import { 
  Sparkles,
  ArrowLeft, 
  User, 
  Users, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  Check, 
  Lock, 
  Mail, 
  UserPlus,
  MessageCircleHeart
} from 'lucide-react';
import signupGirlBg from '../assets/signup_girl_bg.jpg';
import { registerAccount, isValidEmailFormat } from '../utils/authManager';

export default function SignUpPage({ onNavigateToLogin, onSignUpSuccess }) {
  const [selectedRole, setSelectedRole] = useState('Citizen');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Supported Roles
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

    // 1. Full Name
    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    // 2. Email Address
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setErrorMessage('Please enter your email address.');
      return;
    }

    if (!isValidEmailFormat(trimmedEmail)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    // 3. Password
    if (!password) {
      setErrorMessage('Password is required.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password should be at least 6 characters long.');
      return;
    }

    // 4. Confirm Password
    if (!confirmPassword) {
      setErrorMessage('Please confirm your password.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter your password.');
      return;
    }

    // 5. Role Selection
    const validRoles = ['Citizen', 'NGO / Volunteer'];
    if (!selectedRole || !validRoles.includes(selectedRole)) {
      setErrorMessage('Please select a role (Citizen or NGO / Volunteer).');
      return;
    }

    setIsLoading(true);

    // Register user account in authManager
    const regResult = await registerAccount({
      fullName: fullName.trim(),
      email: trimmedEmail,
      mobileNumber: '',
      password: password,
      role: selectedRole
    });

    if (!regResult.success) {
      setIsLoading(false);
      setErrorMessage(regResult.error);
      return;
    }

    setIsLoading(false);
    
    // Navigate to login with success notice
    if (onSignUpSuccess) {
      onSignUpSuccess(`Account created successfully for ${fullName.trim()}! Please login with your credentials.`);
    }
  };

  return (
    <div 
      className="signup-fullscreen-wrapper"
      style={{ backgroundImage: `url(${signupGirlBg})` }}
    >
      {/* Subtle Warm Glass Overlay */}
      <div className="signup-fullscreen-overlay"></div>

      {/* Floating Back to Login / Home Button */}
      <button 
        className="floating-back-btn" 
        onClick={onNavigateToLogin} 
        aria-label="Back to Login"
      >
        <ArrowLeft size={16} />
        <span>Back to Login</span>
      </button>

      {/* Cute Anime Girl Speech Bubble Banner */}
      <div className="girl-speech-bubble-wrapper">
        <div className="girl-speech-bubble">
          <span className="bubble-text">Please Sign Up! 💚</span>
          <span className="bubble-subtext">Join our Smart Village community 🌱</span>
        </div>
      </div>

      {/* Sign Up Container */}
      <div className="signup-content-container">
        
        {/* Modern Glass Sign Up Card */}
        <div className="centered-signup-card">
          
          {/* Brand Header */}
          <div className="signup-card-brand">
            <div className="brand-badge-row">
              <div className="brand-logo-icon">
                <Sparkles size={18} />
              </div>
              <h1 className="brand-main-title">
                VillageVision <span className="brand-ai-text">AI</span>
              </h1>
            </div>
            <h2 className="signup-main-subtitle">Create Your Account</h2>
          </div>

          {/* In-Page Error Banner */}
          {errorMessage && (
            <div className="error-alert-box" style={{ marginBottom: '1.25rem' }}>
              <AlertCircle size={16} className="error-alert-icon" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="signup-form-inner">
            
            {/* FIELD 1: FULL NAME */}
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="input-label" htmlFor="su-fullname">FULL NAME *</label>
              <div className="input-wrapper">
                <User size={18} className="field-icon" />
                <input
                  id="su-fullname"
                  type="text"
                  className="form-input"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => { setFullName(e.target.value); setErrorMessage(''); }}
                  autoFocus
                />
              </div>
            </div>

            {/* FIELD 2: EMAIL */}
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="input-label" htmlFor="su-email">EMAIL ADDRESS *</label>
              <div className="input-wrapper">
                <Mail size={18} className="field-icon" />
                <input
                  id="su-email"
                  type="email"
                  className="form-input"
                  placeholder="e.g. name@example.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErrorMessage(''); }}
                />
              </div>
            </div>

            {/* TWO COLUMN ROW: PASSWORD & CONFIRM PASSWORD */}
            <div className="form-two-col" style={{ marginBottom: '1rem' }}>
              
              {/* FIELD 3: PASSWORD */}
              <div>
                <label className="input-label" htmlFor="su-password">PASSWORD *</label>
                <div className="input-wrapper">
                  <Lock size={17} className="field-icon" />
                  <input
                    id="su-password"
                    type={showPassword ? "text" : "password"}
                    className="form-input"
                    placeholder="Min 6 chars"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setErrorMessage(''); }}
                  />
                  <button
                    type="button"
                    className="toggle-password-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* FIELD 4: CONFIRM PASSWORD */}
              <div>
                <label className="input-label" htmlFor="su-confirm-password">CONFIRM *</label>
                <div className="input-wrapper">
                  <Lock size={17} className="field-icon" />
                  <input
                    id="su-confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    className="form-input"
                    placeholder="Re-enter"
                    value={confirmPassword}
                    onChange={(e) => { setConfirmPassword(e.target.value); setErrorMessage(''); }}
                  />
                  <button
                    type="button"
                    className="toggle-password-btn"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label="Toggle confirm password visibility"
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

            </div>

            {/* ROLE SELECTION: 3 Roles */}
            <div className="role-selection-section" style={{ marginBottom: '1.25rem' }}>
              <label className="role-section-label">Select Role *</label>
              <div className="role-options-row">
                {roles.map((r) => {
                  const isSelected = selectedRole === r.id;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      className={`role-tab-btn ${isSelected ? 'active' : ''}`}
                      onClick={() => { setSelectedRole(r.id); setErrorMessage(''); }}
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

            {/* SUBMIT BUTTON */}
            <button type="submit" className="login-green-btn" disabled={isLoading}>
              <UserPlus size={18} />
              <span>{isLoading ? "Creating Account..." : "Sign Up"}</span>
            </button>

          </form>

          {/* FOOTER: ALREADY HAVE AN ACCOUNT? */}
          <div className="signup-footer-simple">
            <p>Already have an account? <a href="#login" onClick={(e) => { e.preventDefault(); if (onNavigateToLogin) onNavigateToLogin(); }} className="signup-link">Login</a></p>
          </div>

        </div>

      </div>
    </div>
  );
}
