import React, { useState, useEffect } from 'react';
import DashboardLayout from './DashboardLayout';
import ReportIssuePage from '../ReportIssuePage';
import CommunityIssuesPage from '../CommunityIssuesPage';
import CommunityMapPage from '../CommunityMapPage';
import AIInsightsPage from '../AIInsightsPage';
import NotificationsPage from '../NotificationsPage';
import ProfilePage from '../ProfilePage';
import MyReportsPage from '../MyReportsPage';
import { 
  Home, 
  PlusCircle, 
  FileText, 
  Layers, 
  Map, 
  Sparkles, 
  TrendingUp, 
  Bell, 
  User, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  MapPin
} from 'lucide-react';
import { getStoredIssues } from '../../utils/issueData';

export default function CitizenDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('home');
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    setIssues(getStoredIssues());
  }, [activeTab]);

  const sidebarItems = [
    { id: 'home', label: 'Home', icon: <Home size={18} /> },
    { id: 'report-issue', label: 'Report Issue', icon: <PlusCircle size={18} /> },
    { id: 'my-reports', label: 'My Reports', icon: <FileText size={18} /> },
    { id: 'community-issues', label: 'Community Issues', icon: <Layers size={18} /> },
    { id: 'map', label: 'Community Map', icon: <Map size={18} /> },
    { id: 'insights', label: 'AI Insights', icon: <Sparkles size={18} /> },
    { id: 'opportunities', label: 'Development Opportunities', icon: <TrendingUp size={18} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
    { id: 'profile', label: 'Profile', icon: <User size={18} /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'report-issue':
        return <ReportIssuePage user={user} onNavigate={setActiveTab} />;
      case 'my-reports':
        return <MyReportsPage user={user} onNavigate={setActiveTab} />;
      case 'community-issues':
        return <CommunityIssuesPage user={user} />;
      case 'map':
        return <CommunityMapPage />;
      case 'insights':
        return <AIInsightsPage />;
        case 'opportunities':
    return (
      <div className="dash-card">
        <div className="dash-card-header">
          <div>
            <h1 className="hero-title" style={{ fontSize: '2rem', textAlign: 'left', marginBottom: '0.25rem' }}>
              Development <span className="gradient-text">Opportunities</span>
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Discover business and development opportunities in underserved communities.
            </p>
          </div>
          <span className="badge-tag">AI Opportunity Finder</span>
        </div>

        <div className="dash-stats-grid" style={{ marginTop: '1.5rem' }}>

          <div className="dash-card">
            <h3>🏪 Grocery Store</h3>
            <p style={{ color: 'var(--text-muted)' }}>
              No nearby grocery store has been reported in this area.
            </p>
            <strong>📍 Tuni, Kakinada</strong>
            <p style={{ color: 'var(--text-muted)' }}>
              Opportunity: High
            </p>
            <button className="btn btn-primary">
              View Opportunity
            </button>
          </div>

          <div className="dash-card">
            <h3>🚌 Local Transport</h3>
            <p style={{ color: 'var(--text-muted)' }}>
              The area has limited public transportation facilities.
            </p>
            <strong>📍 Annavaram, Kakinada</strong>
            <p style={{ color: 'var(--text-muted)' }}>
              Opportunity: Medium
            </p>
            <button className="btn btn-primary">
              View Opportunity
            </button>
          </div>

          <div className="dash-card">
            <h3>💊 Pharmacy</h3>
            <p style={{ color: 'var(--text-muted)' }}>
              Residents may benefit from a nearby pharmacy or medical store.
            </p>
            <strong>📍 Shamshabad, Ranga Reddy</strong>
            <p style={{ color: 'var(--text-muted)' }}>
              Opportunity: High
            </p>
            <button className="btn btn-primary">
              View Opportunity
            </button>
          </div>

          <div className="dash-card">
            <h3>☕ Cafe / Food Business</h3>
            <p style={{ color: 'var(--text-muted)' }}>
              Community activity suggests potential demand for a small food business.
            </p>
            <strong>📍 Devanahalli, Bengaluru Rural</strong>
            <p style={{ color: 'var(--text-muted)' }}>
              Opportunity: Medium
            </p>
            <button className="btn btn-primary">
              View Opportunity
            </button>
          </div>

        </div>

        <div
          className="dash-card"
          style={{
            marginTop: '1.5rem',
            background: 'linear-gradient(135deg, rgba(16,185,129,0.08), rgba(20,184,166,0.04))'
          }}
        >
          <h3>💡 How VillageVision AI identifies opportunities</h3>

          <p style={{ color: 'var(--text-light)', lineHeight: '1.7' }}>
            VillageVision AI can analyze community reports, population needs,
            existing services and location data to identify areas where a
            business or service may be useful.
          </p>

          <p style={{ color: 'var(--text-light)', lineHeight: '1.7' }}>
            For example, if a village has many residents but no nearby pharmacy,
            grocery store or transportation service, the platform can highlight
            that location as a potential development opportunity.
          </p>

          <p style={{ color: 'var(--text-light)', lineHeight: '1.7' }}>
            Interested entrepreneurs can explore these opportunities and consider
            starting a business or service that addresses the community's needs.
          </p>
        </div>
      </div>
    );
      case 'notifications':
        return <NotificationsPage />;
      case 'profile':
        return <ProfilePage user={user} />;
      case 'home':
      default:
        return (
          <>
            {/* QUICK STATS CARDS */}
            <div className="dash-stats-grid">
              <div className="dash-stat-card">
                <div className="stat-icon-wrapper green">
                  <FileText size={22} />
                </div>
                <div>
                  <div className="dash-stat-val">{issues.length}</div>
                  <div className="dash-stat-lbl">Total Issues</div>
                </div>
              </div>

              <div className="dash-stat-card">
                <div className="stat-icon-wrapper orange">
                  <Clock size={22} />
                </div>
                <div>
                  <div className="dash-stat-val">{issues.filter(r => r.status === 'Open' || r.status === 'Pending Verification').length}</div>
                  <div className="dash-stat-lbl">Open</div>
                </div>
              </div>

              <div className="dash-stat-card">
                <div className="dash-stat-icon teal">
                  <AlertCircle size={22} />
                </div>
                <div>
                  <div className="dash-stat-val">{issues.filter(r => r.status === 'In Progress' || r.status === 'Assigned').length}</div>
                  <div className="dash-stat-lbl">In Progress</div>
                </div>
              </div>

              <div className="dash-stat-card">
                <div className="stat-icon-wrapper blue">
                  <CheckCircle2 size={22} />
                </div>
                <div>
                  <div className="dash-stat-val">{issues.filter(r => r.status === 'Resolved').length}</div>
                  <div className="dash-stat-lbl">Resolved</div>
                </div>
              </div>
            </div>

            {/* MAIN ACTIONS BAR */}
            <div className="dash-actions-bar">
              <button className="btn btn-primary" onClick={() => setActiveTab('report-issue')}>
                <PlusCircle size={18} /> Report a Community Issue
              </button>
              <button className="btn btn-secondary" onClick={() => setActiveTab('my-reports')}>
                <FileText size={18} /> Track My Reports
              </button>
              <button className="btn btn-outline" onClick={() => setActiveTab('community-issues')}>
                <Layers size={18} /> View Community Issues
              </button>
            </div>

            {/* TWO COLUMN GRID CONTENT */}
            <div className="dash-two-col">
              
              {/* RECENT COMMUNITY PROBLEMS TABLE */}
              <div className="dash-card">
                <div className="dash-card-header">
                  <h3>Recent Community Reports</h3>
                  <span className="badge-tag">Live Village Feed</span>
                </div>

                <div className="table-responsive">
                  <table className="dash-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Issue & Category</th>
                        <th>Location</th>
                        <th>Status</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {issues.slice(0, 5).map((r) => (
                        <tr key={r.id}>
                          <td><code className="id-code">{r.id}</code></td>
                          <td>
                            <div className="table-title">{r.category}</div>
                            <div className="table-sub">{r.description.substring(0, 45)}...</div>
                          </td>
                          <td><MapPin size={14} className="inline-icon" /> {r.area}, {r.village}</td>
                          <td>
                            <span className={`status-pill ${r.status.toLowerCase().replace(/\s+/g, '-')}`}>
                              {r.status}
                            </span>
                          </td>
                          <td>{r.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* AI INSIGHTS & COMMUNITY MAP PANEL */}
              <div className="dash-side-panel">
                
                {/* AI Insights Box */}
                <div className="dash-card ai-insight-card">
                  <div className="dash-card-header">
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Sparkles size={18} className="gradient-text" /> AI Village Insights
                    </h3>
                  </div>
                  <div className="ai-insight-content">
                    <div className="ai-alert-item">
                      <div className="ai-bullet"></div>
                      <p><strong>Hotspot Alert:</strong> 38% of reports in Tuni relate to road damage. High priority automated flag sent.</p>
                    </div>
                    <div className="ai-alert-item">
                      <div className="ai-bullet"></div>
                      <p><strong>Resolution Velocity:</strong> Average resolution time improved by 35% this month due to direct Gram Panchayat routing.</p>
                    </div>
                  </div>
                </div>

                {/* Community Map Widget */}
                <div className="dash-card map-widget-card" style={{ marginTop: '1.25rem' }}>
                  <div className="dash-card-header">
                    <h3>Community Map</h3>
                    <button className="badge-tag" style={{ border: 'none', cursor: 'pointer' }} onClick={() => setActiveTab('map')}>
                      Open Map View &rarr;
                    </button>
                  </div>
                  <div className="map-placeholder-box">
                    <Map size={36} style={{ color: 'var(--primary-teal)', opacity: 0.8 }} />
                    <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                      Interactive Geo-Spatial Map of Tuni Village
                    </p>
                  </div>
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
      roleTitle="Citizen Workspace"
      sidebarItems={sidebarItems}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onLogout={onLogout}
    >
      {renderContent()}
    </DashboardLayout>
  );
}
