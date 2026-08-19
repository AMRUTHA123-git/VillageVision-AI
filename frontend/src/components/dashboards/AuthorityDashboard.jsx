import React, { useState } from 'react';
import DashboardLayout from './DashboardLayout';
import ReportIssuePage from '../ReportIssuePage';
import CommunityIssuesPage from '../CommunityIssuesPage';
import CommunityMapPage from '../CommunityMapPage';
import AIInsightsPage from '../AIInsightsPage';
import NotificationsPage from '../NotificationsPage';
import ProfilePage from '../ProfilePage';
import MyReportsPage from '../MyReportsPage';
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
  Send 
} from 'lucide-react';
import { getStoredIssues, updateIssueStatus } from '../../utils/issueData';

export default function AuthorityDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [allIssues, setAllIssues] = useState(getStoredIssues());
  const [assignedDept, setAssignedDept] = useState({});

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Building2 size={18} /> },
    { id: 'report-issue', label: 'Report Issue', icon: <PlusCircle size={18} /> },
    { id: 'issue-management', label: 'Issue Management', icon: <CheckSquare size={18} /> },
    { id: 'my-reports', label: 'My Reports', icon: <FileText size={18} /> },
    { id: 'community-issues', label: 'Community Issues', icon: <Layers size={18} /> },
    { id: 'map', label: 'Community Map', icon: <Map size={18} /> },
    { id: 'analytics', label: 'AI Analytics', icon: <BarChart3 size={18} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
    { id: 'profile', label: 'Profile', icon: <User size={18} /> },
  ];

  const pendingIssues = allIssues.filter(i => i.status === 'Open' || i.status === 'Pending Verification');
  const assignedIssues = allIssues.filter(i => i.status === 'Assigned' || i.status === 'In Progress');

  const handleVerify = (id) => {
    const dept = assignedDept[id] || 'Public Works Dept';
    const updated = updateIssueStatus(id, 'Assigned', dept);
    setAllIssues(updated);
  };

  const handleReject = (id) => {
    const updated = updateIssueStatus(id, 'Rejected');
    setAllIssues(updated);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'report-issue':
        return <ReportIssuePage user={user} onNavigate={setActiveTab} />;
      case 'my-reports':
        return <MyReportsPage user={user} onNavigate={setActiveTab} />;
      case 'community-issues':
      case 'issue-management':
        return <CommunityIssuesPage user={user} />;
      case 'map':
        return <CommunityMapPage />;
      case 'analytics':
      case 'insights':
        return <AIInsightsPage />;
      case 'notifications':
        return <NotificationsPage />;
      case 'profile':
        return <ProfilePage user={user} />;
      case 'dashboard':
      default:
        return (
          <>
            {/* STATS CARDS FOR AUTHORITY */}
            <div className="dash-stats-grid">
              <div className="dash-stat-card">
                <div className="stat-icon-wrapper blue">
                  <CheckSquare size={22} />
                </div>
                <div>
                  <div className="dash-stat-val">{allIssues.length}</div>
                  <div className="dash-stat-lbl">Total Issues</div>
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
                  <div className="dash-stat-lbl">Assigned</div>
                </div>
              </div>

              <div className="dash-stat-card">
                <div className="stat-icon-wrapper green">
                  <CheckCircle2 size={22} />
                </div>
                <div>
                  <div className="dash-stat-val">{allIssues.filter(i => i.status === 'Resolved').length}</div>
                  <div className="dash-stat-lbl">Resolved</div>
                </div>
              </div>
            </div>

            {/* PENDING ACTION SECTION */}
            <div className="dash-section-box">
              <div className="dash-section-header">
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <AlertTriangle size={20} className="warning-icon" /> Pending Action & Verification
                </h3>
                <span className="badge-tag urgent">Requires Immediate Review</span>
              </div>

              {pendingIssues.length === 0 ? (
                <div className="empty-state-box">
                  <CheckCircle2 size={36} style={{ color: 'var(--primary-emerald)', margin: '0 auto 0.5rem' }} />
                  <p>All reported issues have been verified and assigned to relevant departments.</p>
                </div>
              ) : (
                <div className="pending-cards-grid">
                  {pendingIssues.map((issue) => (
                    <div key={issue.id} className="authority-issue-card">
                      <div className="authority-card-top">
                        <div>
                          <span className={`priority-tag ${issue.priority.toLowerCase()}`}>{issue.priority} Priority</span>
                          <h4 className="issue-card-title">{issue.category}</h4>
                        </div>
                        <code className="id-code">{issue.id}</code>
                      </div>

                      <div className="issue-meta-row">
                        <span><MapPin size={14} /> Location: <strong>{issue.area}, {issue.village}</strong></span>
                        <span>Reported by: <strong>{issue.reportedBy} ({issue.reportedByRole})</strong></span>
                        <span>Date: {issue.date}</span>
                      </div>

                      <p className="issue-desc">{issue.description}</p>

                      <div className="authority-action-controls">
                        <select 
                          className="form-input dept-select"
                          value={assignedDept[issue.id] || 'Public Works Dept'}
                          onChange={(e) => setAssignedDept({ ...assignedDept, [issue.id]: e.target.value })}
                        >
                          <option value="Public Works Dept">Public Works Dept (PWD)</option>
                          <option value="Water Supply & Sanitation">Water Supply & Sanitation</option>
                          <option value="Electricity Board">Electricity Board</option>
                          <option value="Waste Management">Waste Management</option>
                        </select>

                        <div className="btn-group">
                          <button className="btn btn-primary btn-sm" onClick={() => handleVerify(issue.id)}>
                            <CheckCircle2 size={16} /> Verify & Assign
                          </button>
                          <button className="btn btn-secondary btn-sm" onClick={() => handleReject(issue.id)}>
                            <XCircle size={16} /> Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        );
    }
  };

  return (
    <DashboardLayout
      user={user}
      roleTitle="Authority Control Center"
      sidebarItems={sidebarItems}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onLogout={onLogout}
    >
      {renderContent()}
    </DashboardLayout>
  );
}
