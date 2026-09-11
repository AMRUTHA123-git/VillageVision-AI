import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle2, AlertCircle, Info, Trash2, Target, Camera, MapPin, ArrowRight } from 'lucide-react';
import { getStoredIssues, getMyReports, subscribeToIssueUpdates, isIssueAdoptedByNGO } from '../utils/issueData';

export default function NotificationsPage({ user, onNavigate }) {
  const [readIds, setReadIds] = useState(new Set());
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

  const isNGO = user?.role === 'NGO / Volunteer' || user?.role === 'NGO' || user?.role === 'Volunteer';
  const userName = user?.fullName || user?.name || (isNGO ? 'NGO / Volunteer Organization' : 'Citizen');

  // Build Dynamic Role-Specific Notifications from real database issues
  const notifications = [];

  if (isNGO) {
    // -------------------------------------------------------------
    // NGO NOTIFICATIONS
    // -------------------------------------------------------------
    // 1. Open issues available for adoption
    const openIssues = issues.filter(i => !i.adopted && i.status !== 'Resolved' && !i.resolved);
    openIssues.forEach((iss) => {
      notifications.push({
        id: `ngo-open-${iss.id}`,
        issueId: iss.id,
        type: 'alert',
        title: `📢 New Report Available for Adoption (${iss.id})`,
        desc: `New ${iss.priority} Priority report for "${iss.category}" in ${iss.area}, ${iss.village}. Available for your organization to adopt.`,
        date: `${iss.date} ${iss.time ? `(${iss.time})` : ''}`,
        icon: <Target size={18} style={{ color: '#ea580c' }} />,
        actionTab: 'community-issues'
      });
    });

    // 2. Issues adopted by this NGO
    const adoptedByMe = issues.filter(i => isIssueAdoptedByNGO(i, user));
    adoptedByMe.forEach((iss) => {
      if (!iss.resolved && iss.status !== 'Resolved') {
        notifications.push({
          id: `ngo-adopted-${iss.id}`,
          issueId: iss.id,
          type: 'info',
          title: `🛠️ Field Work in Progress: ${iss.category} (${iss.id})`,
          desc: `You adopted this issue on ${iss.adoptedDate || iss.date}. Please capture an After-Solution photo once work is completed to mark it as Resolved.`,
          date: `${iss.adoptedDate || iss.date} ${iss.adoptedTime || ''}`,
          icon: <Camera size={18} style={{ color: '#2563eb' }} />,
          actionTab: 'adopted-issues'
        });
      } else {
        notifications.push({
          id: `ngo-resolved-${iss.id}`,
          issueId: iss.id,
          type: 'status',
          title: `✅ Issue Successfully Resolved: ${iss.category} (${iss.id})`,
          desc: `Your organization resolved this issue on ${iss.resolvedDate || iss.date}. Before and after solution photos are visible to the community.`,
          date: `${iss.resolvedDate || iss.date} ${iss.resolvedTime || ''}`,
          icon: <CheckCircle2 size={18} style={{ color: '#16a34a' }} />,
          actionTab: 'community-issues'
        });
      }
    });

    // 3. Welcome / System Notification
    notifications.push({
      id: 'ngo-sys-welcome',
      type: 'info',
      title: `Welcome, ${userName}!`,
      desc: 'VillageVision AI connects your organization with live citizen-reported civic issues across Visakhapatnam for rapid adoption and community impact.',
      date: 'Active Session',
      icon: <Info size={18} style={{ color: '#059669' }} />
    });

  } else {
    // -------------------------------------------------------------
    // CITIZEN NOTIFICATIONS
    // -------------------------------------------------------------
    const myReports = getMyReports(user);

    myReports.forEach((iss) => {
      if (iss.status === 'Resolved' || iss.resolved) {
        notifications.push({
          id: `cit-res-${iss.id}`,
          issueId: iss.id,
          type: 'status',
          title: `🎉 Problem Resolved: ${iss.category} (${iss.id})`,
          desc: `Great news! Your reported problem in ${iss.area}, ${iss.village} was resolved by ${iss.resolvedBy || 'Volunteer Organization'} on ${iss.resolvedDate || iss.date}. View Before & After photos in My Reports.`,
          date: `${iss.resolvedDate || iss.date} ${iss.resolvedTime || ''}`,
          icon: <CheckCircle2 size={18} style={{ color: '#16a34a' }} />,
          actionTab: 'my-reports'
        });
      } else if (iss.adopted) {
        notifications.push({
          id: `cit-adopt-${iss.id}`,
          issueId: iss.id,
          type: 'info',
          title: `🤝 Report Adopted: ${iss.category} (${iss.id})`,
          desc: `Your report in ${iss.area}, ${iss.village} has been adopted by "${iss.adoptedBy}" on ${iss.adoptedDate || iss.date}. Ground work has started!`,
          date: `${iss.adoptedDate || iss.date} ${iss.adoptedTime || ''}`,
          icon: <Target size={18} style={{ color: '#2563eb' }} />,
          actionTab: 'my-reports'
        });
      } else {
        notifications.push({
          id: `cit-sub-${iss.id}`,
          issueId: iss.id,
          type: 'alert',
          title: `📝 Report Submitted: ${iss.category} (${iss.id})`,
          desc: `Your issue in ${iss.area}, ${iss.village} (${iss.pincode || 'Visakhapatnam'}) has been registered with status "Open". Local volunteer groups and NGOs have been notified.`,
          date: `${iss.date} ${iss.time ? `(${iss.time})` : ''}`,
          icon: <CheckCircle2 size={18} style={{ color: '#059669' }} />,
          actionTab: 'my-reports'
        });
      }
    });

    // Welcome / General Notification
    notifications.push({
      id: 'cit-sys-welcome',
      type: 'info',
      title: `Welcome to VillageVision AI, ${userName}!`,
      desc: 'Use the "Report Issue" tab with GPS location to report road damage, sanitation, or water leakages directly to Visakhapatnam community responders.',
      date: 'Active Session',
      icon: <Info size={18} style={{ color: '#059669' }} />,
      actionTab: 'report-issue'
    });
  }

  const markAllRead = () => {
    const all = new Set(notifications.map(n => n.id));
    setReadIds(all);
  };

  const toggleRead = (id) => {
    const updated = new Set(readIds);
    if (updated.has(id)) {
      updated.delete(id);
    } else {
      updated.add(id);
    }
    setReadIds(updated);
  };

  return (
    <div className="notifications-wrapper">
      
      {/* HEADER */}
      <div className="dash-card-header" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="hero-title" style={{ fontSize: '1.85rem', textAlign: 'left', marginBottom: '0.25rem', color: '#0f172a' }}>
            Notification <span className="gradient-text">Center</span>
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
            {isNGO ? 'Track available community reports, adoption tasks, and resolution confirmations.' : 'Real-time updates on your submitted reports, NGO adoptions, and problem resolutions.'}
          </p>
        </div>
        <button className="btn btn-outline btn-sm" onClick={markAllRead}>
          <CheckCircle2 size={16} /> Mark All as Read
        </button>
      </div>

      {/* NOTIFICATIONS LIST */}
      <div className="dash-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '1.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {notifications.map((n) => {
            const isRead = readIds.has(n.id);

            return (
              <div 
                key={n.id}
                style={{
                  background: isRead ? '#f8fafc' : '#f0fdf4',
                  border: isRead ? '1.5px solid #e2e8f0' : '1.5px solid #86efac',
                  borderRadius: '14px',
                  padding: '1.25rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  boxShadow: isRead ? 'none' : '0 2px 8px rgba(16, 185, 129, 0.06)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    background: isRead ? '#e2e8f0' : '#dcfce7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {n.icon || <Bell size={18} />}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.25rem' }}>
                      {n.title}
                    </h4>
                    <p style={{ fontSize: '0.88rem', color: '#334155', lineHeight: '1.5', margin: 0 }}>
                      {n.desc}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.76rem', color: '#64748b', fontWeight: 600 }}>
                        🕒 {n.date}
                      </span>
                      {n.actionTab && onNavigate && (
                        <button 
                          onClick={() => onNavigate(n.actionTab)}
                          style={{ background: 'none', border: 'none', color: '#059669', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: 0 }}
                        >
                          Open in Dashboard <ArrowRight size={12} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <button 
                  className="btn btn-outline btn-sm"
                  onClick={() => toggleRead(n.id)}
                  style={{ fontSize: '0.76rem', padding: '0.35rem 0.65rem' }}
                >
                  {isRead ? "Mark Unread" : "Mark Read"}
                </button>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
