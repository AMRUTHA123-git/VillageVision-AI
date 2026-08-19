import React from 'react';
import { User, Mail, Shield, CheckCircle2, Calendar, MapPin } from 'lucide-react';

export default function ProfilePage({ user }) {
  const fullName = user?.fullName || 'Authenticated User';
  const identifier = user?.identifier || 'user@example.com';
  const role = user?.role || 'Citizen';

  return (
    <div className="profile-wrapper">
      
      {/* HEADER */}
      <div className="dash-card-header" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h1 className="hero-title" style={{ fontSize: '2rem', textAlign: 'left', marginBottom: '0.25rem' }}>
            User <span className="gradient-text">Profile</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.98rem' }}>
            Your authenticated account details and fixed stakeholder credentials.
          </p>
        </div>
        <span className="badge-tag">Role Security Verified</span>
      </div>

      {/* PROFILE CARD */}
      <div className="dash-card" style={{ maxWidth: '640px', margin: '0 auto' }}>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1.25rem',
          paddingBottom: '1.5rem',
          borderBottom: '1px solid var(--border-color)',
          marginBottom: '1.5rem'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'var(--gradient-emerald)',
            color: '#041d1a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            fontWeight: 800
          }}>
            <User size={32} />
          </div>

          <div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff' }}>
              {fullName}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
              <span className="role-security-pill">
                <Shield size={14} /> {role}
              </span>
              <span style={{ fontSize: '0.82rem', color: 'var(--primary-teal)' }}>
                Role Locked
              </span>
            </div>
          </div>
        </div>

        {/* DETAILS GRID */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.85rem 1rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '10px' }}>
            <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <User size={16} /> Full Name
            </span>
            <strong style={{ color: '#ffffff' }}>{fullName}</strong>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.85rem 1rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '10px' }}>
            <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Mail size={16} /> Email / Phone Number
            </span>
            <strong style={{ color: '#ffffff' }}>{identifier}</strong>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.85rem 1rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '10px' }}>
            <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Shield size={16} /> Stakeholder Role
            </span>
            <strong style={{ color: 'var(--primary-teal)' }}>{role}</strong>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.85rem 1rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '10px' }}>
            <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={16} /> Member Since
            </span>
            <strong style={{ color: '#ffffff' }}>August 2026</strong>
          </div>

        </div>

      </div>

    </div>
  );
}
