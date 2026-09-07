import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Shield, 
  CheckCircle2, 
  Calendar, 
  Trash2, 
  AlertTriangle, 
  X, 
  Check 
} from 'lucide-react';
import { deleteAccount } from '../utils/authManager';

export default function ProfilePage({ user, onLogout, onDeleteAccount }) {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmInput, setConfirmInput] = useState('');
  const [deleteError, setDeleteError] = useState('');

  const fullName = user?.fullName || 'Authenticated User';
  const identifier = user?.identifier || user?.email || 'user@example.com';
  const role = user?.role || 'Citizen';

  const handleDeleteConfirm = () => {
    setIsDeleting(true);
    setDeleteError('');

    const targetEmail = identifier;
    const result = deleteAccount(targetEmail);

    if (!result.success) {
      setIsDeleting(false);
      setDeleteError(result.error || 'Failed to delete account.');
      return;
    }

    setIsDeleting(false);
    setShowConfirmModal(false);

    if (onDeleteAccount) {
      onDeleteAccount();
    } else if (onLogout) {
      onLogout();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="profile-wrapper">
      
      {/* HEADER */}
      <div className="dash-card-header" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h1 className="hero-title" style={{ fontSize: '2rem', textAlign: 'left', marginBottom: '0.25rem', color: '#0f172a' }}>
            User <span className="gradient-text">Profile</span>
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.98rem' }}>
            Your authenticated account details and fixed stakeholder credentials.
          </p>
        </div>
        <span className="badge-tag">Role Security Verified</span>
      </div>

      {/* PROFILE CARD */}
      <div className="dash-card" style={{ maxWidth: '640px', margin: '0 auto 2rem', background: '#ffffff', border: '1px solid #e2e8f0' }}>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1.25rem',
          paddingBottom: '1.5rem',
          borderBottom: '1px solid #e2e8f0',
          marginBottom: '1.5rem'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: '#ecfdf5',
            border: '2px solid #a7f3d0',
            color: '#059669',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            fontWeight: 800
          }}>
            <User size={32} />
          </div>

          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              {fullName}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.35rem' }}>
              <span className="role-security-pill">
                <Shield size={14} /> {role}
              </span>
              <span style={{ fontSize: '0.82rem', color: '#059669', fontWeight: 600 }}>
                Role Verified
              </span>
            </div>
          </div>
        </div>

        {/* DETAILS GRID */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.85rem 1rem', background: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: '10px' }}>
            <span style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
              <User size={16} /> Full Name
            </span>
            <strong style={{ color: '#0f172a' }}>{fullName}</strong>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.85rem 1rem', background: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: '10px' }}>
            <span style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
              <Mail size={16} /> Email Address
            </span>
            <strong style={{ color: '#0f172a' }}>{identifier}</strong>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.85rem 1rem', background: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: '10px' }}>
            <span style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
              <Shield size={16} /> Stakeholder Role
            </span>
            <strong style={{ color: '#059669' }}>{role}</strong>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.85rem 1rem', background: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: '10px' }}>
            <span style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
              <Calendar size={16} /> Member Since
            </span>
            <strong style={{ color: '#0f172a' }}>August 2026</strong>
          </div>

        </div>

        {/* DANGER ZONE / DELETE ACCOUNT SECTION */}
        <div style={{
          borderTop: '1px solid #e2e8f0',
          paddingTop: '1.5rem',
          marginTop: '0.5rem'
        }}>
          <div style={{
            background: '#fff5f5',
            border: '1.5px solid #fed7d7',
            borderRadius: '12px',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: '#fee2e2',
                color: '#dc2626',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Trash2 size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#991b1b', margin: '0 0 0.25rem' }}>
                  Delete Account
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#7f1d1d', margin: 0, lineHeight: '1.5' }}>
                  Permanently remove your account, profile data, and login access from VillageVision AI. This action cannot be reversed.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="btn"
                onClick={() => {
                  setConfirmInput('');
                  setDeleteError('');
                  setShowConfirmModal(true);
                }}
                style={{
                  background: '#dc2626',
                  color: '#ffffff',
                  fontSize: '0.88rem',
                  padding: '0.65rem 1.25rem',
                  borderRadius: '10px',
                  fontWeight: 700,
                  boxShadow: '0 2px 8px rgba(220, 38, 38, 0.25)'
                }}
              >
                <Trash2 size={16} />
                <span>Delete My Account</span>
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* CONFIRMATION MODAL */}
      {showConfirmModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1rem'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            maxWidth: '460px',
            width: '100%',
            padding: '2rem',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
            border: '1px solid #e2e8f0',
            textAlign: 'center'
          }}>
            
            <div style={{
              width: '56px',
              height: '56px',
              background: '#fee2e2',
              borderRadius: '50%',
              color: '#dc2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem'
            }}>
              <AlertTriangle size={28} />
            </div>

            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
              Confirm Account Deletion
            </h2>

            <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: '1.5', marginBottom: '1.25rem' }}>
              Are you sure you want to delete your account for <strong style={{ color: '#0f172a' }}>{identifier}</strong>? All your login access and credentials will be removed.
            </p>

            {deleteError && (
              <div style={{
                background: '#fee2e2',
                color: '#991b1b',
                padding: '0.75rem',
                borderRadius: '8px',
                fontSize: '0.85rem',
                marginBottom: '1rem'
              }}>
                {deleteError}
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowConfirmModal(false)}
                disabled={isDeleting}
                style={{ flex: 1, justifyContent: 'center', padding: '0.75rem' }}
              >
                <span>Cancel / Keep Account</span>
              </button>

              <button
                type="button"
                className="btn"
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  padding: '0.75rem',
                  background: '#dc2626',
                  color: '#ffffff',
                  fontWeight: 700
                }}
              >
                <Trash2 size={16} />
                <span>{isDeleting ? "Deleting..." : "Yes, Delete"}</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
