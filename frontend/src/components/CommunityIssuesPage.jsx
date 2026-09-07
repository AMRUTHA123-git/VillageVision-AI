import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Search, 
  Hash, 
  AlertCircle, 
  Info,
  Calendar,
  Clock,
  User,
  CheckCircle2,
  Construction,
  Droplets,
  Zap,
  Trash2,
  Building,
  HeartPulse,
  Bus,
  ShieldAlert,
  ArrowLeft,
  ImageOff,
  Compass,
  FileText,
  Tag,
  Target,
  Check,
  X
} from 'lucide-react';
import { 
  getStoredIssues, 
  filterIssues, 
  VISAKHAPATNAM_VILLAGES, 
  adoptIssue, 
  subscribeToIssueUpdates 
} from '../utils/issueData';

export default function CommunityIssuesPage({ user }) {
  const [issues, setIssues] = useState([]);
  const [selectedVillage, setSelectedVillage] = useState('All Villages / Areas');
  const [searchQuery, setSearchQuery] = useState('');
  const [pincodeQuery, setPincodeQuery] = useState('');
  const [pincodeError, setPincodeError] = useState('');
  const [selectedIssue, setSelectedIssue] = useState(null);

  // Adoption Modal & Feedback State
  const [confirmingAdoptIssue, setConfirmingAdoptIssue] = useState(null);
  const [adoptionSuccessMessage, setAdoptionSuccessMessage] = useState('');
  const [adoptionErrorMessage, setAdoptionErrorMessage] = useState('');

  const isNGOUser = user?.role === 'NGO' || user?.role === 'NGO / Volunteer' || user?.role === 'Volunteer';

  useEffect(() => {
    // Initial load
    setIssues(getStoredIssues());

    // Subscribe to real-time events & storage changes across sessions/tabs
    const unsubscribe = subscribeToIssueUpdates((latestIssues) => {
      setIssues(latestIssues);
      setSelectedIssue(prev => {
        if (!prev) return null;
        return latestIssues.find(i => i.id === prev.id) || prev;
      });
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Category Icon Helper
  const getCategoryIcon = (category, size = 18) => {
    switch (category) {
      case 'Road Damage':
        return <Construction size={size} style={{ color: '#ea580c' }} />;
      case 'Water Leakage':
      case 'Water Supply':
      case 'Drainage Problem':
        return <Droplets size={size} style={{ color: '#0284c7' }} />;
      case 'Broken Streetlight':
      case 'Electricity Problem':
        return <Zap size={size} style={{ color: '#d97706' }} />;
      case 'Garbage Overflow':
      case 'Sanitation':
        return <Trash2 size={size} style={{ color: '#16a34a' }} />;
      case 'Healthcare Facility':
      case 'Healthcare':
        return <HeartPulse size={size} style={{ color: '#dc2626' }} />;
      case 'Transportation':
        return <Bus size={size} style={{ color: '#6366f1' }} />;
      default:
        return <Building size={size} style={{ color: '#059669' }} />;
    }
  };

  // Priority Visual Dot Helper
  const getPriorityBadge = (priority) => {
    const p = (priority || 'Medium').toLowerCase();
    if (p === 'high') {
      return (
        <span className="priority-tag high" style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontWeight: 700 }}>
          🔴 High Priority
        </span>
      );
    }
    if (p === 'medium') {
      return (
        <span className="priority-tag medium" style={{ background: '#fefce8', color: '#ca8a04', border: '1px solid #fef08a', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontWeight: 700 }}>
          🟡 Medium Priority
        </span>
      );
    }
    return (
      <span className="priority-tag low" style={{ background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontWeight: 700 }}>
        🟢 Low Priority
      </span>
    );
  };

  // Status Badge Helper
  const getStatusBadge = (status) => {
    const s = (status || 'Open').toLowerCase().replace(/\s+/g, '-');
    return (
      <span className={`status-pill ${s}`}>
        {status}
      </span>
    );
  };

  // Pincode Input Handler
  const handlePincodeChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
    setPincodeQuery(val);

    if (val.length > 0 && val.length < 6) {
      setPincodeError('Please enter a valid 6-digit pincode.');
    } else {
      setPincodeError('');
    }
  };

  // Open confirmation modal for Adoption
  const handleAdoptClick = (issue, e) => {
    if (e) e.stopPropagation();
    setAdoptionErrorMessage('');
    setAdoptionSuccessMessage('');
    setConfirmingAdoptIssue(issue);
  };

  // Execute atomic adoption
  const handleConfirmAdopt = () => {
    if (!confirmingAdoptIssue) return;

    const res = adoptIssue(confirmingAdoptIssue.id, user);

    if (res.success) {
      setAdoptionSuccessMessage(`✓ Issue ${confirmingAdoptIssue.id} successfully adopted by ${user?.fullName || 'you'}!`);
      if (selectedIssue && selectedIssue.id === confirmingAdoptIssue.id) {
        setSelectedIssue(res.issue);
      }
      setConfirmingAdoptIssue(null);
      setTimeout(() => {
        setAdoptionSuccessMessage('');
      }, 5000);
    } else {
      setAdoptionErrorMessage(res.error || 'Failed to adopt issue. It may have already been adopted.');
      setConfirmingAdoptIssue(null);
    }
  };

  // Compute filtered issues
  const filteredIssues = filterIssues(issues, {
    village: selectedVillage === 'All Villages / Areas' ? '' : selectedVillage,
    pincode: pincodeQuery.length === 6 ? pincodeQuery : '',
    search: searchQuery
  });

  const isPincodeFilterActive = pincodeQuery.length === 6;
  const noPincodeMatch = isPincodeFilterActive && filteredIssues.length === 0;
  const displayIssues = noPincodeMatch ? issues : filteredIssues;

  // =============================================================
  // SINGLE ISSUE DETAILS VIEW
  // =============================================================
  if (selectedIssue) {
    return (
      <div className="community-issues-wrapper">
        
        {/* BACK BUTTON & NAVIGATION BAR */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => {
              setSelectedIssue(null);
              setAdoptionSuccessMessage('');
              setAdoptionErrorMessage('');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}
          >
            <ArrowLeft size={16} /> &larr; Back to Community Issues
          </button>

          <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
            Visakhapatnam &rsaquo; {selectedIssue.village} &rsaquo; <strong>{selectedIssue.id}</strong>
          </span>
        </div>

        {/* NOTIFICATION FEEDBACK BANNERS */}
        {adoptionSuccessMessage && (
          <div className="info-alert-box" style={{ background: '#f0fdf4', border: '1.5px solid #86efac', color: '#166534', marginBottom: '1.25rem' }}>
            <CheckCircle2 size={18} />
            <span>{adoptionSuccessMessage}</span>
          </div>
        )}

        {adoptionErrorMessage && (
          <div className="info-alert-box" style={{ background: '#fef2f2', border: '1.5px solid #fecaca', color: '#991b1b', marginBottom: '1.25rem' }}>
            <AlertCircle size={18} />
            <span>{adoptionErrorMessage}</span>
          </div>
        )}

        {/* MAIN ISSUE DETAILS CARD */}
        <div className="dash-card" style={{ padding: '2rem', background: '#ffffff', border: '1.5px solid #e2e8f0', borderRadius: '20px' }}>
          
          {/* HEADER SECTION */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1.25rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                <span className="badge-tag" style={{ background: '#ecfdf5', color: '#047857', fontSize: '0.8rem' }}>
                  ISSUE DETAILS
                </span>
                <code className="id-code" style={{ fontSize: '0.9rem', background: '#f1f5f9', color: '#059669', padding: '0.25rem 0.6rem', borderRadius: '6px' }}>
                  {selectedIssue.id}
                </code>
                {getPriorityBadge(selectedIssue.priority)}
                {getStatusBadge(selectedIssue.status)}
              </div>
              <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                {getCategoryIcon(selectedIssue.category, 26)}
                {selectedIssue.category}
              </h1>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#059669', fontWeight: 700, fontSize: '0.92rem' }}>
                <MapPin size={16} /> 📍 {selectedIssue.village}, Visakhapatnam
              </div>
            </div>
          </div>

          {/* ADOPTION BANNER / ACTION */}
          {selectedIssue.adopted ? (
            <div style={{ background: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: '14px', padding: '1.25rem', marginBottom: '1.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#16a34a', fontWeight: 800, fontSize: '1.05rem', marginBottom: '0.5rem' }}>
                <CheckCircle2 size={20} /> ✓ Adopted Community Issue
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem', color: '#166534', fontSize: '0.92rem' }}>
                <div>Adopted by: <strong>{selectedIssue.adoptedBy}</strong></div>
                <div>Adopted on: <strong>{selectedIssue.adoptedDate}</strong></div>
                <div>Adopted at: <strong>{selectedIssue.adoptedTime}</strong></div>
                <div>Status: <span className="status-pill in-progress">Adopted</span></div>
              </div>
            </div>
          ) : (
            isNGOUser && (
              <div style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '14px', padding: '1.25rem', marginBottom: '1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h4 style={{ margin: '0 0 0.25rem', color: '#0f172a', fontWeight: 800, fontSize: '1.05rem' }}>
                    Adopt this Community Issue
                  </h4>
                  <p style={{ margin: 0, color: '#64748b', fontSize: '0.88rem' }}>
                    Take ownership as an NGO / Volunteer organization to coordinate community action and resources.
                  </p>
                </div>
                <button 
                  className="btn btn-primary"
                  onClick={() => handleAdoptClick(selectedIssue)}
                  style={{ background: '#059669', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <Target size={18} /> Adopt Issue
                </button>
              </div>
            )
          )}

          {/* LARGE ISSUE PHOTO SECTION */}
          <div style={{ marginBottom: '1.75rem' }}>
            <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#64748b', fontWeight: 800, marginBottom: '0.6rem' }}>
              Problem Photo
            </h4>
            {selectedIssue.photo ? (
              <div style={{ width: '100%', maxHeight: '420px', borderRadius: '16px', overflow: 'hidden', border: '1.5px solid #e2e8f0', background: '#0f172a' }}>
                <img 
                  src={selectedIssue.photo} 
                  alt={selectedIssue.category} 
                  style={{ width: '100%', height: '100%', maxHeight: '420px', objectFit: 'contain', display: 'block', margin: '0 auto' }} 
                />
              </div>
            ) : (
              <div style={{ background: '#f8fafc', border: '1.5px dashed #cbd5e1', borderRadius: '14px', padding: '2.5rem 1.5rem', textAlign: 'center', color: '#64748b' }}>
                <ImageOff size={38} style={{ color: '#94a3b8', margin: '0 auto 0.6rem', display: 'block' }} />
                <strong style={{ color: '#475569', fontSize: '0.95rem', display: 'block' }}>No photo available</strong>
                <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>The reporter did not attach an image for this issue report.</span>
              </div>
            )}
          </div>

          {/* FULL DESCRIPTION */}
          <div style={{ marginBottom: '1.75rem' }}>
            <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#64748b', fontWeight: 800, marginBottom: '0.5rem' }}>
              Full Description
            </h4>
            <div style={{ background: '#f8fafc', padding: '1.2rem 1.4rem', borderRadius: '14px', border: '1px solid #e2e8f0', color: '#334155', fontSize: '0.98rem', lineHeight: '1.6' }}>
              {selectedIssue.description || 'No detailed description provided.'}
            </div>
          </div>

          {/* DETAILED ATTRIBUTES GRID */}
          <div>
            <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#64748b', fontWeight: 800, marginBottom: '0.75rem' }}>
              Location & Reporting Details
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
              
              {/* Village */}
              <div style={{ background: '#f8fafc', padding: '0.9rem 1.1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, display: 'block', marginBottom: '0.2rem' }}>
                  📍 Village / Area
                </span>
                <strong style={{ fontSize: '1rem', color: '#0f172a' }}>{selectedIssue.village}</strong>
              </div>

              {/* Area / Street */}
              <div style={{ background: '#f8fafc', padding: '0.9rem 1.1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, display: 'block', marginBottom: '0.2rem' }}>
                  📌 Area / Street
                </span>
                <strong style={{ fontSize: '1rem', color: '#0f172a' }}>{selectedIssue.area}</strong>
              </div>

              {/* Pincode */}
              <div style={{ background: '#f8fafc', padding: '0.9rem 1.1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, display: 'block', marginBottom: '0.2rem' }}>
                  📮 Pincode
                </span>
                <strong style={{ fontSize: '1rem', color: '#059669', fontFamily: 'monospace' }}>{selectedIssue.pincode || '531163'}</strong>
              </div>

              {/* Date */}
              <div style={{ background: '#f8fafc', padding: '0.9rem 1.1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, display: 'block', marginBottom: '0.2rem' }}>
                  📅 Date
                </span>
                <strong style={{ fontSize: '0.95rem', color: '#0f172a' }}>{selectedIssue.date}</strong>
              </div>

              {/* Time */}
              <div style={{ background: '#f8fafc', padding: '0.9rem 1.1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, display: 'block', marginBottom: '0.2rem' }}>
                  🕐 Time
                </span>
                <strong style={{ fontSize: '0.95rem', color: '#059669' }}>{selectedIssue.time || '10:30 AM'}</strong>
              </div>

              {/* Priority */}
              <div style={{ background: '#f8fafc', padding: '0.9rem 1.1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, display: 'block', marginBottom: '0.2rem' }}>
                  Priority
                </span>
                <strong style={{ fontSize: '0.95rem', color: selectedIssue.priority === 'High' ? '#dc2626' : selectedIssue.priority === 'Medium' ? '#ca8a04' : '#16a34a' }}>
                  {selectedIssue.priority} Priority
                </strong>
              </div>

              {/* Current Status */}
              <div style={{ background: '#f8fafc', padding: '0.9rem 1.1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, display: 'block', marginBottom: '0.2rem' }}>
                  Current Status
                </span>
                <strong style={{ fontSize: '0.95rem', color: '#0f172a' }}>{selectedIssue.status}</strong>
              </div>

              {/* Reported By */}
              <div style={{ background: '#f8fafc', padding: '0.9rem 1.1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, display: 'block', marginBottom: '0.2rem' }}>
                  👤 Reported By
                </span>
                <strong style={{ fontSize: '0.95rem', color: '#0f172a' }}>
                  {selectedIssue.reportedBy} ({selectedIssue.reportedByRole || 'Citizen'})
                </strong>
              </div>

              {/* GPS Coordinates */}
              <div style={{ background: '#f8fafc', padding: '0.9rem 1.1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, display: 'block', marginBottom: '0.2rem' }}>
                  🌐 GPS Coordinates
                </span>
                <strong style={{ fontSize: '0.92rem', color: '#475569', fontFamily: 'monospace' }}>
                  {selectedIssue.latitude ? `${selectedIssue.latitude.toFixed(4)}, ${selectedIssue.longitude.toFixed(4)}` : '17.8912, 83.4542'}
                </strong>
              </div>

            </div>
          </div>

          {/* BACK BUTTON AT BOTTOM */}
          <div style={{ marginTop: '2rem', paddingTop: '1.25rem', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <button 
              className="btn btn-secondary"
              onClick={() => {
                setSelectedIssue(null);
                setAdoptionSuccessMessage('');
                setAdoptionErrorMessage('');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}
            >
              <ArrowLeft size={16} /> &larr; Back to Community Issues
            </button>

            {isNGOUser && !selectedIssue.adopted && (
              <button 
                className="btn btn-primary"
                onClick={() => handleAdoptClick(selectedIssue)}
                style={{ background: '#059669', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <Target size={18} /> Adopt Issue
              </button>
            )}
          </div>

        </div>

        {/* CONFIRMATION MODAL */}
        {confirmingAdoptIssue && (
          <div className="modal-backdrop" style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
            <div className="modal-box" style={{ background: '#ffffff', borderRadius: '18px', padding: '2rem', maxWidth: '480px', width: '100%', boxShadow: '0 20px 40px rgba(0,0,0,0.15)', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Target size={24} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                    Confirm Issue Adoption
                  </h3>
                  <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
                    {confirmingAdoptIssue.id} &bull; {confirmingAdoptIssue.category}
                  </span>
                </div>
              </div>

              <p style={{ color: '#334155', fontSize: '0.95rem', lineHeight: '1.5', marginBottom: '1.25rem' }}>
                Do you want to adopt this community issue?
              </p>

              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '0.9rem 1.1rem', marginBottom: '1.5rem', fontSize: '0.88rem' }}>
                <div style={{ color: '#0f172a', fontWeight: 700, marginBottom: '0.35rem' }}>
                  📍 {confirmingAdoptIssue.area}, {confirmingAdoptIssue.village}
                </div>
                <div style={{ color: '#64748b', fontSize: '0.82rem' }}>
                  Adopting Organization: <strong style={{ color: '#059669' }}>{user?.fullName || 'NGO / Volunteer Organization'}</strong>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button 
                  className="btn btn-secondary"
                  onClick={() => setConfirmingAdoptIssue(null)}
                  style={{ fontWeight: 700 }}
                >
                  Cancel
                </button>
                <button 
                  className="btn btn-primary"
                  onClick={handleConfirmAdopt}
                  style={{ background: '#059669', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <Check size={16} /> Confirm & Adopt Issue
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    );
  }

  // =============================================================
  // MAIN ISSUES LIST VIEW
  // =============================================================
  return (
    <div className="community-issues-wrapper">
      
      {/* 1. HEADER */}
      <div className="dash-card-header" style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="hero-title" style={{ fontSize: '1.85rem', textAlign: 'left', marginBottom: '0.25rem', color: '#0f172a' }}>
            COMMUNITY <span className="gradient-text">ISSUES</span>
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem', margin: 0 }}>
            Active civic grievances reported across Visakhapatnam &bull; Real-time synchronized
          </p>
        </div>

        {/* Fixed Location Badge */}
        <div style={{
          background: '#ecfdf5',
          border: '1.5px solid #a7f3d0',
          borderRadius: '9999px',
          padding: '0.5rem 1.15rem',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.45rem',
          color: '#047857',
          fontWeight: 800,
          fontSize: '0.9rem'
        }}>
          <MapPin size={16} style={{ color: '#059669' }} />
          <span>📍 Visakhapatnam, Andhra Pradesh</span>
        </div>
      </div>

      {/* NOTIFICATION FEEDBACK BANNERS */}
      {adoptionSuccessMessage && (
        <div className="info-alert-box" style={{ background: '#f0fdf4', border: '1.5px solid #86efac', color: '#166534', marginBottom: '1.25rem' }}>
          <CheckCircle2 size={18} />
          <span>{adoptionSuccessMessage}</span>
        </div>
      )}

      {adoptionErrorMessage && (
        <div className="info-alert-box" style={{ background: '#fef2f2', border: '1.5px solid #fecaca', color: '#991b1b', marginBottom: '1.25rem' }}>
          <AlertCircle size={18} />
          <span>{adoptionErrorMessage}</span>
        </div>
      )}

      {/* 2. SEARCH & LOCATION SECTION */}
      <div className="dash-card" style={{ marginBottom: '1.75rem', padding: '1.5rem', background: '#ffffff', border: '1px solid #e2e8f0' }}>
        
        <div className="dash-two-col" style={{ gridTemplateColumns: '1.2fr 2fr 1.2fr', gap: '1.25rem', alignItems: 'flex-start' }}>
          
          {/* Village / Area Dropdown */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="input-label-bold" htmlFor="village-filter">Village / Area</label>
            <select
              id="village-filter"
              className="form-input"
              value={selectedVillage}
              onChange={(e) => setSelectedVillage(e.target.value)}
              style={{ background: '#f8fafc' }}
            >
              <option value="All Villages / Areas">📍 All Villages / Areas</option>
              {VISAKHAPATNAM_VILLAGES.map((v) => (
                <option key={v} value={v}>📍 {v}</option>
              ))}
            </select>
          </div>

          {/* Main Search Input */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="input-label-bold" htmlFor="search-input">Search</label>
            <div className="input-wrapper">
              <Search size={18} className="field-icon" />
              <input
                id="search-input"
                type="text"
                className="form-input"
                placeholder="Search by issue, village, area, issue ID or pincode..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ background: '#f8fafc' }}
              />
            </div>
          </div>

          {/* Search by Pincode Input */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="input-label-bold" htmlFor="pincode-input">Search by Pincode</label>
            <div className="input-wrapper">
              <Hash size={18} className="field-icon" />
              <input
                id="pincode-input"
                type="text"
                className="form-input"
                placeholder="Enter 6-digit pincode"
                value={pincodeQuery}
                onChange={handlePincodeChange}
                maxLength={6}
                style={{ background: '#f8fafc' }}
              />
            </div>
            {pincodeError && (
              <span style={{ fontSize: '0.78rem', color: '#dc2626', fontWeight: 600, display: 'block', marginTop: '0.35rem' }}>
                {pincodeError}
              </span>
            )}
          </div>

        </div>

      </div>

      {/* 3. PINCODE NOT FOUND INLINE NOTICE */}
      {noPincodeMatch && (
        <div className="info-alert-box" style={{ marginBottom: '1.5rem', background: '#f0fdfa', border: '1.5px solid #99f6e4', color: '#0f766e' }}>
          <Info size={18} className="info-alert-icon" />
          <span>No issues reported for pincode <strong>{pincodeQuery}</strong> yet. Showing all available Visakhapatnam community issues below.</span>
        </div>
      )}

      {/* 4. COMMUNITY ISSUES LIST / CARDS */}
      <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
          Community Issues ({displayIssues.length})
        </h3>
        {selectedVillage !== 'All Villages / Areas' && (
          <span className="badge-tag" style={{ background: '#ecfdf5', color: '#047857' }}>
            Filtered: {selectedVillage}
          </span>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
        {displayIssues.map((issue) => (
          <div 
            key={issue.id} 
            className="authority-issue-card"
            style={{
              background: '#ffffff',
              border: '1.5px solid #e2e8f0',
              borderRadius: '18px',
              padding: '1.35rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.03)',
              transition: 'all 0.2s ease'
            }}
          >
            <div>
              {/* Card Top: Category, Icon & ID */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {getCategoryIcon(issue.category)}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                      {issue.category}
                    </h4>
                    <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                      Reported: {issue.date}, {issue.time || '10:30 AM'}
                    </span>
                  </div>
                </div>
                <code className="id-code" style={{ background: '#f1f5f9', color: '#059669', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '6px' }}>
                  {issue.id}
                </code>
              </div>

              {/* Photo Preview if attached */}
              {issue.photo ? (
                <div style={{ marginBottom: '0.75rem', borderRadius: '10px', overflow: 'hidden', height: '140px', background: '#0f172a' }}>
                  <img src={issue.photo} alt={issue.category} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ) : (
                <div style={{ marginBottom: '0.75rem', borderRadius: '10px', background: '#f8fafc', border: '1px dashed #e2e8f0', padding: '0.6rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.78rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}>
                  <ImageOff size={14} /> No photo available
                </div>
              )}

              {/* Short Description */}
              <p style={{ color: '#334155', fontSize: '0.88rem', lineHeight: '1.5', margin: '0 0 0.85rem' }}>
                {issue.description}
              </p>

              {/* Location Details: Village, Area, Pincode */}
              <div style={{ background: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: '10px', padding: '0.7rem 0.85rem', marginBottom: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.3rem', fontSize: '0.84rem' }}>
                <div style={{ color: '#0f172a', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <MapPin size={14} style={{ color: '#059669' }} /> 📍 {issue.village}, Visakhapatnam
                </div>
                <div style={{ color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>📌 {issue.area}</span>
                  {issue.pincode && (
                    <span style={{ fontFamily: 'monospace', color: '#059669', fontWeight: 700 }}>
                      📮 {issue.pincode}
                    </span>
                  )}
                </div>
              </div>

              {/* Adoption Information on Card if Adopted */}
              {issue.adopted && (
                <div style={{ background: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: '10px', padding: '0.65rem 0.85rem', marginBottom: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#16a34a', fontWeight: 800, fontSize: '0.85rem', marginBottom: '0.2rem' }}>
                    <CheckCircle2 size={15} /> ✓ Already Adopted
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#15803d', fontWeight: 700 }}>
                    Adopted by: {issue.adoptedBy}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.15rem' }}>
                    Adopted on: {issue.adoptedDate} at {issue.adoptedTime}
                  </div>
                </div>
              )}
            </div>

            {/* Card Footer: Priority Dot, Status Pill & Action Buttons */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9', marginBottom: '0.75rem' }}>
                <div>
                  {getPriorityBadge(issue.priority)}
                </div>
                <div>
                  {getStatusBadge(issue.status)}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <button 
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    setSelectedIssue(issue);
                    setAdoptionSuccessMessage('');
                    setAdoptionErrorMessage('');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  style={{ flex: 1, justifyContent: 'center', fontWeight: 700, fontSize: '0.82rem' }}
                >
                  View Details
                </button>

                {/* Show Adopt Issue button ONLY if unadopted AND user is NGO/Volunteer */}
                {isNGOUser && !issue.adopted && (
                  <button 
                    className="btn btn-primary btn-sm"
                    onClick={(e) => handleAdoptClick(issue, e)}
                    style={{ flex: 1, justifyContent: 'center', fontWeight: 700, fontSize: '0.82rem', background: '#059669' }}
                  >
                    <Target size={14} /> Adopt Issue
                  </button>
                )}

                {/* If adopted and not in details mode */}
                {issue.adopted && (
                  <span style={{ fontSize: '0.78rem', color: '#059669', fontWeight: 700, background: '#ecfdf5', padding: '0.35rem 0.6rem', borderRadius: '6px', border: '1px solid #a7f3d0' }}>
                    ✓ Adopted
                  </span>
                )}
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* CONFIRMATION MODAL */}
      {confirmingAdoptIssue && (
        <div className="modal-backdrop" style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div className="modal-box" style={{ background: '#ffffff', borderRadius: '18px', padding: '2rem', maxWidth: '480px', width: '100%', boxShadow: '0 20px 40px rgba(0,0,0,0.15)', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Target size={24} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                  Confirm Issue Adoption
                </h3>
                <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
                  {confirmingAdoptIssue.id} &bull; {confirmingAdoptIssue.category}
                </span>
              </div>
            </div>

            <p style={{ color: '#334155', fontSize: '0.95rem', lineHeight: '1.5', marginBottom: '1.25rem' }}>
              Do you want to adopt this community issue?
            </p>

            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '0.9rem 1.1rem', marginBottom: '1.5rem', fontSize: '0.88rem' }}>
              <div style={{ color: '#0f172a', fontWeight: 700, marginBottom: '0.35rem' }}>
                📍 {confirmingAdoptIssue.area}, {confirmingAdoptIssue.village}
              </div>
              <div style={{ color: '#64748b', fontSize: '0.82rem' }}>
                Adopting Organization: <strong style={{ color: '#059669' }}>{user?.fullName || 'NGO / Volunteer Organization'}</strong>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button 
                className="btn btn-secondary"
                onClick={() => setConfirmingAdoptIssue(null)}
                style={{ fontWeight: 700 }}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleConfirmAdopt}
                style={{ background: '#059669', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <Check size={16} /> Confirm & Adopt Issue
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
