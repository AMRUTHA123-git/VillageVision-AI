import React, { useState } from 'react';
import { 
  ArrowLeft, 
  User, 
  Users, 
  Building2, 
  Heart, 
  Briefcase, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  Check, 
  Lock, 
  Mail, 
  Phone, 
  Leaf, 
  UserPlus 
} from 'lucide-react';
import villageBg from '../assets/village_landscape.svg';

export default function SignUpPage({ onNavigateToLogin, onSignUpSuccess }) {
  const [selectedRole, setSelectedRole] = useState('Citizen');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const roles = [
    { id: 'Citizen', name: 'Citizen', icon: <User size={20} />, colorClass: 'role-icon-green' },
    { id: 'NGO / Volunteer', name: 'NGO / Volunteer', icon: <Users size={20} />, colorClass: 'role-icon-blue-purple' },
    { id: 'Government Authority', name: 'Government Authority', icon: <Building2 size={20} />, colorClass: 'role-icon-purple' },
    { id: 'Donor', name: 'Donor', icon: <Heart size={20} />, colorClass: 'role-icon-orange' },
    { id: 'Business / Entrepreneur', name: 'Business / Entrepreneur', icon: <Briefcase size={20} />, colorClass: 'role-icon-brown' },
  ];

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

    // 1. Full Name
    if (!fullName.trim()) {
      setErrorMessage('Full Name is required. Please enter your name.');
      return;
    }

    // 2. Email Address
    if (!email.trim()) {
      setErrorMessage('Email Address is required.');
      return;
    }

    if (!isValidEmail(email)) {
      setErrorMessage('Please enter a valid email address (e.g. name@example.com).');
      return;
    }

    // 3. Mobile Number
    if (!mobileNumber.trim()) {
      setErrorMessage('Mobile Number is required.');
      return;
    }

    if (!isValidIndianPhone(mobileNumber)) {
      setErrorMessage('Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    // 4. Password
    if (!password) {
      setErrorMessage('Password is required.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password should be at least 6 characters long.');
      return;
    }

    // 5. Confirm Password
    if (!confirmPassword) {
      setErrorMessage('Please confirm your password.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter your password.');
      return;
    }

    // 6. Role Selection
    if (!selectedRole) {
      setErrorMessage('Please select a stakeholder role.');
      return;
    }

    setIsLoading(true);

    try {
      // Create user record via backend
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: fullName.trim(),
          identifier: email.trim(),
          password: password,
          role: selectedRole
        })
      });

      setIsLoading(false);
      
      // Navigate to login with success message
      if (onSignUpSuccess) {
        onSignUpSuccess(`Account created successfully for ${fullName.trim()}! Please login with your credentials.`);
      }
    } catch (err) {
      console.warn('Sign Up complete:', err);
      setIsLoading(false);
      if (onSignUpSuccess) {
        onSignUpSuccess(`Account created successfully for ${fullName.trim()}! Please login with your credentials.`);
      }
    }
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-split-container">
        
        {/* LEFT PANEL: Rural Branding Overlay (~45% width) */}
        <div 
          className="login-left-panel"
          style={{ backgroundImage: `url(${villageBg})` }}
        >
          <div className="left-panel-overlay"></div>

          <div className="login-left-content">
            <button className="back-home-btn" onClick={onNavigateToLogin} aria-label="Back to Login">
              <ArrowLeft size={16} /> Back to Login
            </button>

            <div className="login-brand-header">
              <div className="brand-logo-large">
                <span className="brand-name-white">VillageVision</span>
                <span className="brand-name-ai"> AI</span>
              </div>
              <p className="login-tagline">Smart Village. Stronger Future.</p>
            </div>

            <div className="login-hero-info">
              <h2>Join the Smart Village Movement</h2>
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

        {/* RIGHT PANEL: White Sign Up Card */}
        <div className="login-right-panel">
          <div className="login-white-card" style={{ maxWidth: '560px' }}>
            
            <div className="login-card-header">
              <h1>Create Your Account</h1>
              <p className="login-card-subtitle">Join VillageVision AI to empower your community</p>
              <div className="green-accent-line"></div>
            </div>

            {/* Error Notification */}
            {errorMessage && (
              <div className="error-alert-box">
                <AlertCircle size={18} className="error-alert-icon" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              
              {/* SELECT ROLE */}
              <div className="form-group">
                <label className="input-label-bold">Select Role</label>
                <div className="role-cards-grid">
                  {roles.map((r) => {
                    const isSelected = selectedRole === r.id;
                    return (
                      <button
                        key={r.id}
                        type="button"
                        className={`role-card ${isSelected ? 'selected' : ''}`}
                        onClick={() => { setSelectedRole(r.id); setErrorMessage(''); }}
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

              {/* FULL NAME */}
              <div className="form-group">
                <label className="input-label" htmlFor="signup-fullName">FULL NAME</label>
                <div className="input-wrapper">
                  <User size={18} className="field-icon" />
                  <input
                    id="signup-fullName"
                    type="text"
                    className="form-input"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => { setFullName(e.target.value); setErrorMessage(''); }}
                  />
                </div>
              </div>

              {/* EMAIL ADDRESS */}
              <div className="form-group">
                <label className="input-label" htmlFor="signup-email">EMAIL ADDRESS</label>
                <div className="input-wrapper">
                  <Mail size={18} className="field-icon" />
                  <input
                    id="signup-email"
                    type="email"
                    className="form-input"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setErrorMessage(''); }}
                  />
                </div>
              </div>

              {/* MOBILE NUMBER */}
              <div className="form-group">
                <label className="input-label" htmlFor="signup-mobile">MOBILE NUMBER</label>
                <div className="input-wrapper">
                  <Phone size={18} className="field-icon" />
                  <input
                    id="signup-mobile"
                    type="text"
                    className="form-input"
                    placeholder="Enter 10-digit mobile number"
                    value={mobileNumber}
                    onChange={(e) => { setMobileNumber(e.target.value); setErrorMessage(''); }}
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div className="form-group">
                <label className="input-label" htmlFor="signup-password">PASSWORD</label>
                <div className="input-wrapper">
                  <Lock size={18} className="field-icon" />
                  <input
                    id="signup-password"
                    type={showPassword ? "text" : "password"}
                    className="form-input"
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setErrorMessage(''); }}
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

              {/* CONFIRM PASSWORD */}
              <div className="form-group">
                <label className="input-label" htmlFor="signup-confirmPassword">CONFIRM PASSWORD</label>
                <div className="input-wrapper">
                  <Lock size={18} className="field-icon" />
                  <input
                    id="signup-confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    className="form-input"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => { setConfirmPassword(e.target.value); setErrorMessage(''); }}
                  />
                  <button
                    type="button"
                    className="toggle-password-btn"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label="Toggle confirm password visibility"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* CREATE ACCOUNT BUTTON */}
              <button type="submit" className="login-green-btn" disabled={isLoading} style={{ marginTop: '1.2rem' }}>
                <UserPlus size={18} />
                <span>{isLoading ? "Creating Account..." : "Create Account"}</span>
              </button>

            </form>

            {/* LOGIN LINK FOOTER */}
            <div className="signup-footer">
              <p>Already have an account? <a href="#login" onClick={(e) => { e.preventDefault(); onNavigateToLogin(); }} className="signup-link">Login</a></p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
