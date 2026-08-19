import React from 'react';
import { Sparkles, PieChart, MapPin, AlertTriangle, Info } from 'lucide-react';

export default function AIInsightsPage() {
  const categoryBreakdown = [
    { category: 'Road Damage', percentage: 38, count: 24, color: '#10b981' },
    { category: 'Water Leakage', percentage: 24, count: 15, color: '#06b6d4' },
    { category: 'Garbage Overflow', percentage: 18, count: 11, color: '#f59e0b' },
    { category: 'Broken Streetlight', percentage: 12, count: 8, color: '#6366f1' },
    { category: 'Other', percentage: 8, count: 5, color: '#ec4899' },
  ];

  const locationProblems = [
    { location: 'Tuni (School Road)', mainIssue: 'Road Damage', riskLevel: 'High' },
    { location: 'Shamshabad (Main Road)', mainIssue: 'Garbage Overflow', riskLevel: 'Medium' },
    { location: 'Devanahalli (Temple Street)', mainIssue: 'Water Leakage & Drainage', riskLevel: 'High' },
  ];

  const highPriorityAreas = [
    { area: 'School Road', count: '6 Reports', status: 'Action Urged' },
    { area: 'Market Area', count: '4 Reports', status: 'Pending Review' },
    { area: 'Main Road', count: '3 Reports', status: 'In Progress' }
  ];

  return (
    <div className="ai-insights-wrapper">
      
      {/* HEADER */}
      <div className="dash-card-header" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h1 className="hero-title" style={{ fontSize: '2rem', textAlign: 'left', marginBottom: '0.25rem' }}>
            AI-Powered <span className="gradient-text">Community Insights</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.98rem' }}>
            Automated issue classification, problem category breakdown, and hotspot trend analysis.
          </p>
        </div>
        <span className="badge-tag">Demo Analytics Engine</span>
      </div>

      {/* EXPLANATION BANNER */}
      <div className="dash-card" style={{ marginBottom: '2rem', background: 'rgba(6, 182, 212, 0.08)', border: '1px solid rgba(6, 182, 212, 0.25)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
          <Sparkles size={24} style={{ color: '#22d3ee', flexShrink: 0, marginTop: '0.15rem' }} />
          <div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.35rem' }}>
              How AI Insights Empower Village Governance
            </h4>
            <p style={{ color: '#e0f2fe', fontSize: '0.92rem', lineHeight: '1.6' }}>
              AI analyzes reported issues to identify common problem categories, priority levels, and affected areas. 
              <em> (Note: These demonstration insights showcase how the production machine learning pipeline will aggregate live civic reports once connected to the Flask AI service.)</em>
            </p>
          </div>
        </div>
      </div>

      {/* THREE COLUMN / GRID METRICS */}
      <div className="dash-two-col" style={{ gridTemplateColumns: '1fr 1fr', gap: '1.75rem', marginBottom: '2rem' }}>
        
        {/* MOST REPORTED PROBLEMS BREAKDOWN */}
        <div className="dash-card">
          <div className="dash-card-header" style={{ marginBottom: '1.2rem' }}>
            <h3>Most Reported Problems</h3>
            <span className="badge-tag">Category Distribution</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            {categoryBreakdown.map((item) => (
              <div key={item.category}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.35rem' }}>
                  <strong style={{ color: '#ffffff' }}>{item.category}</strong>
                  <span style={{ color: 'var(--primary-teal)', fontWeight: 700 }}>{item.percentage}% ({item.count} reports)</span>
                </div>
                <div className="progress-bar-bg" style={{ height: '10px' }}>
                  <div className="progress-bar-fill" style={{ width: `${item.percentage}%`, background: item.color }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* HIGH PRIORITY AREAS & HOTSPOTS */}
        <div className="dash-card">
          <div className="dash-card-header" style={{ marginBottom: '1.2rem' }}>
            <h3>High Priority Areas</h3>
            <span className="badge-tag urgent">Hotspots</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {highPriorityAreas.map((h) => (
              <div key={h.area} style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '1rem 1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff' }}>
                    <MapPin size={16} style={{ color: 'var(--primary-teal)', display: 'inline', marginRight: '0.3rem' }} />
                    {h.area}
                  </h4>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Concentrated reports: {h.count}</span>
                </div>
                <span className="priority-tag high">{h.status}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* PROBLEMS BY LOCATION TABLE */}
      <div className="dash-card">
        <div className="dash-card-header">
          <h3>Problems by Location & Village Cluster</h3>
          <span className="badge-tag">Geographic Breakdown</span>
        </div>

        <div className="table-responsive">
          <table className="dash-table">
            <thead>
              <tr>
                <th>Location / Village Cluster</th>
                <th>Dominant Problem Category</th>
                <th>AI Risk Assessment</th>
              </tr>
            </thead>
            <tbody>
              {locationProblems.map((l, i) => (
                <tr key={i}>
                  <td className="table-title"><MapPin size={14} /> {l.location}</td>
                  <td><strong>{l.mainIssue}</strong></td>
                  <td><span className="priority-tag high">{l.riskLevel} Risk</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
