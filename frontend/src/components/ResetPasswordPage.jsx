import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ArrowLeft, 
  Lock, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle2, 
  ShieldCheck, 
  KeyRound,
  Check,
  X
} from 'lucide-react';
import villageBg from '../assets/village_bg.jpg';
import { verifyResetToken, resetPassword } from '../utils/authManager';

export default function ResetPasswordPage({ 
  token, 
  onResetSuccess, 
  onNavigateToLogin, 
  onBackToHome, 
  onRequestNewLink 
}) {
  const [tokenStatus, setTokenStatus] = useState({ checked: false, valid: false, error: '', user: null });
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successInfo, setSuccessInfo] = useState(null);

  // Verify token on mount or when token changes
  useEffect(() => {
    if (!token) {
      setTokenStatus({
        checked: true,
        valid: false,
        error: 'No reset token found in URL. Please request a new password reset link.',
        user: null
      });
      return;
    }

    const verification = verifyResetToken(token);
    if (!verification.valid) {
      setTokenStatus({
        checked: true,
        valid: false,
        error: verification.error,
        user: null
      });
    } else {
      setTokenStatus({
        checked: true,
        valid: true,
        error: '',
        user: {
          email: verification.email,
          fullName: verification.fullName,
          role: verification.role
        }
      });
    }
  }, [token]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!newPassword) {
      setErrorMessage('Please enter a new password.');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please ensure both fields are identical.');
      return;
    }

    setIsLoading(true);

    const result = resetPassword({
      token,
      newPassword,
      confirmPassword
    });

    if (!result.success) {
      setIsLoading(false);
      setErrorMessage(result.error);
      return;
    }

    setIsLoading(false);
    setIsSuccess(true);
    setSuccessInfo(result);

    // Clean URL query parameters
    if (typeof window !== 'undefined' && window.history && window.history.replaceState) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  };

  const passwordsMatch = newPassword && confirmPassword && newPassword === confirmPassword;
  const passwordsMismatch = confirmPassword && newPassword !== confirmPassword;

  return (
    <div 
      className="login-fullscreen-wrapper"
      style={{ backgroundImage: `url(${villageBg})` }}
    >
      <div className="login-fullscreen-overlay"></div>

      {/* Floating Navigation Button */}
      <button 
        className="floating-back-btn" 
        onClick={onNavigateToLogin} 
        aria-label="Back to Login"
      >
        <ArrowLeft size={16} />
        <span>Back to Login</span>
      </button>

      <div className="centered-login-card" style={{ maxWidth: '480px' }}>
        
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
          <p className="brand-platform-subtitle">Create New Secure Password</p>
        </div>

        {/* LOADING / VERIFYING STATE */}
        {!tokenStatus.checked && (
          <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#64748b' }}>
            <p>Verifying secure reset token...</p>
          </div>
        )}

        {/* INVALID OR EXPIRED TOKEN STATE */}
        {tokenStatus.checked && !tokenStatus.valid && !isSuccess && (
          <div className="token-invalid-box" style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div style={{
              width: '52px',
              height: '52px',
              background: '#fee2e2',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              color: '#dc2626'
            }}>
              <AlertCircle size={28} />
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#991b1b', marginBottom: '0.5rem' }}>
              Invalid or Expired Link
            </h2>
            <p style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: '1.5rem', lineHeight: '1.5' }}>
              {tokenStatus.error || 'This password reset link is invalid or has expired. Password reset links are single-use and expire in 15 minutes.'}
            </p>

            <button 
              type="button" 
              className="login-green-btn"
              onClick={onRequestNewLink || onNavigateToLogin}
              style={{ marginBottom: '1rem' }}
            >
              <KeyRound size={18} />
              <span>REQUEST NEW RESET LINK</span>
            </button>

            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={onNavigateToLogin}
              style={{ width: '100%', justifyContent: 'center', borderRadius: '12px' }}
            >
              <span>Return to Login</span>
            </button>
          </div>
        )}

        {/* SUCCESS STATE */}
        {isSuccess && (
          <div className="reset-success-box" style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div style={{
              width: '54px',
              height: '54px',
              background: '#d1fae5',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              color: '#059669'
            }}>
              <CheckCircle2 size={32} />
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#065f46', marginBottom: '0.5rem' }}>
              Password Reset Complete!
            </h2>
            <p style={{ fontSize: '0.9rem', color: '#475569', marginBottom: '1.5rem', lineHeight: '1.5' }}>
              Your password has been successfully updated for <strong>{successInfo?.email}</strong>. You can now log in with your new credentials.
            </p>

            <button 
              type="button" 
              className="login-green-btn"
              onClick={() => {
                if (onResetSuccess) {
                  onResetSuccess(
                    'Password updated successfully! Please log in with your new password.', 
                    successInfo?.email,
                    successInfo?.role
                  );
                } else {
                  onNavigateToLogin();
                }
              }}
            >
              <Lock size={18} />
              <span>PROCEED TO LOGIN</span>
            </button>
          </div>
        )}

        {/* VALID TOKEN — RESET PASSWORD FORM */}
        {tokenStatus.checked && tokenStatus.valid && !isSuccess && (
          <div>
            {/* User Target Card */}
            <div style={{
              background: '#ecfdf5',
              border: '1px solid #a7f3d0',
              borderRadius: '12px',
              padding: '0.75rem 1rem',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem'
            }}>
              <ShieldCheck size={20} style={{ color: '#059669', flexShrink: 0 }} />
              <div style={{ fontSize: '0.84rem' }}>
                <span style={{ color: '#065f46', fontWeight: 700, display: 'block' }}>
                  Resetting Password for:
                </span>
                <span style={{ color: '#0f172a', fontWeight: 600 }}>
                  {tokenStatus.user?.fullName} ({tokenStatus.user?.email})
                </span>
              </div>
            </div>

            {errorMessage && (
              <div className="error-alert-box" style={{ marginBottom: '1.25rem' }}>
                <AlertCircle size={16} className="error-alert-icon" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="login-form-inner">
              
              {/* FIELD 1: NEW PASSWORD */}
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="input-label" htmlFor="new-password">NEW PASSWORD</label>
                <div className="input-wrapper">
                  <Lock size={18} className="field-icon" />
                  <input
                    id="new-password"
                    type={showNewPassword ? "text" : "password"}
                    className="form-input"
                    placeholder="Enter new password (min. 6 characters)"
                    value={newPassword}
                    onChange={(e) => { setNewPassword(e.target.value); setErrorMessage(''); }}
                    autoFocus
                  />
                  <button
                    type="button"
                    className="toggle-password-btn"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    aria-label="Toggle password visibility"
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '0.35rem' }}>
                  Must be at least 6 characters long.
                </div>
              </div>

              {/* FIELD 2: CONFIRM PASSWORD */}
              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className="input-label" htmlFor="confirm-password">CONFIRM NEW PASSWORD</label>
                  {passwordsMatch && (
                    <span style={{ fontSize: '0.74rem', color: '#059669', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                      <Check size={12} strokeWidth={3} /> Passwords match
                    </span>
                  )}
                  {passwordsMismatch && (
                    <span style={{ fontSize: '0.74rem', color: '#dc2626', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                      <X size={12} strokeWidth={3} /> Mismatch
                    </span>
                  )}
                </div>
                <div className="input-wrapper">
                  <Lock size={18} className="field-icon" />
                  <input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    className="form-input"
                    placeholder="Re-enter new password"
                    value={confirmPassword}
                    onChange={(e) => { setConfirmPassword(e.target.value); setErrorMessage(''); }}
                  />
                  <button
                    type="button"
                    className="toggle-password-btn"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label="Toggle password visibility"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* SUBMIT BUTTON */}
              <button 
                type="submit" 
                className="login-green-btn" 
                disabled={isLoading}
                style={{ marginTop: '0.5rem' }}
              >
                <ShieldCheck size={18} />
                <span>{isLoading ? "Updating Password..." : "SET NEW PASSWORD"}</span>
              </button>

              <div className="signup-footer-simple" style={{ marginTop: '1.25rem' }}>
                <p><a href="#login" onClick={(e) => { e.preventDefault(); onNavigateToLogin(); }} className="signup-link">Cancel & Return to Login</a></p>
              </div>

            </form>
          </div>
        )}

      </div>
    </div>
  );
}
