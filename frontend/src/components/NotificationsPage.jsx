import React, { useState } from 'react';
import { Bell, CheckCircle2, AlertCircle, Info, Trash2 } from 'lucide-react';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'status', title: 'Report Status Updated', desc: 'Your Road Damage report (VV-1042) status was updated to "In Progress".', date: '2026-08-19 10:15 AM', read: false },
    { id: 2, type: 'alert', title: 'New Community Issue Near You', desc: 'A Water Leakage report was submitted in Sector 3, Gajuwaka.', date: '2026-08-18 04:30 PM', read: false },
    { id: 3, type: 'info', title: 'AI Hotspot Summary Ready', desc: 'Monthly AI trend analysis report for Visakhapatnam district is ready for review.', date: '2026-08-16 09:00 AM', read: true }
  ]);

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const toggleRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: !n.read } : n));
  };

  return (
    <div className="notifications-wrapper">
      
      {/* HEADER */}
      <div className="dash-card-header" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h1 className="hero-title" style={{ fontSize: '2rem', textAlign: 'left', marginBottom: '0.25rem' }}>
            Notification <span className="gradient-text">Center</span>
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.98rem' }}>
            Stay updated on issue verification, status changes, and community alerts.
          </p>
        </div>
        <button className="btn btn-outline btn-sm" onClick={markAllRead}>
          <CheckCircle2 size={16} /> Mark All as Read
        </button>
      </div>

      {/* NOTIFICATIONS LIST */}
      <div className="dash-card">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {notifications.map((n) => (
            <div 
              key={n.id}
              style={{
                background: n.read ? '#f8fafc' : '#ecfdf5',
                border: n.read ? '1.5px solid #e2e8f0' : '1.5px solid #a7f3d0',
                borderRadius: '14px',
                padding: '1.25rem',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: '1rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: n.read ? '#e2e8f0' : '#d1fae5',
                  color: n.read ? '#64748b' : '#059669',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Bell size={18} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.25rem' }}>
                    {n.title}
                  </h4>
                  <p style={{ fontSize: '0.9rem', color: '#334155', lineHeight: '1.5' }}>
                    {n.desc}
                  </p>
                  <span style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.4rem', display: 'block', fontWeight: 500 }}>
                    {n.date}
                  </span>
                </div>
              </div>

              <button 
                className="btn btn-outline btn-sm"
                onClick={() => toggleRead(n.id)}
                style={{ fontSize: '0.78rem' }}
              >
                {n.read ? "Mark Unread" : "Mark Read"}
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
