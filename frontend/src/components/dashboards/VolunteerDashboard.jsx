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
  Users2,
  PlusCircle,
  Layers,
  HandHeart,
  CheckSquare,
  Map,
  Award,
  Bell,
  User,
  MapPin,
  UserPlus,
  FileText,
  CalendarDays,
  Clock,
  Trophy,
  Target,
  Heart
} from 'lucide-react';

export default function VolunteerDashboard({ user, onLogout }) {

  const [activeTab, setActiveTab] = useState('dashboard');

  // Volunteer opportunities
  const [opportunities, setOpportunities] = useState([
    {
      id: 'VOL-201',
      title: 'Market Area Cleaning Drive',
      description: 'Help local residents clean the market area and remove accumulated garbage.',
      location: 'Market Area, Tuni',
      date: '2026-08-21',
      time: '08:00 AM',
      volunteersNeeded: 5,
      volunteersJoined: 2,
      category: 'Cleanliness'
    },
    {
      id: 'VOL-202',
      title: 'Tree Plantation Drive',
      description: 'Plant trees around the village boundary and help improve the local environment.',
      location: 'East Gram Border',
      date: '2026-08-23',
      time: '07:30 AM',
      volunteersNeeded: 10,
      volunteersJoined: 6,
      category: 'Environment'
    },
    {
      id: 'VOL-203',
      title: 'School Area Improvement',
      description: 'Help clean and organize the surroundings of the local government school.',
      location: 'Government School, Tuni',
      date: '2026-08-25',
      time: '09:00 AM',
      volunteersNeeded: 8,
      volunteersJoined: 3,
      category: 'Education'
    }
  ]);

  // Tasks joined by the volunteer
  const [myTasks, setMyTasks] = useState([
    {
      id: 'VOL-198',
      title: 'Community Water Filter Distribution',
      location: 'Panchayat Hall',
      status: 'Active',
      hoursContributed: 4
    }
  ]);

  const sidebarItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <Users2 size={18} />
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
      id: 'opportunities',
      label: 'Volunteer Opportunities',
      icon: <HandHeart size={18} />
    },
    {
      id: 'map',
      label: 'Community Map',
      icon: <Map size={18} />
    },
    {
      id: 'impact',
      label: 'My Impact',
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

  // Join an opportunity
  const handleJoinTask = (id) => {

    const task = opportunities.find(
      opportunity => opportunity.id === id
    );

    if (!task) return;

    setOpportunities(
      opportunities.filter(
        opportunity => opportunity.id !== id
      )
    );

    setMyTasks([
      {
        id: task.id,
        title: task.title,
        location: task.location,
        status: 'Active',
        hoursContributed: 0
      },
      ...myTasks
    ]);
  };

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
          <CommunityIssuesPage user={user} />
        );

      case 'map':
        return <CommunityMapPage />;

      case 'impact':
        return <AIInsightsPage />;

      case 'notifications':
        return <NotificationsPage />;

      case 'profile':
        return <ProfilePage user={user} />;

      case 'opportunities':
        return (
          <div>

            <div
              className="dash-card-header"
              style={{ marginBottom: '1.5rem' }}
            >
              <div>
                <h1
                  className="hero-title"
                  style={{
                    fontSize: '2rem',
                    textAlign: 'left',
                    marginBottom: '0.25rem'
                  }}
                >
                  Volunteer <span className="gradient-text">Opportunities</span>
                </h1>

                <p
                  style={{
                    color: 'var(--text-muted)'
                  }}
                >
                  Find local activities where you can contribute your time and skills.
                </p>
              </div>

              <span className="badge-tag">
                {opportunities.length} Open Opportunities
              </span>
            </div>

            <div className="pending-cards-grid">

              {opportunities.map((opp) => (

                <div
                  key={opp.id}
                  className="volunteer-card"
                >

                  <div className="authority-card-top">

                    <div>

                      <span className="badge-tag">
                        {opp.category}
                      </span>

                      <h4
                        className="issue-card-title"
                        style={{ marginTop: '0.5rem' }}
                      >
                        {opp.title}
                      </h4>

                    </div>

                    <code className="id-code">
                      {opp.id}
                    </code>

                  </div>

                  <p className="issue-desc">
                    {opp.description}
                  </p>

                  <div
                    className="issue-meta-row"
                    style={{
                      marginTop: '1rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.6rem'
                    }}
                  >

                    <span>
                      <MapPin size={14} />
                      <strong>{opp.location}</strong>
                    </span>

                    <span>
                      <CalendarDays size={14} />
                      {opp.date}
                    </span>

                    <span>
                      <Clock size={14} />
                      {opp.time}
                    </span>

                    <span>
                      <Users2 size={14} />
                      {opp.volunteersJoined} / {opp.volunteersNeeded} volunteers joined
                    </span>

                  </div>

                  <button
                    className="btn btn-primary btn-sm"
                    style={{
                      marginTop: '1.2rem',
                      width: '100%',
                      justifyContent: 'center'
                    }}
                    onClick={() => handleJoinTask(opp.id)}
                  >
                    <UserPlus size={16} />
                    Join This Opportunity
                  </button>

                </div>

              ))}

            </div>

          </div>
        );

      case 'dashboard':
      default:

        return (
          <>

            {/* WELCOME SECTION */}

            <div
              className="dash-card"
              style={{
                marginBottom: '1.5rem',
                background:
                  'linear-gradient(135deg, rgba(20,184,166,0.12), rgba(16,185,129,0.05))'
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
                    style={{
                      margin: 0,
                      fontSize: '1.8rem'
                    }}
                  >
                    Welcome, {user?.fullName || 'Volunteer'} 👋
                  </h1>

                  <p
                    style={{
                      color: 'var(--text-muted)',
                      marginTop: '0.5rem'
                    }}
                  >
                    Your time can make a real difference in the community.
                  </p>

                </div>

                <button
                  className="btn btn-primary"
                  onClick={() => setActiveTab('opportunities')}
                >
                  <HandHeart size={18} />
                  Find Opportunities
                </button>

              </div>

            </div>


            {/* VOLUNTEER STATS */}

            <div className="dash-stats-grid">

              <div className="dash-stat-card">

                <div className="stat-icon-wrapper blue">
                  <Target size={22} />
                </div>

                <div>
                  <div className="dash-stat-val">
                    {opportunities.length}
                  </div>

                  <div className="dash-stat-lbl">
                    Opportunities
                  </div>
                </div>

              </div>


              <div className="dash-stat-card">

                <div className="stat-icon-wrapper teal">
                  <CheckSquare size={22} />
                </div>

                <div>
                  <div className="dash-stat-val">
                    {myTasks.length}
                  </div>

                  <div className="dash-stat-lbl">
                    My Tasks
                  </div>
                </div>

              </div>


              <div className="dash-stat-card">

                <div className="stat-icon-wrapper green">
                  <Clock size={22} />
                </div>

                <div>
                  <div className="dash-stat-val">
                    {myTasks.reduce(
                      (total, task) =>
                        total + task.hoursContributed,
                      0
                    )}
                  </div>

                  <div className="dash-stat-lbl">
                    Hours Contributed
                  </div>

                </div>

              </div>


              <div className="dash-stat-card">

                <div className="stat-icon-wrapper orange">
                  <Trophy size={22} />
                </div>

                <div>

                  <div className="dash-stat-val">
                    {myTasks.length}
                  </div>

                  <div className="dash-stat-lbl">
                    Completed / Active
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
                onClick={() => setActiveTab('opportunities')}
              >
                <HandHeart size={18} />
                Find Volunteer Work
              </button>

              <button
                className="btn btn-secondary"
                onClick={() => setActiveTab('my-reports')}
              >
                <FileText size={18} />
                My Reports
              </button>

              <button
                className="btn btn-outline"
                onClick={() => setActiveTab('map')}
              >
                <Map size={18} />
                Explore Community Map
              </button>

            </div>


            {/* UPCOMING OPPORTUNITIES */}

            <div
              className="dash-section-box"
              style={{ marginTop: '1.5rem' }}
            >

              <div className="dash-section-header">

                <div>

                  <h3>
                    Upcoming Volunteer Work
                  </h3>

                  <p
                    style={{
                      color: 'var(--text-muted)',
                      fontSize: '0.85rem',
                      marginTop: '0.3rem'
                    }}
                  >
                    Join an activity and contribute to your community.
                  </p>

                </div>

                <button
                  className="badge-tag"
                  style={{
                    border: 'none',
                    cursor: 'pointer'
                  }}
                  onClick={() => setActiveTab('opportunities')}
                >
                  View All →
                </button>

              </div>


              <div className="pending-cards-grid">

                {opportunities
                  .slice(0, 2)
                  .map((opp) => (

                    <div
                      key={opp.id}
                      className="volunteer-card"
                    >

                      <div className="authority-card-top">

                        <div>

                          <span className="badge-tag">
                            {opp.category}
                          </span>

                          <h4 className="issue-card-title">
                            {opp.title}
                          </h4>

                        </div>

                        <code className="id-code">
                          {opp.id}
                        </code>

                      </div>


                      <div className="issue-meta-row">

                        <span>
                          <MapPin size={14} />
                          <strong>
                            {opp.location}
                          </strong>
                        </span>

                        <span>
                          <CalendarDays size={14} />
                          {opp.date}
                        </span>

                      </div>


                      <button
                        className="btn btn-primary btn-sm"
                        style={{
                          marginTop: '1rem',
                          width: '100%',
                          justifyContent: 'center'
                        }}
                        onClick={() =>
                          handleJoinTask(opp.id)
                        }
                      >

                        <UserPlus size={16} />

                        Join Opportunity

                      </button>

                    </div>

                  ))}

              </div>

            </div>


            {/* MY CURRENT TASKS */}

            <div
              className="dash-section-box"
              style={{ marginTop: '1.5rem' }}
            >

              <div className="dash-section-header">

                <h3>
                  My Current Tasks
                </h3>

                <span className="badge-tag">
                  {myTasks.length} Active
                </span>

              </div>


              {myTasks.map((task) => (

                <div
                  key={task.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '1rem',
                    borderBottom:
                      '1px solid var(--border-color)',
                    gap: '1rem',
                    flexWrap: 'wrap'
                  }}
                >

                  <div>

                    <h4
                      style={{
                        margin: 0
                      }}
                    >
                      {task.title}
                    </h4>

                    <p
                      style={{
                        margin: '0.35rem 0',
                        color: 'var(--text-muted)'
                      }}
                    >
                      <MapPin
                        size={14}
                        style={{
                          verticalAlign: 'middle'
                        }}
                      />{' '}
                      {task.location}
                    </p>

                    <small
                      style={{
                        color: 'var(--text-muted)'
                      }}
                    >
                      {task.hoursContributed} hours contributed
                    </small>

                  </div>


                  <span className="status-pill in-progress">
                    {task.status}
                  </span>

                </div>

              ))}

            </div>


            {/* MOTIVATION CARD */}

            <div
              className="dash-card"
              style={{
                marginTop: '1.5rem',
                textAlign: 'center',
                padding: '2rem'
              }}
            >

              <Heart
                size={34}
                style={{
                  color: 'var(--primary-teal)',
                  marginBottom: '0.7rem'
                }}
              />

              <h3>
                Small Actions. Big Impact. 💚
              </h3>

              <p
                style={{
                  color: 'var(--text-muted)',
                  maxWidth: '600px',
                  margin: '0.5rem auto 0'
                }}
              >
                Every hour you contribute helps improve
                your village and creates a stronger community.
              </p>

            </div>

          </>
        );
    }
  };

  return (

    <DashboardLayout
      user={user}
      roleTitle="Volunteer Workspace"
      sidebarItems={sidebarItems}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onLogout={onLogout}
    >

      {renderContent()}

    </DashboardLayout>

  );
}