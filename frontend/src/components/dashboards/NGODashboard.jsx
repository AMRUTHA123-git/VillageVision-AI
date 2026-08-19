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
  HeartHandshake,
  PlusCircle,
  Layers,
  Rocket,
  Map,
  Users2,
  Award,
  Bell,
  User,
  MapPin,
  Heart,
  FileText,
  TrendingUp,
  CheckCircle2,
  Clock,
  Target
} from 'lucide-react';

import { getStoredIssues } from '../../utils/issueData';

export default function NGODashboard({ user, onLogout }) {

  const [activeTab, setActiveTab] = useState('dashboard');
  const [allIssues, setAllIssues] = useState([]);

  const [adoptedIssues, setAdoptedIssues] = useState([
    {
      id: 'VV-1025',
      title: 'Clean Water Filter Installation',
      location: 'Primary Healthcare Center',
      volunteersAssigned: 8,
      status: 'Active Initiative'
    }
  ]);

  useEffect(() => {
    setAllIssues(getStoredIssues());
  }, [activeTab]);

  // --------------------------------------------------
  // SIDEBAR
  // --------------------------------------------------

  const sidebarItems = [
    {
      id: 'dashboard',
      label: 'NGO Dashboard',
      icon: <HeartHandshake size={18} />
    },
    {
      id: 'report-issue',
      label: 'Report Issue',
      icon: <PlusCircle size={18} />
    },
    {
      id: 'my-reports',
      label: 'My Reports',
      icon: <FileText size={18} />
    },
    {
      id: 'community-issues',
      label: 'Community Issues',
      icon: <Layers size={18} />
    },
    {
      id: 'map',
      label: 'Community Map',
      icon: <Map size={18} />
    },
    {
      id: 'volunteers',
      label: 'Volunteers',
      icon: <Users2 size={18} />
    },
    {
      id: 'impact',
      label: 'Impact & Insights',
      icon: <Award size={18} />
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: <Bell size={18} />
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: <User size={18} />
    }
  ];

  // --------------------------------------------------
  // ADOPT ISSUE
  // --------------------------------------------------

  const handleAdopt = (issue) => {

    const alreadyAdopted = adoptedIssues.some(
      item => item.id === issue.id
    );

    if (alreadyAdopted) {
      return;
    }

    const newAdoption = {
      id: issue.id,
      title: issue.category,
      location: `${issue.area}, ${issue.village}`,
      volunteersAssigned: 5,
      status: 'Active Initiative'
    };

    setAdoptedIssues(prev => [
      newAdoption,
      ...prev
    ]);
  };

  // --------------------------------------------------
  // OPEN ISSUES
  // --------------------------------------------------

  const openIssues = allIssues.filter(
    issue =>
      issue.status !== 'Resolved'
  );

  // --------------------------------------------------
  // RENDER CONTENT
  // --------------------------------------------------

  const renderContent = () => {

    switch (activeTab) {

      case 'report-issue':
        return (
          <ReportIssuePage
            user={user}
            onNavigate={setActiveTab}
          />
        );

      case 'my-reports':
        return (
          <MyReportsPage
            user={user}
            onNavigate={setActiveTab}
          />
        );

      case 'community-issues':
        return (
          <CommunityIssuesPage
            user={user}
          />
        );

      case 'map':
        return (
          <CommunityMapPage />
        );

      case 'volunteers':
        return (
          <div className="dash-card">

            <div className="dash-card-header">
              <div>
                <h2>Volunteer Management</h2>
                <p style={{ color: 'var(--text-muted)' }}>
                  Manage volunteers supporting your community initiatives.
                </p>
              </div>

              <Users2 size={28} className="gradient-text" />
            </div>

            <div className="dash-stats-grid">

              <div className="dash-stat-card">
                <div className="stat-icon-wrapper blue">
                  <Users2 size={22} />
                </div>

                <div>
                  <div className="dash-stat-val">28</div>
                  <div className="dash-stat-lbl">
                    Registered Volunteers
                  </div>
                </div>
              </div>

              <div className="dash-stat-card">
                <div className="stat-icon-wrapper green">
                  <CheckCircle2 size={22} />
                </div>

                <div>
                  <div className="dash-stat-val">18</div>
                  <div className="dash-stat-lbl">
                    Active Volunteers
                  </div>
                </div>
              </div>

              <div className="dash-stat-card">
                <div className="stat-icon-wrapper orange">
                  <Clock size={22} />
                </div>

                <div>
                  <div className="dash-stat-val">6</div>
                  <div className="dash-stat-lbl">
                    Currently Assigned
                  </div>
                </div>
              </div>

            </div>

            <div style={{ marginTop: '2rem' }}>

              <h3>Volunteer Opportunities</h3>

              <div className="pending-cards-grid">

                <div className="ngo-issue-card">
                  <h4>Road Repair Support</h4>

                  <p className="issue-desc">
                    Volunteers can help coordinate materials,
                    awareness and local support for road repair.
                  </p>

                  <button className="btn btn-primary btn-sm">
                    <Users2 size={16} />
                    Find Volunteers
                  </button>
                </div>

                <div className="ngo-issue-card">
                  <h4>Clean Village Campaign</h4>

                  <p className="issue-desc">
                    Organize volunteers for a community
                    cleanliness campaign.
                  </p>

                  <button className="btn btn-primary btn-sm">
                    <Users2 size={16} />
                    Organize Campaign
                  </button>
                </div>

              </div>

            </div>

          </div>
        );

      case 'impact':
        return (
          <AIInsightsPage />
        );

      case 'notifications':
        return (
          <NotificationsPage />
        );

      case 'profile':
        return (
          <ProfilePage user={user} />
        );

      // --------------------------------------------------
      // NGO DASHBOARD HOME
      // --------------------------------------------------

      case 'dashboard':
      default:

        return (
          <>

            {/* HEADER */}

            <div
              className="dash-card"
              style={{
                marginBottom: '1.5rem',
                background:
                  'linear-gradient(135deg, rgba(16,185,129,0.12), rgba(20,184,166,0.04))'
              }}
            >

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '1rem',
                  flexWrap: 'wrap'
                }}
              >

                <div>

                  <h1
                    className="hero-title"
                    style={{
                      fontSize: '2rem',
                      textAlign: 'left',
                      marginBottom: '0.4rem'
                    }}
                  >
                    NGO Community
                    <span className="gradient-text">
                      {' '}Impact Center
                    </span>
                  </h1>

                  <p
                    style={{
                      color: 'var(--text-muted)',
                      fontSize: '0.95rem'
                    }}
                  >
                    Discover community problems, support local
                    development and create measurable social impact.
                  </p>

                </div>

                <HeartHandshake
                  size={52}
                  style={{
                    color: 'var(--primary-teal)',
                    opacity: 0.8
                  }}
                />

              </div>

            </div>


            {/* NGO STATS */}

            <div className="dash-stats-grid">

              <div className="dash-stat-card">

                <div className="stat-icon-wrapper blue">
                  <Layers size={22} />
                </div>

                <div>
                  <div className="dash-stat-val">
                    {openIssues.length}
                  </div>

                  <div className="dash-stat-lbl">
                    Issues Needing Support
                  </div>
                </div>

              </div>


              <div className="dash-stat-card">

                <div className="stat-icon-wrapper green">
                  <Heart size={22} />
                </div>

                <div>
                  <div className="dash-stat-val">
                    {adoptedIssues.length}
                  </div>

                  <div className="dash-stat-lbl">
                    Adopted Initiatives
                  </div>
                </div>

              </div>


              <div className="dash-stat-card">

                <div className="stat-icon-wrapper teal">
                  <Rocket size={22} />
                </div>

                <div>
                  <div className="dash-stat-val">
                    3
                  </div>

                  <div className="dash-stat-lbl">
                    Active Initiatives
                  </div>
                </div>

              </div>


              <div className="dash-stat-card">

                <div className="stat-icon-wrapper orange">
                  <Award size={22} />
                </div>

                <div>
                  <div className="dash-stat-val">
                    14
                  </div>

                  <div className="dash-stat-lbl">
                    Completed Projects
                  </div>
                </div>

              </div>

            </div>


            {/* QUICK ACTIONS */}

            <div
              className="dash-actions-bar"
              style={{ marginTop: '1.5rem' }}
            >

              <button
                className="btn btn-primary"
                onClick={() => setActiveTab('community-issues')}
              >
                <Heart size={18} />
                Find Issues to Adopt
              </button>

              <button
                className="btn btn-secondary"
                onClick={() => setActiveTab('volunteers')}
              >
                <Users2 size={18} />
                Manage Volunteers
              </button>

              <button
                className="btn btn-outline"
                onClick={() => setActiveTab('map')}
              >
                <Map size={18} />
                Explore Community Map
              </button>

            </div>


            {/* ISSUES NEEDING SUPPORT */}

            <div
              className="dash-section-box"
              style={{ marginTop: '1.5rem' }}
            >

              <div className="dash-section-header">

                <div>

                  <h3>
                    Community Issues Needing NGO Support
                  </h3>

                  <p
                    style={{
                      color: 'var(--text-muted)',
                      marginTop: '0.3rem'
                    }}
                  >
                    Select a problem where your organization
                    can provide resources, volunteers or expertise.
                  </p>

                </div>

                <span className="badge-tag">
                  {openIssues.length} Open Issues
                </span>

              </div>


              <div className="pending-cards-grid">

                {openIssues.slice(0, 4).map(issue => (

                  <div
                    key={issue.id}
                    className="ngo-issue-card"
                  >

                    <div className="authority-card-top">

                      <div>

                        <span
                          className={`priority-tag ${(
                            issue.priority || 'medium'
                          ).toLowerCase()}`}
                        >
                          {issue.priority} Priority
                        </span>

                        <h4 className="issue-card-title">
                          {issue.category}
                        </h4>

                      </div>

                      <code className="id-code">
                        {issue.id}
                      </code>

                    </div>


                    <div className="issue-meta-row">

                      <span>
                        <MapPin size={14} />

                        Location:

                        <strong>
                          {' '}
                          {issue.area}, {issue.village}
                        </strong>

                      </span>

                    </div>


                    <p className="issue-desc">
                      {issue.description}
                    </p>


                    <div
                      style={{
                        marginTop: '1.2rem',
                        display: 'flex',
                        gap: '0.75rem',
                        flexWrap: 'wrap'
                      }}
                    >

                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleAdopt(issue)}
                      >
                        <Heart size={16} />
                        Adopt Issue
                      </button>

                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => setActiveTab('volunteers')}
                      >
                        <Users2 size={16} />
                        Offer Volunteers
                      </button>

                    </div>

                  </div>

                ))}


                {openIssues.length === 0 && (

                  <div
                    style={{
                      padding: '2rem',
                      textAlign: 'center',
                      color: 'var(--text-muted)',
                      gridColumn: '1 / -1'
                    }}
                  >

                    <CheckCircle2
                      size={40}
                      style={{
                        color: 'var(--primary-teal)',
                        marginBottom: '0.75rem'
                      }}
                    />

                    <h3>
                      Great! No open community issues.
                    </h3>

                    <p>
                      Your community currently has no unresolved
                      issues requiring NGO support.
                    </p>

                  </div>

                )}

              </div>

            </div>


            {/* ADOPTED INITIATIVES */}

            <div
              className="dash-card"
              style={{ marginTop: '1.5rem' }}
            >

              <div className="dash-card-header">

                <div>

                  <h3>
                    My NGO Initiatives
                  </h3>

                  <p
                    style={{
                      color: 'var(--text-muted)',
                      marginTop: '0.25rem'
                    }}
                  >
                    Problems your organization has chosen to support.
                  </p>

                </div>

                <Target
                  size={24}
                  className="gradient-text"
                />

              </div>


              <div className="pending-cards-grid">

                {adoptedIssues.map(item => (

                  <div
                    key={item.id}
                    className="ngo-issue-card"
                  >

                    <div className="authority-card-top">

                      <div>

                        <span className="priority-tag low">
                          ACTIVE
                        </span>

                        <h4 className="issue-card-title">
                          {item.title}
                        </h4>

                      </div>

                      <code className="id-code">
                        {item.id}
                      </code>

                    </div>


                    <div className="issue-meta-row">

                      <span>
                        <MapPin size={14} />
                        {item.location}
                      </span>

                    </div>


                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: '1rem'
                      }}
                    >

                      <span
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          color: 'var(--text-muted)'
                        }}
                      >
                        <Users2 size={16} />
                        {item.volunteersAssigned} Volunteers
                      </span>

                      <span className="status-pill in-progress">
                        {item.status}
                      </span>

                    </div>

                  </div>

                ))}

              </div>

            </div>


            {/* IMPACT SUMMARY */}

            <div
              className="dash-card"
              style={{
                marginTop: '1.5rem',
                background:
                  'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(16,185,129,0.08))'
              }}
            >

              <div className="dash-card-header">

                <h3>
                  <TrendingUp
                    size={20}
                    style={{
                      verticalAlign: 'middle',
                      marginRight: '0.5rem'
                    }}
                  />
                  Community Impact
                </h3>

                <span className="badge-tag">
                  This Year
                </span>

              </div>


              <div className="dash-stats-grid">

                <div className="dash-stat-card">

                  <div className="stat-icon-wrapper green">
                    <Users2 size={22} />
                  </div>

                  <div>
                    <div className="dash-stat-val">
                      86
                    </div>

                    <div className="dash-stat-lbl">
                      People Benefited
                    </div>
                  </div>

                </div>


                <div className="dash-stat-card">

                  <div className="stat-icon-wrapper teal">
                    <Target size={22} />
                  </div>

                  <div>
                    <div className="dash-stat-val">
                      17
                    </div>

                    <div className="dash-stat-lbl">
                      Villages Reached
                    </div>
                  </div>

                </div>


                <div className="dash-stat-card">

                  <div className="stat-icon-wrapper blue">
                    <Rocket size={22} />
                  </div>

                  <div>
                    <div className="dash-stat-val">
                      14
                    </div>

                    <div className="dash-stat-lbl">
                      Projects Completed
                    </div>
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
      roleTitle="NGO Community Impact"
      sidebarItems={sidebarItems}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onLogout={onLogout}
    >
      {renderContent()}
    </DashboardLayout>
  );
}