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
  TrendingUp, 
  Bell, 
  User, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  MapPin,
  ArrowRight,
  Store,
  Bus,
  HeartPulse,
  Droplets,
  Construction,
  Sparkles
} from 'lucide-react';
import { getStoredIssues, subscribeToIssueUpdates } from '../../utils/issueData';

export default function CitizenDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('home');
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    setIssues(getStoredIssues());

    const unsubscribe = subscribeToIssueUpdates((latest) => {
      setIssues(latest);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Clean, Compact Sidebar Options for Citizen
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

  // Calculated stats
  const totalCount = issues.length;
  const openCount = issues.filter(r => (r.status === 'Open' || r.status === 'Pending Verification') && !r.adopted && !r.resolved).length;
  const inProgressCount = issues.filter(r => r.status === 'In Progress' || r.status === 'Assigned' || (r.adopted && r.status !== 'Resolved' && !r.resolved)).length;
  const resolvedCount = issues.filter(r => r.status === 'Resolved' || r.resolved === true).length;

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
            <div className="dash-card-header" style={{ marginBottom: '1.25rem' }}>
              <div>
                <h1 className="hero-title" style={{ fontSize: '1.85rem', textAlign: 'left', marginBottom: '0.25rem', color: '#0f172a' }}>
                  Development <span className="gradient-text">Opportunities</span>
                </h1>
                <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
                  Identified civic and service development opportunities across Visakhapatnam communities.
                </p>
              </div>
              <span className="badge-tag">Community Development</span>
            </div>

            <div className="dash-stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
              
              <div className="dash-card" style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <Store size={22} style={{ color: '#059669' }} />
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Local Grocery Shop</h3>
                </div>
                <p style={{ color: '#64748b', fontSize: '0.88rem', lineHeight: '1.5' }}>
                  Some village clusters have limited access to nearby daily essentials and grocery shops.
                </p>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#059669', marginTop: '0.5rem' }}>
                  📍 Padmanabham, Visakhapatnam
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                  <span className="priority-tag high">High Need</span>
                  <button className="btn btn-outline" style={{ padding: '0.4rem 0.85rem', fontSize: '0.82rem' }} onClick={() => setActiveTab('map')}>
                    View on Map
                  </button>
                </div>
              </div>

              <div className="dash-card" style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <Bus size={22} style={{ color: '#0284c7' }} />
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Transportation Route</h3>
                </div>
                <p style={{ color: '#64748b', fontSize: '0.88rem', lineHeight: '1.5' }}>
                  Some locations need improved feeder transportation and bus frequency during peak hours.
                </p>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#059669', marginTop: '0.5rem' }}>
                  📍 Sabbavaram, Visakhapatnam
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                  <span className="priority-tag medium">Medium Need</span>
                  <button className="btn btn-outline" style={{ padding: '0.4rem 0.85rem', fontSize: '0.82rem' }} onClick={() => setActiveTab('map')}>
                    View on Map
                  </button>
                </div>
              </div>

              <div className="dash-card" style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <HeartPulse size={22} style={{ color: '#dc2626' }} />
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Healthcare Clinic</h3>
                </div>
                <p style={{ color: '#64748b', fontSize: '0.88rem', lineHeight: '1.5' }}>
                  Some suburban and village areas would benefit from easier access to first-aid and pharmacy care.
                </p>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#059669', marginTop: '0.5rem' }}>
                  📍 Anandapuram, Visakhapatnam
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                  <span className="priority-tag high">High Need</span>
                  <button className="btn btn-outline" style={{ padding: '0.4rem 0.85rem', fontSize: '0.82rem' }} onClick={() => setActiveTab('map')}>
                    View on Map
                  </button>
                </div>
              </div>

            </div>

            <div className="dash-card" style={{ marginTop: '1.5rem', background: '#ecfdf5', border: '1px solid #a7f3d0' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#065f46', marginBottom: '0.4rem' }}>
                💡 How VillageVision AI Identifies Opportunities
              </h3>
              <p style={{ color: '#047857', fontSize: '0.88rem', lineHeight: '1.6' }}>
                VillageVision AI evaluates citizen requests and geographic amenity gaps across Visakhapatnam to highlight locations where community businesses, micro-clinics, and transport services can make the highest impact.
              </p>
            </div>
          </div>
        );
      case 'notifications':
        return <NotificationsPage />;
      case 'profile':
        return <ProfilePage user={user} onLogout={onLogout} />;
      case 'home':
      default:
        return (
          <>
            {/* 1. OVERVIEW STAT CARDS (4 Cards) */}
            <div className="dash-stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem', marginBottom: '1.5rem' }}>
              
              {/* Total Reports */}
              <div className="dash-stat-card">
                <div className="stat-icon-wrapper green" style={{ background: '#ecfdf5', color: '#059669' }}>
                  <FileText size={22} />
                </div>
                <div>
                  <div className="dash-stat-val" style={{ color: '#0f172a' }}>{totalCount}</div>
                  <div className="dash-stat-lbl">Total Reports</div>
                </div>
              </div>

              {/* Open */}
              <div className="dash-stat-card">
                <div className="stat-icon-wrapper orange" style={{ background: '#fff7ed', color: '#ea580c' }}>
                  <Clock size={22} />
                </div>
                <div>
                  <div className="dash-stat-val" style={{ color: '#ea580c' }}>{openCount}</div>
                  <div className="dash-stat-lbl">Open</div>
                </div>
              </div>

              {/* In Progress */}
              <div className="dash-stat-card">
                <div className="stat-icon-wrapper blue" style={{ background: '#eff6ff', color: '#2563eb' }}>
                  <AlertCircle size={22} />
                </div>
                <div>
                  <div className="dash-stat-val" style={{ color: '#2563eb' }}>{inProgressCount}</div>
                  <div className="dash-stat-lbl">In Progress</div>
                </div>
              </div>

              {/* Resolved */}
              <div className="dash-stat-card">
                <div className="stat-icon-wrapper green" style={{ background: '#f0fdf4', color: '#16a34a' }}>
                  <CheckCircle2 size={22} />
                </div>
                <div>
                  <div className="dash-stat-val" style={{ color: '#16a34a' }}>{resolvedCount}</div>
                  <div className="dash-stat-lbl">Resolved</div>
                </div>
              </div>

            </div>

            {/* 2. QUICK ACTIONS (3 Large Clean Cards) */}
            <div className="dash-card" style={{ marginBottom: '1.5rem', padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>
                Quick Actions
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }}>
                
                {/* Action 1: Report Issue */}
                <button
                  onClick={() => setActiveTab('report-issue')}
                  className="quick-action-card"
                  style={{
                    background: '#ffffff',
                    border: '1.5px solid #e2e8f0',
                    borderRadius: '16px',
                    padding: '1.25rem',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                  }}
                >
                  <div>
                    <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.85rem' }}>
                      <PlusCircle size={22} />
                    </div>
                    <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.25rem' }}>
                      📝 Report an Issue
                    </div>
                    <div style={{ fontSize: '0.84rem', color: '#64748b' }}>
                      Report a new community problem with location & photos
                    </div>
                  </div>
                  <div style={{ marginTop: '1rem', fontSize: '0.84rem', fontWeight: 700, color: '#059669', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    Start Report <ArrowRight size={14} />
                  </div>
                </button>

                {/* Action 2: Track My Reports */}
                <button
                  onClick={() => setActiveTab('my-reports')}
                  className="quick-action-card"
                  style={{
                    background: '#ffffff',
                    border: '1.5px solid #e2e8f0',
                    borderRadius: '16px',
                    padding: '1.25rem',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                  }}
                >
                  <div>
                    <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.85rem' }}>
                      <FileText size={22} />
                    </div>
                    <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.25rem' }}>
                      📋 Track My Reports
                    </div>
                    <div style={{ fontSize: '0.84rem', color: '#64748b' }}>
                      Check real-time resolution status of your submitted reports
                    </div>
                  </div>
                  <div style={{ marginTop: '1rem', fontSize: '0.84rem', fontWeight: 700, color: '#2563eb', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    View Status <ArrowRight size={14} />
                  </div>
                </button>

                {/* Action 3: View Community Map */}
                <button
                  onClick={() => setActiveTab('map')}
                  className="quick-action-card"
                  style={{
                    background: '#ffffff',
                    border: '1.5px solid #e2e8f0',
                    borderRadius: '16px',
                    padding: '1.25rem',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                  }}
                >
                  <div>
                    <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#fdf4ff', color: '#a855f7', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.85rem' }}>
                      <Map size={22} />
                    </div>
                    <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.25rem' }}>
                      🗺️ View Community Map
                    </div>
                    <div style={{ fontSize: '0.84rem', color: '#64748b' }}>
                      Explore geo-tagged issues and problem spots in your area
                    </div>
                  </div>
                  <div style={{ marginTop: '1rem', fontSize: '0.84rem', fontWeight: 700, color: '#a855f7', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    Explore Map <ArrowRight size={14} />
                  </div>
                </button>

              </div>
            </div>

            {/* 3. RECENT REPORTS TABLE */}
            <div className="dash-card" style={{ marginBottom: '1.5rem' }}>
              <div className="dash-card-header" style={{ marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    Recent Reports
                  </h3>
                  <p style={{ color: '#64748b', fontSize: '0.84rem', margin: '0.2rem 0 0' }}>
                    Latest community problem logs and resolution progress
                  </p>
                </div>
                <button className="btn btn-outline" style={{ fontSize: '0.82rem', padding: '0.4rem 0.85rem' }} onClick={() => setActiveTab('community-issues')}>
                  View All Issues &rarr;
                </button>
              </div>

              <div className="table-responsive">
                <table className="dash-table">
                  <thead>
                    <tr>
                      <th>Issue ID</th>
                      <th>Problem</th>
                      <th>Location</th>
                      <th>Priority</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {issues.slice(0, 5).map((r) => {
                      const statusClass = r.status.toLowerCase().includes('open') ? 'open'
                        : r.status.toLowerCase().includes('progress') ? 'in-progress'
                        : 'resolved';

                      return (
                        <tr key={r.id}>
                          <td><code className="id-code" style={{ background: '#f1f5f9', color: '#059669', padding: '0.2rem 0.45rem', borderRadius: '6px' }}>{r.id}</code></td>
                          <td>
                            <div className="table-title" style={{ fontWeight: 700, color: '#0f172a' }}>{r.category}</div>
                            <div className="table-sub" style={{ fontSize: '0.8rem', color: '#64748b' }}>{r.description.substring(0, 45)}...</div>
                          </td>
                          <td style={{ fontSize: '0.86rem', color: '#334155' }}>
                            <MapPin size={13} style={{ color: '#059669', display: 'inline', marginRight: '0.25rem' }} /> 
                            {r.area}, {r.village}
                          </td>
                          <td>
                            <span className={`priority-tag ${(r.priority || 'Medium').toLowerCase()}`}>
                              {r.priority || 'Medium'}
                            </span>
                          </td>
                          <td>
                            <span className={`status-pill ${statusClass}`}>
                              {r.status}
                            </span>
                          </td>
                          <td style={{ fontSize: '0.84rem', color: '#64748b' }}>{r.date}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 4. TWO-COLUMN: COMMUNITY INSIGHTS & DEVELOPMENT OPPORTUNITIES PREVIEW */}
            <div className="dash-two-col" style={{ gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
              
              {/* Community Insights Preview (Visakhapatnam Focused) */}
              <div className="dash-card">
                <div className="dash-card-header" style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <Sparkles size={18} style={{ color: '#059669' }} />
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                      Community Insights
                    </h3>
                  </div>
                  <span className="badge-tag" style={{ fontSize: '0.72rem' }}>AI Prototype</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '0.85rem 1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
                      <Construction size={16} style={{ color: '#ea580c' }} />
                      <strong style={{ fontSize: '0.88rem', color: '#0f172a' }}>🚧 Road Damage</strong>
                    </div>
                    <p style={{ color: '#64748b', fontSize: '0.82rem', margin: 0, lineHeight: '1.4' }}>
                      Road-related issues are frequently reported in some Visakhapatnam village areas.
                    </p>
                  </div>

                  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '0.85rem 1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
                      <Droplets size={16} style={{ color: '#0284c7' }} />
                      <strong style={{ fontSize: '0.88rem', color: '#0f172a' }}>💧 Water & Sanitation</strong>
                    </div>
                    <p style={{ color: '#64748b', fontSize: '0.82rem', margin: 0, lineHeight: '1.4' }}>
                      Water supply and drainage complaints need attention in some locations.
                    </p>
                  </div>

                  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '0.85rem 1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
                      <TrendingUp size={16} style={{ color: '#059669' }} />
                      <strong style={{ fontSize: '0.88rem', color: '#0f172a' }}>🌱 Development</strong>
                    </div>
                    <p style={{ color: '#64748b', fontSize: '0.82rem', margin: 0, lineHeight: '1.4' }}>
                      Some areas in Visakhapatnam may benefit from additional local public facilities.
                    </p>
                  </div>
                </div>

                <button 
                  className="btn btn-outline" 
                  style={{ width: '100%', marginTop: '1rem', fontSize: '0.84rem' }}
                  onClick={() => setActiveTab('insights')}
                >
                  Explore Detailed AI Insights &rarr;
                </button>
              </div>

              {/* Development Opportunities Preview */}
              <div className="dash-card">
                <div className="dash-card-header" style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <Store size={18} style={{ color: '#059669' }} />
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                      Development Opportunities
                    </h3>
                  </div>
                  <span className="badge-tag">Service Gaps</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '0.85rem 1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
                      <Store size={16} style={{ color: '#059669' }} />
                      <strong style={{ fontSize: '0.88rem', color: '#0f172a' }}>🏪 Local Shop</strong>
                    </div>
                    <p style={{ color: '#64748b', fontSize: '0.82rem', margin: 0, lineHeight: '1.4' }}>
                      Some areas have limited access to nearby shops.
                    </p>
                  </div>

                  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '0.85rem 1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
                      <Bus size={16} style={{ color: '#0284c7' }} />
                      <strong style={{ fontSize: '0.88rem', color: '#0f172a' }}>🚌 Transportation</strong>
                    </div>
                    <p style={{ color: '#64748b', fontSize: '0.82rem', margin: 0, lineHeight: '1.4' }}>
                      Some locations may need better transportation access.
                    </p>
                  </div>

                  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '0.85rem 1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
                      <HeartPulse size={16} style={{ color: '#dc2626' }} />
                      <strong style={{ fontSize: '0.88rem', color: '#0f172a' }}>🏥 Healthcare</strong>
                    </div>
                    <p style={{ color: '#64748b', fontSize: '0.82rem', margin: 0, lineHeight: '1.4' }}>
                      Some areas may benefit from easier access to healthcare.
                    </p>
                  </div>
                </div>

                <button 
                  className="btn btn-outline" 
                  style={{ width: '100%', marginTop: '1rem', fontSize: '0.84rem' }}
                  onClick={() => setActiveTab('opportunities')}
                >
                  View All Opportunities &rarr;
                </button>
              </div>

            </div>

            {/* 5. COMMUNITY MAP PREVIEW */}
            <div className="dash-card">
              <div className="dash-card-header" style={{ marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    Community Map
                  </h3>
                  <p style={{ color: '#64748b', fontSize: '0.84rem', margin: '0.2rem 0 0' }}>
                    View reported issues in your community.
                  </p>
                </div>
                <button className="btn btn-primary" style={{ fontSize: '0.86rem', padding: '0.5rem 1.1rem' }} onClick={() => setActiveTab('map')}>
                  Open Map &rarr;
                </button>
              </div>

              <div 
                style={{
                  background: '#f8fafc',
                  border: '1.5px dashed #cbd5e1',
                  borderRadius: '16px',
                  padding: '2.5rem 1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  cursor: 'pointer'
                }}
                onClick={() => setActiveTab('map')}
              >
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.85rem' }}>
                  <Map size={28} />
                </div>
                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.25rem' }}>
                  Interactive Geographic Problem Map
                </h4>
                <p style={{ color: '#64748b', fontSize: '0.86rem', maxWidth: '420px', margin: '0 0 1rem' }}>
                  Locate resolved and ongoing issues with interactive status pins and location filtering.
                </p>
                <span className="btn btn-outline" style={{ fontSize: '0.82rem' }}>
                  Explore Fullscreen Map &rarr;
                </span>
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
