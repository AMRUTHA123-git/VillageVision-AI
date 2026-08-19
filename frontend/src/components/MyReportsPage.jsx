import React, { useState, useEffect } from 'react';
import { FileText, Search, MapPin, Clock, CheckCircle2, AlertCircle, PlusCircle } from 'lucide-react';
import { getStoredIssues } from '../utils/issueData';

export default function MyReportsPage({ user, onNavigate }) {
  const [myIssues, setMyIssues] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const all = getStoredIssues();
    const currentName = (user?.fullName || '').toLowerCase().trim();
    // Filter issues reported by this user or user's role
    const mine = all.filter(i => {
      if (!user) return true;
      const reporter = (i.reportedBy || '').toLowerCase().trim();
      return reporter === currentName || reporter.includes(currentName) || i.reportedByRole === user.role;
    });
    setMyIssues(mine);
  }, [user]);

  const filtered = myIssues.filter(item => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return `${item.id} ${item.category} ${item.description} ${item.village} ${item.area}`.toLowerCase().includes(q);
  });

  return (
    <div className="my-reports-wrapper">
      
      {/* HEADER */}
      <div className="dash-card-header" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h1 className="hero-title" style={{ fontSize: '2rem', textAlign: 'left', marginBottom: '0.25rem' }}>
            My <span className="gradient-text">Reported Issues</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.98rem' }}>
            Track the verification, status updates, and resolution of issues you submitted.
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
            placeholder="Search my reports by title, ID, village..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* MY REPORTS LIST */}
      {filtered.length === 0 ? (
        <div className="dash-card empty-state-box">
          <FileText size={40} style={{ color: 'var(--primary-teal)', margin: '0 auto 0.85rem' }} />
          <h3>No reports found</h3>
          <p style={{ marginTop: '0.4rem', marginBottom: '1.25rem' }}>You have not submitted any reports matching this search.</p>
          <button className="btn btn-primary btn-sm" onClick={() => onNavigate('report-issue')}>
            <PlusCircle size={16} /> Submit Your First Report
          </button>
        </div>
      ) : (
        <div className="pending-cards-grid">
          {filtered.map((item) => (
            <div key={item.id} className="authority-issue-card">
              <div className="authority-card-top">
                <div>
                  <span className={`priority-tag ${item.priority.toLowerCase()}`}>
                    {item.priority} Priority
                  </span>
                  <h4 className="issue-card-title">{item.category}</h4>
                </div>
                <code className="id-code">{item.id}</code>
              </div>

              <div className="issue-meta-row" style={{ marginTop: '0.5rem' }}>
                <span><MapPin size={14} /> Location: <strong>{item.area}, {item.village}</strong></span>
                <span>District & State: <strong>{item.district}, {item.state}</strong></span>
                <span>Submitted on: {item.date}</span>
              </div>

              <p className="issue-desc">{item.description}</p>

              <div style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className={`status-pill ${item.status.toLowerCase().replace(/\s+/g, '-')}`}>
                  {item.status}
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Reported by You ({item.reportedByRole})
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
