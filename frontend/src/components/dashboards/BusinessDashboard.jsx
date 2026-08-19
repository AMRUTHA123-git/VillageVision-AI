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
  Briefcase, 
  PlusCircle, 
  TrendingUp, 
  Lightbulb, 
  Rocket, 
  Map, 
  Bell, 
  User, 
  MapPin, 
  Sparkles, 
  Store, 
  ThumbsUp, 
  CheckCircle2, 
  FileText 
} from 'lucide-react';

export default function BusinessDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard');

  const [opportunities, setOpportunities] = useState([
    {
      id: 'BIZ-301',
      title: 'Pani Puri / Food Stall',
      location: 'Market Area',
      category: 'Food & Beverage',
      footfall: 'High Footfall (800+ daily)',
      aiInsight: '"High footfall area near evening bus stop with zero hygienic food vendors."',
      interested: false
    },
    {
      id: 'BIZ-302',
      title: 'Pharmacy & Medical Shop',
      location: 'Sector 2 (Near Clinic)',
      category: 'Healthcare',
      footfall: 'Medium-High Demand',
      aiInsight: '"Nearest pharmacy is 6km away. 92% of villagers surveyed requested local medicine access."',
      interested: false
    },
    {
      id: 'BIZ-303',
      title: 'Fresh Organic Grocery Store',
      location: 'Main Gram Intersection',
      category: 'Retail',
      footfall: 'High Footfall (1,200+ daily)',
      aiInsight: '"Demand for packaged staples and cold storage dairy is unmet in East Gram."',
      interested: false
    },
    {
      id: 'BIZ-304',
      title: 'Shared Auto / Transportation Hub',
      location: 'Village Entrance Gate',
      category: 'Mobility',
      footfall: 'Peak Hours Demand',
      aiInsight: '"Commuters report 45-minute wait times during morning factory shifts."',
      interested: false
    }
  ]);

  const [myInterests, setMyInterests] = useState([
    { id: 'BIZ-299', title: 'Solar Kiosk & Mobile Charging Station', location: 'Panchayat Center', status: 'Under Review' }
  ]);

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Briefcase size={18} /> },
    { id: 'report-issue', label: 'Report Issue', icon: <PlusCircle size={18} /> },
    { id: 'my-reports', label: 'My Reports', icon: <FileText size={18} /> },
    { id: 'opportunities', label: 'Opportunities', icon: <Store size={18} /> },
    { id: 'community-issues', label: 'Community Needs', icon: <Lightbulb size={18} /> },
    { id: 'insights', label: 'Market Insights', icon: <TrendingUp size={18} /> },
    { id: 'map', label: 'Community Map', icon: <Map size={18} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
    { id: 'profile', label: 'Profile', icon: <User size={18} /> },
  ];

  const handleExpressInterest = (id) => {
    const opp = opportunities.find(o => o.id === id);
    if (!opp) return;

    const updated = opportunities.map(o => o.id === id ? { ...o, interested: true } : o);
    setOpportunities(updated);

    setMyInterests([{
      id: opp.id,
      title: opp.title,
      location: opp.location,
      status: 'Interest Submitted'
    }, ...myInterests]);
  };

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
      case 'notifications':
        return <NotificationsPage />;
      case 'profile':
        return <ProfilePage user={user} />;
      case 'opportunities':
      case 'dashboard':
      default:
        return (
          <>
            {/* STATS CARDS FOR BUSINESS */}
            <div className="dash-stats-grid">
              <div className="dash-stat-card">
                <div className="stat-icon-wrapper blue">
                  <Store size={22} />
                </div>
                <div>
                  <div className="dash-stat-val">{opportunities.length}</div>
                  <div className="dash-stat-lbl">Available Opportunities</div>
                </div>
              </div>

              <div className="dash-stat-card">
                <div className="stat-icon-wrapper green">
                  <TrendingUp size={22} />
                </div>
                <div>
                  <div className="dash-stat-val">3 Areas</div>
                  <div className="dash-stat-lbl">High Demand Areas</div>
                </div>
              </div>

              <div className="dash-stat-card">
                <div className="stat-icon-wrapper teal">
                  <ThumbsUp size={22} />
                </div>
                <div>
                  <div className="dash-stat-val">{myInterests.length}</div>
                  <div className="dash-stat-lbl">My Interests</div>
                </div>
              </div>
            </div>

            {/* MARKET OPPORTUNITIES SECTION */}
            <div className="dash-section-box">
              <div className="dash-section-header">
                <h3>Market & Entrepreneurial Opportunities</h3>
                <span className="badge-tag">AI Demand Driven</span>
              </div>

              <div className="pending-cards-grid">
                {opportunities.map((opp) => (
                  <div key={opp.id} className="biz-card">
                    <div className="authority-card-top">
                      <div>
                        <span className="priority-tag medium">{opp.category}</span>
                        <h4 className="issue-card-title">{opp.title}</h4>
                      </div>
                      <code className="id-code">{opp.id}</code>
                    </div>

                    <div className="issue-meta-row" style={{ marginTop: '0.6rem' }}>
                      <span><MapPin size={14} /> Location: <strong>{opp.location}</strong></span>
                      <span>Demand: <strong>{opp.footfall}</strong></span>
                    </div>

                    <div className="ai-business-insight">
                      <Sparkles size={16} className="sparkle-icon" />
                      <p><strong>AI Insight:</strong> {opp.aiInsight}</p>
                    </div>

                    <button 
                      className={`btn ${opp.interested ? 'btn-secondary' : 'btn-primary'} btn-sm`}
                      style={{ marginTop: '1.2rem', width: '100%', justifyContent: 'center' }}
                      onClick={() => handleExpressInterest(opp.id)}
                      disabled={opp.interested}
                    >
                      {opp.interested ? (
                        <>
                          <CheckCircle2 size={16} /> Interest Expressed
                        </>
                      ) : (
                        <>
                          <ThumbsUp size={16} /> I'm Interested
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <DashboardLayout
      user={user}
      roleTitle="Business Opportunities"
      sidebarItems={sidebarItems}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onLogout={onLogout}
    >
      {renderContent()}
    </DashboardLayout>
  );
}
