import React, { useState, useEffect } from 'react';
import DashboardLayout from './DashboardLayout';
import CommunityIssuesPage from '../CommunityIssuesPage';
import CommunityMapPage from '../CommunityMapPage';
import AIInsightsPage from '../AIInsightsPage';
import NotificationsPage from '../NotificationsPage';
import ProfilePage from '../ProfilePage';

import {
  HeartHandshake,
  Layers,
  Rocket,
  Map,
  Users2,
  Award,
  Bell,
  User,
  MapPin,
  Heart,
  TrendingUp,
  CheckCircle2,
  Clock,
  Target,
  ArrowRight,
  Plus,
  Check,
  XCircle,
  Sparkles,
  Calendar,
  ShieldCheck,
  Search,
  Filter,
  Briefcase,
  AlertCircle,
  ImageOff
} from 'lucide-react';

import { 
  getStoredIssues, 
  adoptIssue, 
  subscribeToIssueUpdates, 
  VISAKHAPATNAM_VILLAGES 
} from '../../utils/issueData';

export default function NGODashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [allIssues, setAllIssues] = useState([]);

  // Modal States
  const [activeModal, setActiveModal] = useState(null); // 'adopt' | 'new-drive'
  const [selectedIssueToAdopt, setSelectedIssueToAdopt] = useState(null);
  const [adoptNotification, setAdoptNotification] = useState('');

  // Form state for New Volunteer Drive
  const [driveTitle, setDriveTitle] = useState('');
  const [driveVillage, setDriveVillage] = useState('Bheemunipatnam');
  const [driveDate, setDriveDate] = useState('2026-09-15');
  const [driveTime, setDriveTime] = useState('8:00 AM - 12:00 PM');
  const [driveVolunteers, setDriveVolunteers] = useState(20);
  const [driveFocus, setDriveFocus] = useState('Sanitation & Community Cleanliness');

  // Active Volunteer Drives list
  const [volunteerDrives, setVolunteerDrives] = useState([
    {
      id: 'DRV-101',
      title: 'Bheemunipatnam Coastal & Drainage Cleanup',
      village: 'Bheemunipatnam',
      date: '2026-09-08',
      time: '7:00 AM - 11:00 AM',
      volunteersRegistered: 18,
      volunteersNeeded: 25,
      focus: 'Sanitation & Solid Waste Removal',
      status: 'Upcoming'
    },
    {
      id: 'DRV-102',
      title: 'Padmanabham School Library & Infrastructure Drive',
      village: 'Padmanabham',
      date: '2026-09-12',
      time: '9:00 AM - 2:00 PM',
      volunteersRegistered: 12,
      volunteersNeeded: 15,
      focus: 'Education & Facility Painting',
      status: 'Upcoming'
    }
  ]);

  // Real-time synchronization with localStorage across sessions/tabs
  useEffect(() => {
    setAllIssues(getStoredIssues());

    const unsubscribe = subscribeToIssueUpdates((latestIssues) => {
      setAllIssues(latestIssues);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <HeartHandshake size={18} /> },
    { id: 'community-issues', label: 'Community Issues', icon: <Layers size={18} /> },
    { id: 'adopted-issues', label: 'Adopted Issues', icon: <Target size={18} /> },
    { id: 'map', label: 'Community Map', icon: <Map size={18} /> },
    { id: 'impact', label: 'AI Insights', icon: <Award size={18} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
    { id: 'profile', label: 'Profile', icon: <User size={18} /> }
  ];

  // Calculated Metrics
  const totalIssuesCount = allIssues.length;
  const openIssues = allIssues.filter(issue => issue.status === 'Open' || (!issue.status && !issue.adopted));
  const highPriorityIssues = allIssues.filter(issue => (issue.priority || '').toLowerCase() === 'high' && issue.status !== 'Resolved');
  const adoptedIssues = allIssues.filter(issue => issue.adopted === true);

  // Quick Adopt Handler
  const handleOpenAdoptModal = (issue) => {
    setSelectedIssueToAdopt(issue);
    setActiveModal('adopt');
  };

  const handleConfirmAdopt = (e) => {
    if (e) e.preventDefault();
    if (!selectedIssueToAdopt) return;

    const res = adoptIssue(selectedIssueToAdopt.id, user);

    if (res.success) {
      setAdoptNotification(`✓ Successfully adopted issue ${selectedIssueToAdopt.id}!`);
      setActiveModal(null);
      setSelectedIssueToAdopt(null);
      setTimeout(() => setAdoptNotification(''), 4000);
    } else {
      alert(res.error || 'Failed to adopt issue.');
      setActiveModal(null);
      setSelectedIssueToAdopt(null);
    }
  };

  // Volunteer Drive Creation
  const handleCreateDrive = (e) => {
    e.preventDefault();
    const newDrive = {
      id: `DRV-${Date.now().toString().slice(-3)}`,
      title: driveTitle.trim() || 'Community Action Drive',
      village: driveVillage,
      date: driveDate,
      time: driveTime,
      volunteersRegistered: 1,
      volunteersNeeded: Number(driveVolunteers) || 15,
      focus: driveFocus,
      status: 'Upcoming'
    };

    setVolunteerDrives([newDrive, ...volunteerDrives]);
    setActiveModal(null);
    setDriveTitle('');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'community-issues':
        return <CommunityIssuesPage user={user} />;

      case 'map':
        return <CommunityMapPage />;

      case 'impact':
      case 'insights':
        return <AIInsightsPage />;

      case 'notifications':
        return <NotificationsPage />;

      case 'profile':
        return <ProfilePage user={user} onLogout={onLogout} />;

      // -------------------------------------------------------------
      // ADOPTED ISSUES TAB
      // -------------------------------------------------------------
      case 'adopted-issues':
      case 'adopted-initiatives':
        return (
          <div>
            <div className="dash-card-header" style={{ marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h1 className="hero-title" style={{ fontSize: '1.85rem', textAlign: 'left', marginBottom: '0.25rem', color: '#0f172a' }}>
                  Adopted <span className="gradient-text">Community Issues</span>
                </h1>
                <p style={{ color: '#64748b', fontSize: '0.95rem', margin: 0 }}>
                  Civic problems adopted and actively supported by NGO / Volunteer organizations across Visakhapatnam.
                </p>
              </div>
              <button className="btn btn-primary btn-sm" onClick={() => setActiveTab('community-issues')}>
                <Plus size={16} /> Adopt More Issues
              </button>
            </div>

            {adoptedIssues.length === 0 ? (
              <div className="dash-card empty-state-box" style={{ padding: '3.5rem 2rem', textAlign: 'center' }}>
                <Target size={48} style={{ color: '#059669', margin: '0 auto 1rem' }} />
                <h3 style={{ color: '#0f172a', fontWeight: 800, fontSize: '1.25rem' }}>No Adopted Issues Yet</h3>
                <p style={{ color: '#64748b', marginTop: '0.4rem', maxWidth: '460px', margin: '0.4rem auto 1.5rem' }}>
                  Explore open grievances reported by citizens in Visakhapatnam to adopt and coordinate community interventions.
                </p>
                <button className="btn btn-primary" onClick={() => setActiveTab('community-issues')}>
                  <Layers size={18} /> Explore Community Issues
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
                {adoptedIssues.map(issue => (
                  <div 
                    key={issue.id}
                    className="dash-card"
                    style={{
                      background: '#ffffff',
                      border: '1.5px solid #e2e8f0',
                      borderRadius: '18px',
                      padding: '1.35rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      boxShadow: '0 4px 14px rgba(0,0,0,0.03)'
                    }}
                  >
                    <div>
                      {/* Top Header */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.65rem' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                            <span className="badge-tag" style={{ background: '#ecfdf5', color: '#047857' }}>
                              {issue.category}
                            </span>
                            <span className={`priority-tag ${(issue.priority || 'medium').toLowerCase()}`}>
                              {issue.priority} Priority
                            </span>
                          </div>
                          <code className="id-code" style={{ fontSize: '0.85rem' }}>{issue.id}</code>
                        </div>
                        <span className="status-pill in-progress">
                          {issue.status || 'Adopted'}
                        </span>
                      </div>

                      {/* Photo Preview */}
                      {issue.photo ? (
                        <div style={{ marginBottom: '0.75rem', borderRadius: '10px', overflow: 'hidden', height: '140px', background: '#0f172a' }}>
                          <img src={issue.photo} alt={issue.category} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                      ) : (
                        <div style={{ marginBottom: '0.75rem', borderRadius: '10px', background: '#f8fafc', border: '1px dashed #e2e8f0', padding: '0.6rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.78rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}>
                          <ImageOff size={14} /> No photo available
                        </div>
                      )}

                      {/* Description */}
                      <p style={{ color: '#334155', fontSize: '0.88rem', lineHeight: '1.5', margin: '0 0 0.85rem' }}>
                        {issue.description}
                      </p>

                      {/* Location Details */}
                      <div style={{ background: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: '10px', padding: '0.7rem 0.85rem', marginBottom: '0.85rem', fontSize: '0.84rem' }}>
                        <div style={{ color: '#0f172a', fontWeight: 700, marginBottom: '0.2rem' }}>
                          📍 {issue.village}, Visakhapatnam
                        </div>
                        <div style={{ color: '#64748b', display: 'flex', justifyContent: 'space-between' }}>
                          <span>📌 {issue.area}</span>
                          {issue.pincode && <span style={{ fontFamily: 'monospace', color: '#059669', fontWeight: 700 }}>📮 {issue.pincode}</span>}
                        </div>
                      </div>

                      {/* Adoption Metadata Box */}
                      <div style={{ background: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: '10px', padding: '0.75rem 0.9rem', marginBottom: '0.85rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#16a34a', fontWeight: 800, fontSize: '0.85rem', marginBottom: '0.2rem' }}>
                          <CheckCircle2 size={15} /> Adopted by: {issue.adoptedBy}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#166534' }}>
                          📅 Adopted on: <strong>{issue.adoptedDate}</strong> at <strong>{issue.adoptedTime}</strong>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem', display: 'flex', justifyContent: 'flex-end' }}>
                      <button 
                        className="btn btn-secondary btn-sm"
                        onClick={() => setActiveTab('community-issues')}
                        style={{ width: '100%', justifyContent: 'center', fontWeight: 700 }}
                      >
                        View in Community Issues &rarr;
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      // -------------------------------------------------------------
      // NGO DASHBOARD HOME (OVERVIEW)
      // -------------------------------------------------------------
      case 'dashboard':
      default:
        return (
          <>
            {/* HERO WELCOME STRIP */}
            <div
              className="dash-card"
              style={{
                marginBottom: '1.75rem',
                background: 'linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%)',
                border: '1.5px solid #a7f3d0'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <span className="badge-tag" style={{ background: '#d1fae5', color: '#065f46', marginBottom: '0.4rem' }}>
                    🌱 Visakhapatnam NGO Impact Center
                  </span>
                  <h1 className="hero-title" style={{ fontSize: '1.85rem', textAlign: 'left', marginBottom: '0.35rem', color: '#065f46' }}>
                    Welcome, <span className="gradient-text">{user?.fullName || 'NGO / Volunteer'}</span>
                  </h1>
                  <p style={{ color: '#166534', fontSize: '0.94rem', margin: 0 }}>
                    Monitor community grievances reported by citizens across Visakhapatnam, adopt issues, and drive civic solutions.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '0.6rem' }}>
                  <button className="btn btn-primary btn-sm" onClick={() => setActiveTab('community-issues')}>
                    <Heart size={16} /> Browse Problems to Adopt
                  </button>
                </div>
              </div>
            </div>

            {/* ADOPT NOTIFICATION BANNER */}
            {adoptNotification && (
              <div className="info-alert-box" style={{ background: '#f0fdf4', border: '1.5px solid #86efac', color: '#166534', marginBottom: '1.5rem' }}>
                <CheckCircle2 size={18} />
                <span>{adoptNotification}</span>
              </div>
            )}

            {/* 4 REQUIRED SUMMARY CARDS */}
            <div className="dash-stats-grid" style={{ marginBottom: '1.75rem' }}>
              
              {/* 1. Total Community Issues */}
              <div className="dash-stat-card" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('community-issues')}>
                <div className="stat-icon-wrapper blue"><Layers size={22} /></div>
                <div>
                  <div className="dash-stat-val">{totalIssuesCount}</div>
                  <div className="dash-stat-lbl">Total Community Issues</div>
                </div>
              </div>

              {/* 2. Open Issues */}
              <div className="dash-stat-card" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('community-issues')}>
                <div className="stat-icon-wrapper orange"><Clock size={22} /></div>
                <div>
                  <div className="dash-stat-val">{openIssues.length}</div>
                  <div className="dash-stat-lbl">Open Issues</div>
                </div>
              </div>

              {/* 3. High Priority Issues */}
              <div className="dash-stat-card" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('community-issues')}>
                <div className="stat-icon-wrapper red" style={{ background: '#fef2f2', color: '#dc2626' }}><AlertCircle size={22} /></div>
                <div>
                  <div className="dash-stat-val">{highPriorityIssues.length}</div>
                  <div className="dash-stat-lbl">High Priority Issues</div>
                </div>
              </div>

              {/* 4. Adopted Issues */}
              <div className="dash-stat-card" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('adopted-issues')}>
                <div className="stat-icon-wrapper green"><Target size={22} /></div>
                <div>
                  <div className="dash-stat-val">{adoptedIssues.length}</div>
                  <div className="dash-stat-lbl">Adopted Issues</div>
                </div>
              </div>

            </div>

            {/* TWO COLUMN WORKSPACE */}
            <div className="dash-two-col" style={{ gridTemplateColumns: '1.4fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
              
              {/* PROBLEMS NEEDING NGO SUPPORT */}
              <div className="dash-card">
                <div className="dash-card-header" style={{ marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Heart size={18} style={{ color: '#059669' }} />
                      Problems Needing NGO Support
                    </h3>
                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Open citizen grievances in Visakhapatnam</span>
                  </div>
                  <button className="btn btn-outline btn-sm" onClick={() => setActiveTab('community-issues')}>
                    View All <ArrowRight size={14} />
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {openIssues.filter(i => !i.adopted).slice(0, 4).map(issue => (
                    <div
                      key={issue.id}
                      style={{
                        background: '#f8fafc',
                        border: '1.5px solid #e2e8f0',
                        borderRadius: '12px',
                        padding: '0.9rem 1.1rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '1rem'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                          <span className={`priority-tag ${(issue.priority || 'medium').toLowerCase()}`}>{issue.priority}</span>
                          <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>{issue.category}</h4>
                        </div>
                        <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                          📍 {issue.village} &bull; Reported: {issue.date} ({issue.time || '10:30 AM'})
                        </span>
                      </div>
                      <button className="btn btn-primary btn-sm" onClick={() => handleOpenAdoptModal(issue)}>
                        <Target size={14} /> Adopt
                      </button>
                    </div>
                  ))}

                  {openIssues.filter(i => !i.adopted).length === 0 && (
                    <p style={{ color: '#64748b', fontSize: '0.88rem', margin: '0.5rem 0' }}>
                      All open community issues have currently been adopted!
                    </p>
                  )}
                </div>
              </div>

              {/* RECENTLY ADOPTED ISSUES */}
              <div className="dash-card">
                <div className="dash-card-header" style={{ marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                      Recently Adopted Issues
                    </h3>
                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Active adoptions</span>
                  </div>
                  <button className="btn btn-outline btn-sm" onClick={() => setActiveTab('adopted-issues')}>
                    Manage <ArrowRight size={14} />
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {adoptedIssues.slice(0, 4).map(item => (
                    <div key={item.id} style={{ background: '#f8fafc', padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem', marginBottom: '0.2rem' }}>
                        <strong style={{ color: '#0f172a' }}>{item.category} ({item.id})</strong>
                        <span className="status-pill in-progress" style={{ fontSize: '0.7rem' }}>
                          Adopted
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#059669', fontWeight: 600 }}>
                        <span>📍 {item.village}</span>
                        <span>Adopted by: {item.adoptedBy}</span>
                      </div>
                    </div>
                  ))}

                  {adoptedIssues.length === 0 && (
                    <p style={{ color: '#64748b', fontSize: '0.88rem', margin: '0.5rem 0' }}>
                      No community issues have been adopted yet.
                    </p>
                  )}
                </div>
              </div>

            </div>

            {/* QUICK ACTIONS BAR */}
            <div className="dash-card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    NGO Action Toolkit
                  </h4>
                  <span style={{ fontSize: '0.84rem', color: '#64748b' }}>Direct tools for community drives and impact analytics</span>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('community-issues')}>
                    <Layers size={16} /> Community Issues
                  </button>
                  <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('adopted-issues')}>
                    <Target size={16} /> Adopted Issues
                  </button>
                  <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('map')}>
                    <Map size={16} /> Community Map
                  </button>
                </div>
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <DashboardLayout
      user={user}
      roleTitle="NGO Impact Command"
      sidebarItems={sidebarItems}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onLogout={onLogout}
    >
      {renderContent()}

      {/* =============================================================
          MODAL: QUICK ADOPT CONFIRMATION
          ============================================================= */}
      {activeModal === 'adopt' && selectedIssueToAdopt && (
        <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div className="modal-card" style={{ background: '#ffffff', borderRadius: '18px', padding: '2rem', maxWidth: '480px', width: '100%', boxShadow: '0 20px 40px rgba(0,0,0,0.15)', border: '1px solid #e2e8f0' }}>
            <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Target size={20} />
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Adopt Community Issue
                </h3>
              </div>
              <button className="modal-close-btn" onClick={() => setActiveModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <XCircle size={22} />
              </button>
            </div>

            <p style={{ color: '#334155', fontSize: '0.95rem', lineHeight: '1.5', marginBottom: '1rem' }}>
              Do you want to adopt this issue?
            </p>

            <div style={{ background: '#f8fafc', padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Linked Grievance: <strong>{selectedIssueToAdopt.id}</strong></div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', margin: '0.2rem 0' }}>{selectedIssueToAdopt.category}</div>
              <div style={{ fontSize: '0.85rem', color: '#059669' }}>📍 {selectedIssueToAdopt.area}, {selectedIssueToAdopt.village} ({selectedIssueToAdopt.pincode})</div>
              <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '0.25rem' }}>
                Adopting as: <strong style={{ color: '#0f172a' }}>{user?.fullName || 'NGO / Volunteer Organization'}</strong>
              </div>
            </div>

            <div className="modal-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => setActiveModal(null)} style={{ fontWeight: 700 }}>
                Cancel
              </button>
              <button type="button" className="btn btn-primary btn-sm" onClick={handleConfirmAdopt} style={{ background: '#059669', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                <Check size={16} /> Confirm & Adopt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =============================================================
          MODAL: CREATE VOLUNTEER DRIVE
          ============================================================= */}
      {activeModal === 'new-drive' && (
        <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div className="modal-card" style={{ background: '#ffffff', borderRadius: '18px', padding: '2rem', maxWidth: '480px', width: '100%', boxShadow: '0 20px 40px rgba(0,0,0,0.15)', border: '1px solid #e2e8f0' }}>
            <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Launch New Volunteer Drive
              </h3>
              <button className="modal-close-btn" onClick={() => setActiveModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <XCircle size={22} />
              </button>
            </div>

            <form onSubmit={handleCreateDrive}>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="input-label-bold">Drive Campaign Title</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Bheemunipatnam Beach Cleanup Drive"
                  value={driveTitle}
                  onChange={(e) => setDriveTitle(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div className="form-group">
                  <label className="input-label-bold">Target Village</label>
                  <select
                    className="form-input"
                    value={driveVillage}
                    onChange={(e) => setDriveVillage(e.target.value)}
                  >
                    {VISAKHAPATNAM_VILLAGES.map(v => (
                      <option key={v} value={v}>📍 {v}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="input-label-bold">Target Volunteers</label>
                  <input
                    type="number"
                    min="1"
                    className="form-input"
                    value={driveVolunteers}
                    onChange={(e) => setDriveVolunteers(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div className="form-group">
                  <label className="input-label-bold">Drive Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={driveDate}
                    onChange={(e) => setDriveDate(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="input-label-bold">Drive Time Window</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. 7:00 AM - 11:00 AM"
                    value={driveTime}
                    onChange={(e) => setDriveTime(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="input-label-bold">Focus Area / Campaign Objective</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Drainage Unclogging, Tree Plantation, Clean Drinking Water"
                  value={driveFocus}
                  onChange={(e) => setDriveFocus(e.target.value)}
                  required
                />
              </div>

              <div className="modal-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setActiveModal(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  <Rocket size={16} /> Announce Drive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}