import React, { useState } from 'react';
import { 
  Sparkles, 
  LogOut, 
  Bell, 
  Shield, 
  Menu, 
  X, 
  User as UserIcon,
  ChevronRight
} from 'lucide-react';

export default function DashboardLayout({ 
  user, 
  roleTitle, 
  sidebarItems = [], 
  activeTab, 
  onTabChange, 
  onLogout, 
  children 
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const notifications = [
    { id: 1, text: "Road damage report updated to 'In Progress'", time: "10m ago" },
    { id: 2, text: "New community issue reported in Sector 4", time: "2h ago" },
    { id: 3, text: "AI anomaly detected in water supply reports", time: "5h ago" }
  ];

  return (
    <div className="dashboard-wrapper">
      
      {/* SIDEBAR NAVIGATION */}
      <aside className={`dashboard-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="brand-logo">
            <div className="logo-icon">
              <Sparkles size={20} />
            </div>
            <span>VillageVision <span className="gradient-text">AI</span></span>
          </div>
          <button 
            className="sidebar-close-btn" 
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* User Role Tag */}
        <div className="sidebar-role-box">
          <div className="role-tag-label">Active Workspace</div>
          <div className="role-tag-title">{roleTitle}</div>
        </div>

        {/* Navigation Items */}
        <nav className="sidebar-nav">
          <ul className="sidebar-menu">
            {sidebarItems.map((item, idx) => {
              const isActive = activeTab === item.id || (!activeTab && idx === 0);
              return (
                <li key={item.id}>
                  <button
                    className={`sidebar-link ${isActive ? 'active' : ''}`}
                    onClick={() => {
                      if (onTabChange) onTabChange(item.id);
                      setSidebarOpen(false);
                    }}
                  >
                    <span className="sidebar-icon">{item.icon}</span>
                    <span className="sidebar-text">{item.label}</span>
                    {isActive && <ChevronRight size={16} className="active-arrow" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Sidebar Footer Logout */}
        <div className="sidebar-footer">
          <button className="sidebar-logout-btn" onClick={onLogout}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT WRAPPER */}
      <div className="dashboard-main-area">
        
        {/* TOP HEADER BAR */}
        <header className="dashboard-topbar">
          <div className="topbar-left">
            <button 
              className="sidebar-toggle-btn" 
              onClick={() => setSidebarOpen(true)}
              aria-label="Toggle sidebar"
            >
              <Menu size={22} />
            </button>
            <div>
              <h2 className="topbar-greeting">
                Welcome back, <span className="gradient-text">{user?.fullName || 'Citizen'}</span> 👋
              </h2>
              <p className="topbar-subtitle" style={{ fontSize: '0.82rem', color: '#64748b', margin: 0, fontWeight: 500 }}>
                Help make your community better.
              </p>
            </div>
          </div>

          <div className="topbar-right">
            {/* Role Badge */}
            <div className="role-security-pill">
              <Shield size={14} className="pill-icon" />
              <span>{user?.role || 'Citizen'}</span>
            </div>

            {/* Notifications Menu */}
            <div className="notifications-dropdown-container">
              <button 
                className="topbar-icon-btn" 
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                aria-label="Notifications"
              >
                <Bell size={20} />
                <span className="notification-dot"></span>
              </button>

              {notificationsOpen && (
                <div className="notifications-menu">
                  <div className="notif-header">
                    <h4>Notifications</h4>
                    <span className="notif-count">3 New</span>
                  </div>
                  <ul className="notif-list">
                    {notifications.map(n => (
                      <li key={n.id} className="notif-item">
                        <p className="notif-text">{n.text}</p>
                        <span className="notif-time">{n.time}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* User Profile Avatar */}
            <div className="user-profile-avatar" style={{ cursor: 'pointer' }} onClick={() => onTabChange && onTabChange('profile')}>
              <UserIcon size={18} />
            </div>

            {/* Topbar Logout Button */}
            <button className="topbar-logout-btn" onClick={onLogout} title="Logout">
              <LogOut size={18} />
            </button>
          </div>
        </header>

        {/* DASHBOARD PAGE CONTENT */}
        <main className="dashboard-content-container">
          {children}
        </main>
      </div>

    </div>
  );
}
