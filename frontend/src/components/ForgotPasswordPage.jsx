import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowLeft, 
  Mail, 
  KeyRound, 
  AlertCircle, 
  CheckCircle2, 
  ExternalLink, 
  Copy, 
  Check, 
  ShieldAlert,
  Inbox
} from 'lucide-react';
import villageBg from '../assets/village_bg.jpg';
import { requestPasswordReset } from '../utils/authManager';

export default function ForgotPasswordPage({ onBackToLogin, onBackToHome, onOpenResetLink }) {
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resetResult, setResetResult] = useState(null);
  const [copied, setCopied] = useState(false);
  const [showEmailPreview, setShowEmailPreview] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    const result = requestPasswordReset(email);

    if (!result.success) {
      setIsLoading(false);
      setErrorMessage(result.error);
      return;
    }

    setIsLoading(false);
    setResetResult(result);
  };

  const handleCopyLink = () => {
    if (!resetResult?.resetUrl) return;
    navigator.clipboard.writeText(resetResult.resetUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }).catch(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div 
      className="login-fullscreen-wrapper"
      style={{ backgroundImage: `url(${villageBg})` }}
    >
      <div className="login-fullscreen-overlay"></div>

      {/* Top Navigation Buttons */}
      <button 
        className="floating-back-btn" 
        onClick={onBackToLogin} 
        aria-label="Back to Login"
      >
        <ArrowLeft size={16} />
        <span>Back to Login</span>
      </button>

      <div className="centered-login-card" style={{ maxWidth: '500px' }}>
        
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
          <p className="brand-platform-subtitle">Account Security & Recovery</p>
        </div>

        <div className="forgot-password-intro" style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            background: 'rgba(16, 185, 129, 0.12)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 0.75rem',
            color: '#059669'
          }}>
            <KeyRound size={24} />
          </div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.25rem' }}>
            Forgot Password?
          </h2>
          <p style={{ fontSize: '0.88rem', color: '#64748b', margin: 0 }}>
            Enter your registered email address to receive a secure password reset link.
          </p>
        </div>

        {errorMessage && (
          <div className="error-alert-box" style={{ marginBottom: '1.25rem' }}>
            <AlertCircle size={16} className="error-alert-icon" />
            <span>{errorMessage}</span>
          </div>
        )}

        {!resetResult ? (
          /* FORM VIEW */
          <form onSubmit={handleSubmit} className="login-form-inner">
            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label className="input-label" htmlFor="forgot-email">REGISTERED EMAIL ADDRESS</label>
              <div className="input-wrapper">
                <Mail size={18} className="field-icon" />
                <input
                  id="forgot-email"
                  type="text"
                  className="form-input"
                  placeholder="e.g. citizen@villagevision.ai"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErrorMessage(''); }}
                  autoFocus
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="login-green-btn" 
              disabled={isLoading}
              style={{ marginTop: '0.5rem' }}
            >
              <KeyRound size={18} />
              <span>{isLoading ? "Generating Link..." : "SEND PASSWORD RESET LINK"}</span>
            </button>

            <div className="signup-footer-simple" style={{ marginTop: '1.5rem' }}>
              <p>Remember your password? <a href="#login" onClick={(e) => { e.preventDefault(); onBackToLogin(); }} className="signup-link">Back to Login</a></p>
            </div>
          </form>
        ) : (
          /* LINK DISPATCHED VIEW */
          <div className="reset-dispatched-wrapper">
            <div className="success-alert-box" style={{ marginBottom: '1.25rem' }}>
              <CheckCircle2 size={18} className="success-alert-icon" />
              <div>
                <strong style={{ display: 'block', color: '#065f46' }}>Reset Link Dispatched</strong>
                <span>A secure reset link was generated for <strong>{resetResult.email}</strong>.</span>
              </div>
            </div>

            {/* Direct Open and Copy Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <button 
                type="button" 
                className="login-green-btn"
                onClick={() => {
                  if (onOpenResetLink) {
                    onOpenResetLink(resetResult.token);
                  } else {
                    window.location.href = resetResult.resetUrl;
                  }
                }}
              >
                <ExternalLink size={18} />
                <span>OPEN RESET LINK NOW</span>
              </button>

              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={handleCopyLink}
                style={{ width: '100%', justifyContent: 'center', padding: '0.75rem', borderRadius: '12px' }}
              >
                {copied ? <Check size={18} style={{ color: '#059669' }} /> : <Copy size={18} />}
                <span>{copied ? "Link Copied to Clipboard!" : "Copy Reset Link"}</span>
              </button>
            </div>

            {/* Email Dispatch Preview Container */}
            <div className="email-preview-card" style={{
              background: '#f8fafc',
              border: '1.5px solid #e2e8f0',
              borderRadius: '12px',
              padding: '1rem',
              marginBottom: '1.25rem',
              textAlign: 'left'
            }}>
              <div 
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
                onClick={() => setShowEmailPreview(!showEmailPreview)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Inbox size={16} style={{ color: '#059669' }} />
                  <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#1e293b' }}>
                    Security Email Inbox Preview
                  </span>
                </div>
                <span style={{ fontSize: '0.76rem', color: '#059669', fontWeight: 600 }}>
                  {showEmailPreview ? "Hide" : "Show"}
                </span>
              </div>

              {showEmailPreview && (
                <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #e2e8f0', fontSize: '0.82rem', color: '#334155' }}>
                  <p style={{ margin: '0 0 0.35rem' }}><strong>From:</strong> security@villagevision.ai</p>
                  <p style={{ margin: '0 0 0.35rem' }}><strong>To:</strong> {resetResult.email} ({resetResult.fullName})</p>
                  <p style={{ margin: '0 0 0.5rem' }}><strong>Subject:</strong> VillageVision AI — Reset Your Password</p>
                  <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '0.75rem', wordBreak: 'break-all', fontFamily: 'monospace', fontSize: '0.78rem', color: '#047857' }}>
                    {resetResult.resetUrl}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.5rem', color: '#b45309', fontSize: '0.76rem' }}>
                    <ShieldAlert size={14} />
                    <span>Expires in 15 minutes. Single-use only.</span>
                  </div>
                </div>
              )}
            </div>

            <button 
              type="button" 
              className="btn btn-outline"
              onClick={() => { setResetResult(null); setEmail(''); }}
              style={{ width: '100%', justifyContent: 'center', borderRadius: '12px' }}
            >
              <span>Request Another Link</span>
            </button>

            <div className="signup-footer-simple" style={{ marginTop: '1.25rem' }}>
              <p><a href="#login" onClick={(e) => { e.preventDefault(); onBackToLogin(); }} className="signup-link">Return to Login</a></p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
