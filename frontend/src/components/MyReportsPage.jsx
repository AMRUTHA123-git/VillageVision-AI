import React, { useState, useEffect } from 'react';
import { FileText, Search, MapPin, Clock, CheckCircle2, AlertCircle, PlusCircle, ImageOff } from 'lucide-react';
import { getStoredIssues, subscribeToIssueUpdates } from '../utils/issueData';

export default function MyReportsPage({ user, onNavigate }) {
  const [myIssues, setMyIssues] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const filterMyIssues = (all) => {
    const currentName = (user?.fullName || '').toLowerCase().trim();
    return all.filter(i => {
      if (!user) return true;
      const reporter = (i.reportedBy || '').toLowerCase().trim();
      return reporter === currentName || reporter.includes(currentName) || i.reportedByRole === user.role;
    });
  };

  useEffect(() => {
    const all = getStoredIssues();
    setMyIssues(filterMyIssues(all));

    const unsubscribe = subscribeToIssueUpdates((latest) => {
      setMyIssues(filterMyIssues(latest));
    });

    return () => {
      unsubscribe();
    };
  }, [user]);

  const filtered = myIssues.filter(item => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return `${item.id} ${item.category} ${item.description} ${item.village} ${item.area} ${item.adoptedBy || ''}`.toLowerCase().includes(q);
  });

  return (
    <div className="my-reports-wrapper">
      
      {/* HEADER */}
      <div className="dash-card-header" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h1 className="hero-title" style={{ fontSize: '2rem', textAlign: 'left', marginBottom: '0.25rem' }}>
            My <span className="gradient-text">Reported Issues</span>
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.98rem' }}>
            Track the verification, status updates, and NGO adoptions of civic issues you submitted.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => onNavigate('report-issue')}>
          <PlusCircle size={18} /> Report New Issue
        </button>
      </div>

      {/* SEARCH BAR */}
      <div className="dash-card" style={{ marginBottom: '1.5rem', padding: '1.25rem 1.5rem' }}>
        <div className="input-wrapper">
          <Search size={18} className="field-icon" />
          <input
            type="text"
            className="form-input"
            placeholder="Search my reports by title, ID, village, NGO..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* MY REPORTS LIST */}
      {filtered.length === 0 ? (
        <div className="dash-card empty-state-box">
          <FileText size={40} style={{ color: '#059669', margin: '0 auto 0.85rem' }} />
          <h3 style={{ color: '#0f172a', fontWeight: 800 }}>No reports found</h3>
          <p style={{ marginTop: '0.4rem', marginBottom: '1.25rem', color: '#64748b' }}>You have not submitted any reports matching this search.</p>
          <button className="btn btn-primary btn-sm" onClick={() => onNavigate('report-issue')}>
            <PlusCircle size={16} /> Submit Your First Report
          </button>
        </div>
      ) : (
        <div className="pending-cards-grid">
          {filtered.map((item) => (
            <div key={item.id} className="authority-issue-card" style={{ background: '#ffffff', border: '1.5px solid #e2e8f0', borderRadius: '18px', padding: '1.35rem' }}>
              <div className="authority-card-top">
                <div>
                  <span className={`priority-tag ${item.priority.toLowerCase()}`}>
                    {item.priority} Priority
                  </span>
                  <h4 className="issue-card-title">{item.category}</h4>
                </div>
                <code className="id-code">{item.id}</code>
              </div>

              {/* Photo Preview */}
              {item.photo ? (
                <div style={{ margin: '0.75rem 0', borderRadius: '10px', overflow: 'hidden', height: '140px', background: '#0f172a' }}>
                  <img src={item.photo} alt={item.category} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ) : (
                <div style={{ margin: '0.75rem 0', borderRadius: '10px', background: '#f8fafc', border: '1px dashed #e2e8f0', padding: '0.5rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.78rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}>
                  <ImageOff size={14} /> No photo available
                </div>
              )}

              <div className="issue-meta-row" style={{ marginTop: '0.5rem' }}>
                <span><MapPin size={14} /> Location: <strong>{item.area}, {item.village}</strong></span>
                <span>District & State: <strong>Visakhapatnam, Andhra Pradesh</strong></span>
                <span>Submitted on: {item.date} {item.time ? `(${item.time})` : ''}</span>
              </div>

              <p className="issue-desc" style={{ color: '#334155', fontSize: '0.88rem', lineHeight: '1.5', margin: '0.65rem 0' }}>{item.description}</p>

              {/* ADOPTION INFO FOR CITIZEN */}
              {item.adopted && (
                <div style={{ background: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: '10px', padding: '0.75rem 1rem', margin: '0.75rem 0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#16a34a', fontWeight: 800, fontSize: '0.88rem', marginBottom: '0.2rem' }}>
                    <CheckCircle2 size={16} /> Adopted by NGO / Volunteer
                  </div>
                  <div style={{ fontSize: '0.84rem', color: '#15803d', fontWeight: 700 }}>
                    Adopted by: {item.adoptedBy}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.15rem' }}>
                    Adopted on: {item.adoptedDate} at {item.adoptedTime}
                  </div>
                </div>
              )}

              <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className={`status-pill ${item.status.toLowerCase().replace(/\s+/g, '-')}`}>
                  {item.status}
                </span>
                <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>
                  Reported by You ({item.reportedByRole || 'Citizen'})
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
