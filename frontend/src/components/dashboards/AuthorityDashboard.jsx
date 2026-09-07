import React, { useState, useEffect } from 'react';
import DashboardLayout from './DashboardLayout';
import CommunityIssuesPage from '../CommunityIssuesPage';
import CommunityMapPage from '../CommunityMapPage';
import AIInsightsPage from '../AIInsightsPage';
import NotificationsPage from '../NotificationsPage';
import ProfilePage from '../ProfilePage';

import {
  Building2,
  PlusCircle,
  CheckSquare,
  Clock,
  UserCheck,
  CheckCircle2,
  XCircle,
  Layers,
  Map,
  BarChart3,
  FileText,
  Bell,
  User,
  MapPin,
  AlertTriangle,
  Users2,
  HeartHandshake,
  UserPlus,
  ShieldCheck,
  Building,
  Activity,
  ArrowRight,
  Search,
  Check,
  Wrench
} from 'lucide-react';

import {
  getStoredIssues,
  updateIssueStatus,
  VISAKHAPATNAM_VILLAGES
} from '../../utils/issueData';

export default function AuthorityDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [allIssues, setAllIssues] = useState([]);
  
  // Filtering in Issue Management
  const [issueStatusFilter, setIssueStatusFilter] = useState('All');
  const [selectedVillageFilter, setSelectedVillageFilter] = useState('All');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Interactive Action Modal State
  const [activeModal, setActiveModal] = useState(null);
  const [selectedIssue, setSelectedIssue] = useState(null);

  // Form states for modals
  const [assignDept, setAssignDept] = useState('Public Works Dept (PWD - Vizag)');
  const [assignSla, setAssignSla] = useState('48 Hours');
  const [assignPriority, setAssignPriority] = useState('High');
  const [assignOfficer, setAssignOfficer] = useState('');

  const [resolutionNote, setResolutionNote] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');

  // Government Departments in Visakhapatnam
  const departments = [
    {
      id: 'pwd',
      name: 'Public Works Dept (PWD - Vizag)',
      head: 'Er. K. Venkat Rao',
      contact: 'pwd-vizag@ap.gov.in',
      activeIssues: 12,
      resolvedIssues: 45,
      avgSlaHours: '36 Hours'
    },
    {
      id: 'water',
      name: 'GVMC Water Supply & Sanitation',
      head: 'Smt. S. Lakshmi Kumari',
      contact: 'water-gvmc@ap.gov.in',
      activeIssues: 8,
      resolvedIssues: 38,
      avgSlaHours: '24 Hours'
    },
    {
      id: 'electricity',
      name: 'APEPDCL Electricity Board (Vizag Rural)',
      head: 'Er. M. Satyanarayana',
      contact: 'apepdcl-rural@ap.gov.in',
      activeIssues: 5,
      resolvedIssues: 52,
      avgSlaHours: '18 Hours'
    },
    {
      id: 'sanitation',
      name: 'GVMC Solid Waste & Drainage',
      head: 'Dr. P. Rajasekhar',
      contact: 'sanitation-gvmc@ap.gov.in',
      activeIssues: 9,
      resolvedIssues: 64,
      avgSlaHours: '28 Hours'
    },
    {
      id: 'health',
      name: 'District Health & Medical Office (DMHO)',
      head: 'Dr. G. Jagannadham',
      contact: 'dmho-vizag@ap.gov.in',
      activeIssues: 4,
      resolvedIssues: 29,
      avgSlaHours: '48 Hours'
    },
    {
      id: 'panchayat',
      name: 'Panchayat Raj & Rural Roads',
      head: 'Sri B. Appala Naidu',
      contact: 'panchayat-vizag@ap.gov.in',
      activeIssues: 7,
      resolvedIssues: 33,
      avgSlaHours: '72 Hours'
    }
  ];

  // Community Stakeholders
  const communityMembers = [
    {
      id: 1,
      name: 'Citizens & Residents',
      role: 'Grievance Reporters',
      description: 'Citizens report infrastructure hazards, potholes, water leaks, and streetlight outages.',
      icon: <Users2 size={24} />,
      count: 142,
      status: 'Active'
    },
    {
      id: 2,
      name: 'Registered NGOs',
      role: 'Development Partners',
      description: 'NGOs adopt civic issues, mobilize volunteer drives, and support rural development.',
      icon: <HeartHandshake size={24} />,
      count: 16,
      status: 'Active'
    },
    {
      id: 3,
      name: 'Civic Volunteers',
      role: 'On-Ground Force',
      description: 'Community volunteers assist in local clean-up, road patching, and tree planting.',
      icon: <UserPlus size={24} />,
      count: 64,
      status: 'Active'
    },
    {
      id: 4,
      name: 'Municipal Departments',
      role: 'Resolution Authority',
      description: 'Designated engineering and administrative teams dispatched to fix reported grievances.',
      icon: <Building size={24} />,
      count: 6,
      status: 'Active'
    }
  ];

  const refreshIssues = () => {
    setAllIssues(getStoredIssues());
  };

  useEffect(() => {
    refreshIssues();
  }, [activeTab]);

  const sidebarItems = [
    { id: 'dashboard', label: 'Overview', icon: <Building2 size={18} /> },
    { id: 'issue-management', label: 'Issue Triage & Actions', icon: <CheckSquare size={18} /> },
    { id: 'departments', label: 'Departments & SLA', icon: <Building size={18} /> },
    { id: 'community-management', label: 'Community & NGOs', icon: <Users2 size={18} /> },
    { id: 'community-issues', label: 'Community Issues', icon: <Layers size={18} /> },
    { id: 'map', label: 'Community Map', icon: <Map size={18} /> },
    { id: 'analytics', label: 'AI Analytics', icon: <BarChart3 size={18} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
    { id: 'profile', label: 'Profile', icon: <User size={18} /> }
  ];

  // Calculated categories
  const pendingIssues = allIssues.filter(i => i.status === 'Open' || i.status === 'Pending Verification');
  const assignedIssues = allIssues.filter(i => i.status === 'Assigned' || i.status === 'In Progress');
  const resolvedIssues = allIssues.filter(i => i.status === 'Resolved');
  const rejectedIssues = allIssues.filter(i => i.status === 'Rejected');

  // Filtered Issues for Triage Table / Grid
  const filteredTriageIssues = allIssues.filter(issue => {
    if (issueStatusFilter === 'Pending' && !(issue.status === 'Open' || issue.status === 'Pending Verification')) return false;
    if (issueStatusFilter === 'Assigned' && !(issue.status === 'Assigned' || issue.status === 'In Progress')) return false;
    if (issueStatusFilter === 'Resolved' && issue.status !== 'Resolved') return false;
    if (issueStatusFilter === 'Rejected' && issue.status !== 'Rejected') return false;

    if (selectedVillageFilter !== 'All' && issue.village !== selectedVillageFilter) return false;
    if (selectedDeptFilter !== 'All' && issue.assignedDept !== selectedDeptFilter) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const match =
        (issue.id || '').toLowerCase().includes(q) ||
        (issue.category || '').toLowerCase().includes(q) ||
        (issue.description || '').toLowerCase().includes(q) ||
        (issue.village || '').toLowerCase().includes(q) ||
        (issue.area || '').toLowerCase().includes(q) ||
        (issue.reportedBy || '').toLowerCase().includes(q);
      if (!match) return false;
    }

    return true;
  });

  // Action Triggers
  const openAssignModal = (issue) => {
    setSelectedIssue(issue);
    setAssignDept(issue.assignedDept || 'Public Works Dept (PWD - Vizag)');
    setAssignPriority(issue.priority || 'High');
    setAssignSla(issue.slaDays || '48 Hours');
    setAssignOfficer(issue.assignedTo || '');
    setActiveModal('assign');
  };

  const handleConfirmAssign = (e) => {
    e.preventDefault();
    if (!selectedIssue) return;

    const updated = updateIssueStatus(selectedIssue.id, 'Assigned', {
      assignedDept: assignDept,
      priority: assignPriority,
      slaDays: assignSla,
      assignedTo: assignOfficer || 'Municipal Field Team'
    });

    setAllIssues(updated);
    setActiveModal(null);
    setSelectedIssue(null);
  };

  const openResolveModal = (issue) => {
    setSelectedIssue(issue);
    setResolutionNote(issue.resolutionNote || 'Repair inspected and finalized by municipal engineer.');
    setActiveModal('resolve');
  };

  const handleConfirmResolve = (e) => {
    e.preventDefault();
    if (!selectedIssue) return;

    const updated = updateIssueStatus(selectedIssue.id, 'Resolved', {
      resolutionNote: resolutionNote.trim() || 'Work completed and verified on site.'
    });

    setAllIssues(updated);
    setActiveModal(null);
    setSelectedIssue(null);
  };

  const openRejectModal = (issue) => {
    setSelectedIssue(issue);
    setRejectionReason('');
    setActiveModal('reject');
  };

  const handleConfirmReject = (e) => {
    e.preventDefault();
    if (!selectedIssue) return;

    const updated = updateIssueStatus(selectedIssue.id, 'Rejected', {
      rejectionReason: rejectionReason.trim() || 'Duplicate grievance or out of municipal jurisdiction.'
    });

    setAllIssues(updated);
    setActiveModal(null);
    setSelectedIssue(null);
  };

  const handleMarkInProgress = (issue) => {
    const updated = updateIssueStatus(issue.id, 'In Progress', {
      assignedDept: issue.assignedDept || 'Public Works Dept (PWD - Vizag)'
    });
    setAllIssues(updated);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'community-issues':
        return <CommunityIssuesPage user={user} />;

      case 'map':
        return <CommunityMapPage />;

      case 'analytics':
      case 'insights':
        return <AIInsightsPage />;

      case 'notifications':
        return <NotificationsPage />;

      case 'profile':
        return <ProfilePage user={user} onLogout={onLogout} />;

      case 'departments':
        return (
          <div>
            <div className="dash-card-header" style={{ marginBottom: '1.25rem' }}>
              <div>
                <h1 className="hero-title" style={{ fontSize: '1.85rem', textAlign: 'left', marginBottom: '0.25rem', color: '#0f172a' }}>
                  Visakhapatnam <span className="gradient-text">Municipal Departments</span>
                </h1>
                <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
                  Municipal and district agencies responsible for public works and grievance resolution in Visakhapatnam.
                </p>
              </div>
              <span className="badge-tag">6 Active Departments</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
              {departments.map((d) => (
                <div key={d.id} className="dash-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                      <div className="stat-icon-wrapper blue" style={{ width: '42px', height: '42px' }}>
                        <Building size={20} />
                      </div>
                      <div>
                        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>{d.name}</h3>
                        <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Officer: {d.head}</span>
                      </div>
                    </div>

                    <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', marginBottom: '0.4rem' }}>
                        <span style={{ color: '#64748b' }}>Target SLA:</span>
                        <strong style={{ color: '#059669' }}>{d.avgSlaHours}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', marginBottom: '0.4rem' }}>
                        <span style={{ color: '#64748b' }}>Assigned Open:</span>
                        <strong style={{ color: '#ea580c' }}>{d.activeIssues} Grievances</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem' }}>
                        <span style={{ color: '#64748b' }}>Resolved YTD:</span>
                        <strong style={{ color: '#0f172a' }}>{d.resolvedIssues} Fixed</strong>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      className="btn btn-outline btn-sm"
                      style={{ flex: 1, justifyContent: 'center' }}
                      onClick={() => {
                        setSelectedDeptFilter(d.name);
                        setIssueStatusFilter('All');
                        setActiveTab('issue-management');
                      }}
                    >
                      View Assigned Issues
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'community-management':
        return (
          <div>
            <div className="dash-card-header" style={{ marginBottom: '1.25rem' }}>
              <div>
                <h1 className="hero-title" style={{ fontSize: '1.85rem', textAlign: 'left', marginBottom: '0.25rem', color: '#0f172a' }}>
                  Community & NGO <span className="gradient-text">Oversight</span>
                </h1>
                <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
                  Coordinate with citizen volunteers and non-governmental organizations across Visakhapatnam.
                </p>
              </div>
              <span className="badge-tag">Stakeholder Grid</span>
            </div>

            <div className="dash-stats-grid" style={{ marginBottom: '1.5rem' }}>
              {communityMembers.map((m) => (
                <div key={m.id} className="dash-stat-card">
                  <div className="stat-icon-wrapper green">{m.icon}</div>
                  <div>
                    <div className="dash-stat-val">{m.count}</div>
                    <div className="dash-stat-lbl">{m.name}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="dash-card">
              <div className="dash-card-header" style={{ marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                  Active Stakeholder Groups in Visakhapatnam
                </h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                {communityMembers.map((member) => (
                  <div key={member.id} style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '14px', padding: '1.2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.6rem' }}>
                      <div className="stat-icon-wrapper teal" style={{ width: '38px', height: '38px' }}>{member.icon}</div>
                      <div>
                        <h4 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>{member.name}</h4>
                        <span className="badge-tag" style={{ fontSize: '0.72rem' }}>{member.role}</span>
                      </div>
                    </div>
                    <p style={{ fontSize: '0.86rem', color: '#475569', lineHeight: '1.5', margin: '0.5rem 0' }}>
                      {member.description}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#64748b', borderTop: '1px solid #e2e8f0', paddingTop: '0.5rem' }}>
                      <span>Registered: <strong>{member.count}</strong></span>
                      <span>Status: <strong style={{ color: '#059669' }}>{member.status}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'issue-management':
        return (
          <div>
            <div className="dash-card-header" style={{ marginBottom: '1.25rem' }}>
              <div>
                <h1 className="hero-title" style={{ fontSize: '1.85rem', textAlign: 'left', marginBottom: '0.25rem', color: '#0f172a' }}>
                  Grievance Triage & <span className="gradient-text">Action Console</span>
                </h1>
                <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
                  Verify, assign municipal departments, dispatch field teams, and verify resolutions.
                </p>
              </div>
              <button className="btn btn-outline btn-sm" onClick={refreshIssues}>
                <CheckSquare size={16} /> Refresh Grievances
              </button>
            </div>

            {/* FILTER CONTROLS */}
            <div className="dash-card" style={{ marginBottom: '1.5rem', padding: '1.25rem' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
                
                {/* Status Tabs */}
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  {[
                    { id: 'All', label: `All (${allIssues.length})` },
                    { id: 'Pending', label: `Pending (${pendingIssues.length})` },
                    { id: 'Assigned', label: `Assigned (${assignedIssues.length})` },
                    { id: 'Resolved', label: `Resolved (${resolvedIssues.length})` },
                    { id: 'Rejected', label: `Rejected (${rejectedIssues.length})` }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      className={`btn btn-sm ${issueStatusFilter === tab.id ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ fontSize: '0.82rem', padding: '0.4rem 0.85rem' }}
                      onClick={() => setIssueStatusFilter(tab.id)}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Village Selector */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 700 }}>Village:</label>
                  <select
                    className="form-input"
                    style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem', width: 'auto', minWidth: '160px' }}
                    value={selectedVillageFilter}
                    onChange={(e) => setSelectedVillageFilter(e.target.value)}
                  >
                    <option value="All">📍 All Villages</option>
                    {VISAKHAPATNAM_VILLAGES.map(v => (
                      <option key={v} value={v}>📍 {v}</option>
                    ))}
                  </select>
                </div>

                {/* Search box */}
                <div style={{ minWidth: '220px', flex: 1, maxWidth: '320px' }}>
                  <div className="input-wrapper">
                    <Search size={16} className="field-icon" style={{ left: '0.75rem' }} />
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Search ID, category, reporter..."
                      style={{ paddingLeft: '2.2rem', padding: '0.45rem 0.75rem 0.45rem 2.2rem', fontSize: '0.85rem' }}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

              </div>
            </div>

            {/* GRIEVANCES LIST */}
            {filteredTriageIssues.length === 0 ? (
              <div className="dash-card empty-state-box">
                <CheckCircle2 size={44} style={{ color: '#059669', margin: '0 auto 0.75rem' }} />
                <h3 style={{ color: '#0f172a', fontWeight: 800 }}>No Grievances Matching Criteria</h3>
                <p style={{ color: '#64748b', marginTop: '0.25rem' }}>All issues in this view have been processed or no matching reports found.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {filteredTriageIssues.map((issue) => (
                  <div
                    key={issue.id}
                    className="dash-card"
                    style={{
                      borderLeft: `4px solid ${
                        issue.priority === 'High' ? '#ef4444' : issue.priority === 'Medium' ? '#f59e0b' : '#10b981'
                      }`,
                      padding: '1.25rem 1.5rem'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
                          <span className={`priority-tag ${issue.priority.toLowerCase()}`}>
                            {issue.priority} Priority
                          </span>
                          <span className={`status-pill ${issue.status.toLowerCase().replace(/\s+/g, '-')}`}>
                            {issue.status}
                          </span>
                          <code className="id-code">{issue.id}</code>
                        </div>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                          {issue.category}
                        </h3>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '0.82rem', color: '#64748b', display: 'block' }}>
                          Reported: {issue.date}
                        </span>
                        <span style={{ fontSize: '0.82rem', color: '#059669', fontWeight: 700 }}>
                          📍 {issue.area}, {issue.village} ({issue.pincode})
                        </span>
                      </div>
                    </div>

                    <p style={{ color: '#334155', fontSize: '0.92rem', lineHeight: '1.5', margin: '0.5rem 0 1rem' }}>
                      {issue.description}
                    </p>

                    {/* Metadata Strip */}
                    <div style={{ background: '#f8fafc', padding: '0.65rem 1rem', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', flexWrap: 'wrap', gap: '1.5rem', fontSize: '0.83rem', color: '#475569', marginBottom: '1rem' }}>
                      <span>Reporter: <strong>{issue.reportedBy}</strong> ({issue.reportedByRole})</span>
                      <span>Assigned Dept: <strong style={{ color: '#0f172a' }}>{issue.assignedDept || 'Unassigned'}</strong></span>
                      {issue.assignedTo && <span>Lead: <strong>{issue.assignedTo}</strong></span>}
                      {issue.resolutionNote && <span>Resolution: <strong style={{ color: '#059669' }}>{issue.resolutionNote}</strong></span>}
                    </div>

                    {/* Action Controls */}
                    <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', justifyContent: 'flex-end', borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem' }}>
                      {issue.status !== 'Resolved' && issue.status !== 'Rejected' && (
                        <>
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => openAssignModal(issue)}
                          >
                            <Building size={15} />
                            {issue.assignedDept ? 'Reassign Department' : 'Verify & Assign'}
                          </button>

                          {issue.status === 'Assigned' && (
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => handleMarkInProgress(issue)}
                            >
                              <Wrench size={15} /> Dispatch Crew (In Progress)
                            </button>
                          )}

                          <button
                            className="btn btn-outline btn-sm"
                            onClick={() => openResolveModal(issue)}
                          >
                            <CheckCircle2 size={15} /> Mark Resolved
                          </button>

                          <button
                            className="btn btn-secondary btn-sm"
                            style={{ color: '#dc2626', borderColor: '#fecaca' }}
                            onClick={() => openRejectModal(issue)}
                          >
                            <XCircle size={15} /> Reject
                          </button>
                        </>
                      )}

                      {issue.status === 'Resolved' && (
                        <span style={{ fontSize: '0.85rem', color: '#059669', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                          <CheckCircle2 size={16} /> Resolution Completed & Closed
                        </span>
                      )}

                      {issue.status === 'Rejected' && (
                        <span style={{ fontSize: '0.85rem', color: '#dc2626', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                          <XCircle size={16} /> Grievance Rejected ({issue.rejectionReason || 'Duplicate/Invalid'})
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'dashboard':
      default:
        return (
          <>
            {/* HERO WELCOME STRIP */}
            <div
              className="dash-card"
              style={{
                marginBottom: '1.75rem',
                background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)',
                border: '1.5px solid #bbf7d0'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <span className="badge-tag" style={{ background: '#dcfce7', color: '#166534', marginBottom: '0.4rem' }}>
                    🏛️ Visakhapatnam District Administration
                  </span>
                  <h1 className="hero-title" style={{ fontSize: '1.85rem', textAlign: 'left', marginBottom: '0.35rem', color: '#065f46' }}>
                    Greater Visakhapatnam <span className="gradient-text">Civic Command</span>
                  </h1>
                  <p style={{ color: '#15803d', fontSize: '0.94rem', margin: 0 }}>
                    Real-time grievance monitoring, municipal department routing, and SLA compliance for rural & urban Vizag.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '0.6rem' }}>
                  <button className="btn btn-primary btn-sm" onClick={() => setActiveTab('issue-management')}>
                    <CheckSquare size={16} /> Triage Queue ({pendingIssues.length})
                  </button>
                </div>
              </div>
            </div>

            {/* KEY METRICS GRID */}
            <div className="dash-stats-grid">
              <div className="dash-stat-card">
                <div className="stat-icon-wrapper blue">
                  <CheckSquare size={22} />
                </div>
                <div>
                  <div className="dash-stat-val">{allIssues.length}</div>
                  <div className="dash-stat-lbl">Total Vizag Grievances</div>
                </div>
              </div>

              <div className="dash-stat-card">
                <div className="stat-icon-wrapper orange">
                  <Clock size={22} />
                </div>
                <div>
                  <div className="dash-stat-val">{pendingIssues.length}</div>
                  <div className="dash-stat-lbl">Pending Verification</div>
                </div>
              </div>

              <div className="dash-stat-card">
                <div className="stat-icon-wrapper teal">
                  <UserCheck size={22} />
                </div>
                <div>
                  <div className="dash-stat-val">{assignedIssues.length}</div>
                  <div className="dash-stat-lbl">Assigned / In Progress</div>
                </div>
              </div>

              <div className="dash-stat-card">
                <div className="stat-icon-wrapper green">
                  <CheckCircle2 size={22} />
                </div>
                <div>
                  <div className="dash-stat-val">{resolvedIssues.length}</div>
                  <div className="dash-stat-lbl">Resolved & Closed</div>
                </div>
              </div>
            </div>

            {/* TWO COLUMN WORKSPACE */}
            <div className="dash-two-col" style={{ gridTemplateColumns: '1.4fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
              
              {/* URGENT TRIAGE QUEUE */}
              <div className="dash-card">
                <div className="dash-card-header" style={{ marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <AlertTriangle size={18} className="warning-icon" />
                      Pending Review Queue
                    </h3>
                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Requires immediate department assignment</span>
                  </div>
                  <button className="btn btn-outline btn-sm" onClick={() => setActiveTab('issue-management')}>
                    View All <ArrowRight size={14} />
                  </button>
                </div>

                {pendingIssues.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                    <CheckCircle2 size={36} style={{ color: '#059669', margin: '0 auto 0.5rem' }} />
                    <p style={{ margin: 0, fontWeight: 700, color: '#0f172a' }}>All caught up!</p>
                    <span style={{ fontSize: '0.85rem' }}>No grievances waiting for initial triage.</span>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {pendingIssues.slice(0, 3).map(issue => (
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
                            <span className={`priority-tag ${issue.priority.toLowerCase()}`}>{issue.priority}</span>
                            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>{issue.category}</h4>
                          </div>
                          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                            📍 {issue.village} &bull; {issue.date}
                          </span>
                        </div>
                        <button className="btn btn-primary btn-sm" onClick={() => openAssignModal(issue)}>
                          Assign
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* DEPARTMENT SLA RADAR */}
              <div className="dash-card">
                <div className="dash-card-header" style={{ marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                      Department SLA Radar
                    </h3>
                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Workload distribution across Visakhapatnam</span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {departments.slice(0, 4).map(d => (
                    <div key={d.id} style={{ background: '#f8fafc', padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem', marginBottom: '0.2rem' }}>
                        <strong style={{ color: '#0f172a' }}>{d.name.split('(')[0]}</strong>
                        <span style={{ color: '#059669', fontWeight: 700 }}>{d.avgSlaHours}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#64748b' }}>
                        <span>Open: {d.activeIssues}</span>
                        <span>Resolved: {d.resolvedIssues}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* QUICK ACTIONS BAR */}
            <div className="dash-card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    Administrative Quick Links
                  </h4>
                  <span style={{ fontSize: '0.84rem', color: '#64748b' }}>Navigate municipal services and analytics</span>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('map')}>
                    <Map size={16} /> Problem Heatmap
                  </button>
                  <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('analytics')}>
                    <BarChart3 size={16} /> AI Pattern Analytics
                  </button>
                  <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('community-management')}>
                    <Users2 size={16} /> NGO Partnerships
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
      roleTitle="GVMC Authority Console"
      sidebarItems={sidebarItems}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onLogout={onLogout}
    >
      {renderContent()}

      {/* =============================================================
          MODAL: VERIFY & ASSIGN DEPARTMENT
          ============================================================= */}
      {activeModal === 'assign' && selectedIssue && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
                Verify & Assign Department
              </h3>
              <button className="modal-close-btn" onClick={() => setActiveModal(null)}>
                <XCircle size={22} />
              </button>
            </div>

            <form onSubmit={handleConfirmAssign}>
              <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '1.2rem' }}>
                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Grievance ID: <strong>{selectedIssue.id}</strong></div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', margin: '0.2rem 0' }}>{selectedIssue.category}</div>
                <div style={{ fontSize: '0.85rem', color: '#059669' }}>📍 {selectedIssue.area}, {selectedIssue.village} ({selectedIssue.pincode})</div>
              </div>

              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="input-label-bold">Target Municipal Department</label>
                <select
                  className="form-input"
                  value={assignDept}
                  onChange={(e) => setAssignDept(e.target.value)}
                  style={{ background: '#f8fafc' }}
                >
                  {departments.map(d => (
                    <option key={d.id} value={d.name}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div className="form-group">
                  <label className="input-label-bold">Priority Classification</label>
                  <select
                    className="form-input"
                    value={assignPriority}
                    onChange={(e) => setAssignPriority(e.target.value)}
                    style={{ background: '#f8fafc' }}
                  >
                    <option value="High">🔴 High Priority</option>
                    <option value="Medium">🟡 Medium Priority</option>
                    <option value="Low">🟢 Low Priority</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="input-label-bold">Resolution SLA Target</label>
                  <select
                    className="form-input"
                    value={assignSla}
                    onChange={(e) => setAssignSla(e.target.value)}
                    style={{ background: '#f8fafc' }}
                  >
                    <option value="24 Hours">24 Hours SLA</option>
                    <option value="48 Hours">48 Hours SLA</option>
                    <option value="72 Hours">72 Hours SLA</option>
                    <option value="7 Days">7 Days SLA</option>
                  </select>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="input-label-bold">Designated Field Officer / Contractor (Optional)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Field Team A, Er. Naidu"
                  value={assignOfficer}
                  onChange={(e) => setAssignOfficer(e.target.value)}
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setActiveModal(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  <Check size={16} /> Confirm Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =============================================================
          MODAL: RESOLVE ISSUE
          ============================================================= */}
      {activeModal === 'resolve' && selectedIssue && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
                Complete & Resolve Grievance
              </h3>
              <button className="modal-close-btn" onClick={() => setActiveModal(null)}>
                <XCircle size={22} />
              </button>
            </div>

            <form onSubmit={handleConfirmResolve}>
              <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '1.2rem' }}>
                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Grievance ID: <strong>{selectedIssue.id}</strong></div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>{selectedIssue.category} - {selectedIssue.village}</div>
              </div>

              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="input-label-bold">Official Resolution / Action Taken Report</label>
                <textarea
                  className="form-input"
                  rows={4}
                  style={{ resize: 'vertical' }}
                  placeholder="Describe the completed repair or municipal action taken on site..."
                  value={resolutionNote}
                  onChange={(e) => setResolutionNote(e.target.value)}
                  required
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setActiveModal(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  <CheckCircle2 size={16} /> Mark as Resolved
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =============================================================
          MODAL: REJECT ISSUE
          ============================================================= */}
      {activeModal === 'reject' && selectedIssue && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#dc2626' }}>
                Reject Grievance
              </h3>
              <button className="modal-close-btn" onClick={() => setActiveModal(null)}>
                <XCircle size={22} />
              </button>
            </div>

            <form onSubmit={handleConfirmReject}>
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="input-label-bold">Reason for Administrative Rejection</label>
                <textarea
                  className="form-input"
                  rows={3}
                  placeholder="Specify why this grievance cannot be processed (e.g. Duplicate, Outside GVMC bounds)..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  required
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setActiveModal(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-secondary btn-sm" style={{ color: '#dc2626', borderColor: '#fecaca' }}>
                  <XCircle size={16} /> Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}