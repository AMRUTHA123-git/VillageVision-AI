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
  PiggyBank, 
  PlusCircle, 
  FolderKanban, 
  CircleDollarSign, 
  History, 
  Award, 
  Map, 
  Bell, 
  User, 
  MapPin, 
  HeartHandshake, 
  FileText 
} from 'lucide-react';

export default function DonorDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard');

  const [approvedProjects, setApprovedProjects] = useState([
    { id: 'PROJ-501', title: 'Community Water Facility', location: 'Village A', required: 50000, funded: 32000, desc: 'Clean drinking water purification plant and storage tank for 200 households.' },
    { id: 'PROJ-502', title: 'Solar Street Lighting Drive', location: 'Sector 3 & 4', required: 75000, funded: 45000, desc: '30 solar-powered LED street lights for unlit main rural roads.' },
  ]);

  const [contributions, setContributions] = useState([
    { id: 'DON-102', projectTitle: 'Gram Library Books Fund', amount: '₹15,000', date: '2026-08-10', status: 'Completed' }
  ]);

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <PiggyBank size={18} /> },
    { id: 'report-issue', label: 'Report Issue', icon: <PlusCircle size={18} /> },
    { id: 'my-reports', label: 'My Reports', icon: <FileText size={18} /> },
    { id: 'projects', label: 'Projects & Needs', icon: <FolderKanban size={18} /> },
    { id: 'community-issues', label: 'Community Issues', icon: <CircleDollarSign size={18} /> },
    { id: 'map', label: 'Community Map', icon: <Map size={18} /> },
    { id: 'impact', label: 'Impact', icon: <Award size={18} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
    { id: 'profile', label: 'Profile', icon: <User size={18} /> },
  ];

  const handleSupportProject = (proj) => {
    const amountStr = prompt(`Enter contribution amount for ${proj.title} (₹):`, "5000");
    if (!amountStr || isNaN(amountStr)) return;

    const amount = parseInt(amountStr);
    if (amount <= 0) return;

    const updatedProjects = approvedProjects.map(p => {
      if (p.id === proj.id) {
        return { ...p, funded: Math.min(p.required, p.funded + amount) };
      }
      return p;
    });

    setApprovedProjects(updatedProjects);
    setContributions([{
      id: `DON-${103 + contributions.length}`,
      projectTitle: proj.title,
      amount: `₹${amount.toLocaleString('en-IN')}`,
      date: new Date().toISOString().split('T')[0],
      status: 'Completed'
    }, ...contributions]);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'report-issue':
        return <ReportIssuePage user={user} onNavigate={setActiveTab} />;
      case 'my-reports':
        return <MyReportsPage user={user} onNavigate={setActiveTab} />;
      case 'community-issues':
      case 'projects':
        return <CommunityIssuesPage user={user} />;
      case 'map':
        return <CommunityMapPage />;
      case 'impact':
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
            {/* STATS CARDS FOR DONOR */}
            <div className="dash-stats-grid">
              <div className="dash-stat-card">
                <div className="stat-icon-wrapper blue">
                  <FolderKanban size={22} />
                </div>
                <div>
                  <div className="dash-stat-val">{approvedProjects.length}</div>
                  <div className="dash-stat-lbl">Available Projects</div>
                </div>
              </div>

              <div className="dash-stat-card">
                <div className="stat-icon-wrapper green">
                  <PiggyBank size={22} />
                </div>
                <div>
                  <div className="dash-stat-val">{contributions.length}</div>
                  <div className="dash-stat-lbl">Supported Projects</div>
                </div>
              </div>

              <div className="dash-stat-card">
                <div className="stat-icon-wrapper teal">
                  <CircleDollarSign size={22} />
                </div>
                <div>
                  <div className="dash-stat-val">₹15,000</div>
                  <div className="dash-stat-lbl">Total Contributions</div>
                </div>
              </div>
            </div>

            {/* APPROVED PROJECTS REQUIRING SUPPORT */}
            <div className="dash-section-box">
              <div className="dash-section-header">
                <h3>Approved Community Projects Needing Support</h3>
                <span className="badge-tag">Verified Governance Projects</span>
              </div>

              <div className="pending-cards-grid">
                {approvedProjects.map((proj) => {
                  const percent = Math.round((proj.funded / proj.required) * 100);
                  return (
                    <div key={proj.id} className="donor-card">
                      <div className="authority-card-top">
                        <div>
                          <h4 className="issue-card-title">{proj.title}</h4>
                          <span className="location-text"><MapPin size={14} /> {proj.location}</span>
                        </div>
                        <code className="id-code">{proj.id}</code>
                      </div>

                      <p className="issue-desc" style={{ marginTop: '0.6rem' }}>{proj.desc}</p>

                      <div className="funding-progress-container">
                        <div className="funding-labels">
                          <span>Funded: <strong>₹{proj.funded.toLocaleString('en-IN')}</strong></span>
                          <span>Required: <strong>₹{proj.required.toLocaleString('en-IN')}</strong></span>
                        </div>
                        <div className="progress-bar-bg">
                          <div className="progress-bar-fill" style={{ width: `${percent}%` }}></div>
                        </div>
                        <div className="funding-percent-text">{percent}% Funded</div>
                      </div>

                      <button 
                        className="btn btn-primary btn-sm" 
                        style={{ marginTop: '1.2rem', width: '100%', justifyContent: 'center' }}
                        onClick={() => handleSupportProject(proj)}
                      >
                        <HeartHandshake size={16} /> Support Project
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <DashboardLayout
      user={user}
      roleTitle="Donor Impact Center"
      sidebarItems={sidebarItems}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onLogout={onLogout}
    >
      {renderContent()}
    </DashboardLayout>
  );
}
