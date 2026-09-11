import React, { useState, useEffect, useMemo } from 'react';
import { 
  Sparkles, 
  MapPin, 
  TrendingUp, 
  AlertTriangle, 
  Droplets, 
  Zap, 
  HeartPulse, 
  Building, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Inbox,
  BarChart3,
  Layers,
  FileText
} from 'lucide-react';
import { 
  getStoredIssues, 
  fetchIssuesFromBackend, 
  subscribeToIssueUpdates 
} from '../utils/issueData';

// Helper to render markdown-style **bold** tags cleanly in JSX
function renderFormattedText(text) {
  if (!text) return null;
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={index} style={{ color: '#0f172a', fontWeight: 800 }}>
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

export default function AIInsightsPage() {
  const [issues, setIssues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedArea, setSelectedArea] = useState('All');

  // Load real issues from backend & subscribe to live updates
  useEffect(() => {
    // 1. Initial cached issues in memory
    const cached = getStoredIssues();
    if (Array.isArray(cached) && cached.length > 0) {
      setIssues(cached);
      setIsLoading(false);
    }

    // 2. Fetch fresh issue dataset directly from Flask backend / SQLite
    fetchIssuesFromBackend()
      .then(fresh => {
        if (Array.isArray(fresh)) {
          setIssues(fresh);
        }
      })
      .catch(err => {
        console.warn('[AIInsights] Could not fetch fresh issues:', err);
      })
      .finally(() => {
        setIsLoading(false);
      });

    // 3. Real-time subscriber for new reports, adoptions, and resolutions
    const unsubscribe = subscribeToIssueUpdates((latest) => {
      if (Array.isArray(latest)) {
        setIssues(latest);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Extract all unique villages/areas dynamically from real database records
  const dynamicAreas = useMemo(() => {
    const areaSet = new Set();
    issues.forEach(i => {
      if (i.village && i.village.trim()) areaSet.add(i.village.trim());
    });
    const sorted = Array.from(areaSet).sort();
    return ['All', ...sorted];
  }, [issues]);

  // Filter issues based on selected area dropdown
  const filteredIssues = useMemo(() => {
    if (selectedArea === 'All') return issues;
    return issues.filter(i => {
      const v = (i.village || '').toLowerCase();
      const a = (i.area || '').toLowerCase();
      const s = selectedArea.toLowerCase();
      return v === s || a.includes(s);
    });
  }, [issues, selectedArea]);

  // Compute 100% dynamic analytics from real issue records
  const analytics = useMemo(() => {
    const totalCount = filteredIssues.length;
    if (totalCount === 0) {
      return {
        totalCount: 0,
        topCategory: 'None',
        topPercentage: 0,
        breakdown: [],
        hotspots: [],
        insights: [],
        opportunities: [],
        resolvedCount: 0,
        inProgressCount: 0,
        openCount: 0,
        highPriorityCount: 0,
        resolvedPercentage: 0
      };
    }

    // 1. Dynamic Category Breakdown
    const categoryMap = {};
    filteredIssues.forEach(issue => {
      const cat = (issue.category || issue.problemType || 'General').trim();
      categoryMap[cat] = (categoryMap[cat] || 0) + 1;
    });

    const categoryColors = [
      '#10b981', '#06b6d4', '#f59e0b', '#6366f1', '#ec4899',
      '#3b82f6', '#8b5cf6', '#14b8a6', '#f97316', '#84cc16'
    ];

    const breakdown = Object.entries(categoryMap)
      .map(([category, count], idx) => ({
        category,
        count,
        percentage: Math.round((count / totalCount) * 100),
        color: categoryColors[idx % categoryColors.length]
      }))
      .sort((a, b) => b.count - a.count);

    const topCategory = breakdown[0]?.category || 'General';
    const topPercentage = breakdown[0]?.percentage || 0;

    // 2. Dynamic Status Breakdown
    const resolvedCount = filteredIssues.filter(i => i.status === 'Resolved' || i.resolved === true).length;
    const inProgressCount = filteredIssues.filter(i => i.status === 'In Progress' || i.status === 'Assigned' || (i.adopted && i.status !== 'Resolved' && !i.resolved)).length;
    const openCount = filteredIssues.filter(i => (i.status === 'Open' || i.status === 'Pending Verification' || (!i.status && !i.adopted)) && !i.adopted && !i.resolved).length;
    const highPriorityCount = filteredIssues.filter(i => i.priority === 'High' || i.priority === 'Urgent').length;
    const resolvedPercentage = Math.round((resolvedCount / totalCount) * 100);

    // 3. Dynamic Hotspots from Real Issue Locations
    const locationMap = {};
    filteredIssues.forEach(issue => {
      const locName = issue.village || issue.area || 'Visakhapatnam';
      const clusterName = issue.area && issue.area !== locName ? issue.area : locName;
      if (!locationMap[locName]) {
        locationMap[locName] = {
          area: locName,
          clusters: new Set(),
          count: 0,
          categories: {},
          highPriorityCount: 0
        };
      }
      locationMap[locName].count += 1;
      locationMap[locName].clusters.add(clusterName);
      const cat = issue.category || issue.problemType || 'General';
      locationMap[locName].categories[cat] = (locationMap[locName].categories[cat] || 0) + 1;
      if (issue.priority === 'High' || issue.priority === 'Urgent') {
        locationMap[locName].highPriorityCount += 1;
      }
    });

    const hotspots = Object.values(locationMap)
      .map(loc => {
        const sortedCats = Object.entries(loc.categories).sort((a, b) => b[1] - a[1]);
        const dominantCat = sortedCats[0] ? sortedCats[0][0] : 'General';
        const clusterArray = Array.from(loc.clusters);
        const clusterText = clusterArray.length > 1 ? clusterArray.slice(0, 2).join(' & ') : (clusterArray[0] || loc.area);
        const risk = (loc.highPriorityCount > 0 || loc.count >= 3) ? 'High' : (loc.count >= 2 ? 'Medium' : 'Low');
        return {
          area: loc.area,
          cluster: clusterText,
          count: `${loc.count} Report${loc.count > 1 ? 's' : ''}`,
          rawCount: loc.count,
          dominant: dominantCat,
          risk
        };
      })
      .sort((a, b) => b.rawCount - a.rawCount);

    // 4. Dynamic AI Insights
    const dynamicInsights = [
      {
        icon: <TrendingUp size={20} style={{ color: '#059669' }} />,
        title: `Most Reported: ${topCategory}`,
        text: `**${topCategory}** is currently the top reported issue, representing **${topPercentage}%** (${breakdown[0]?.count || 0} of **${totalCount}** total reports) in **${selectedArea === 'All' ? 'Visakhapatnam' : selectedArea}**.`
      },
      {
        icon: <CheckCircle2 size={20} style={{ color: '#0284c7' }} />,
        title: 'Resolution Progress & NGO Action',
        text: `**${resolvedCount}** of **${totalCount}** reports (**${resolvedPercentage}%**) have been resolved by NGOs. **${inProgressCount}** ${inProgressCount === 1 ? 'issue is' : 'issues are'} actively in progress.`
      },
      {
        icon: <AlertTriangle size={20} style={{ color: highPriorityCount > 0 ? '#dc2626' : '#d97706' }} />,
        title: 'Priority & Risk Distribution',
        text: highPriorityCount > 0
          ? `**${highPriorityCount}** high-priority ${highPriorityCount === 1 ? 'report requires' : 'reports require'} expedited field attention and municipal coordination.`
          : `All active reports are managed within standard response protocols with no critical emergency alerts.`
      },
      {
        icon: <MapPin size={20} style={{ color: '#6366f1' }} />,
        title: 'Geographic Distribution Pattern',
        text: `Reports are active across **${hotspots.length}** distinct ${hotspots.length === 1 ? 'location cluster' : 'location clusters'}${hotspots.length > 0 ? `, with the highest concentration in **${hotspots[0].area}** (**${hotspots[0].count}**)` : ''}.`
      }
    ];

    // 5. Dynamic Community Development Opportunities based on actual categories
    const dynamicOpportunities = [];
    const lowerCategories = Object.keys(categoryMap).map(c => c.toLowerCase());
    const topLoc = hotspots[0]?.area || (selectedArea !== 'All' ? selectedArea : 'Visakhapatnam');

    if (lowerCategories.some(c => c.includes('water') || c.includes('leak') || c.includes('supply'))) {
      dynamicOpportunities.push({
        title: 'Water Distribution & Smart Leakage Management',
        location: topLoc,
        need: 'High',
        desc: `Verified water issues in ${topLoc} highlight an opportunity for smart pressure valves, scheduled pipeline audits, and community rainwater harvesting.`
      });
    }

    if (lowerCategories.some(c => c.includes('road') || c.includes('pothole') || c.includes('transit') || c.includes('transport'))) {
      dynamicOpportunities.push({
        title: 'All-Weather Road Resurfacing & Transit Corridors',
        location: topLoc,
        need: 'High',
        desc: `Road damage reports suggest implementing heavy-duty asphalt resurfacing and feeder commuter connectivity in ${topLoc}.`
      });
    }

    if (lowerCategories.some(c => c.includes('light') || c.includes('electr') || c.includes('power'))) {
      dynamicOpportunities.push({
        title: 'Solar LED Lighting & Feeder Route Safety',
        location: topLoc,
        need: 'Medium',
        desc: `Streetlight maintenance demands indicate an opportunity to install autonomous solar LED lighting fixtures along main village junctions.`
      });
    }

    if (lowerCategories.some(c => c.includes('garbage') || c.includes('waste') || c.includes('drain') || c.includes('sanitat'))) {
      dynamicOpportunities.push({
        title: 'Decentralized Waste Recovery & Culvert Clearing',
        location: topLoc,
        need: 'High',
        desc: `Garbage and drainage issues indicate a community need for segregated waste collection kiosks and periodic monsoon drainage clearing.`
      });
    }

    if (lowerCategories.some(c => c.includes('health') || c.includes('clinic') || c.includes('toilet') || c.includes('school'))) {
      dynamicOpportunities.push({
        title: 'Mobile Health Check Kiosks & Civic Amenities',
        location: topLoc,
        need: 'High',
        desc: `Civic health and facility requests indicate opportunities for scheduled telemedicine transit and sanitized public utilities.`
      });
    }

    // Default fallback if category did not match known patterns
    if (dynamicOpportunities.length === 0) {
      dynamicOpportunities.push({
        title: `${topCategory} Infrastructure Modernization`,
        location: topLoc,
        need: 'High',
        desc: `Proactive infrastructure enhancement program to resolve ${topCategory.toLowerCase()} and strengthen civic reliability in ${topLoc}.`
      });
    }

    return {
      totalCount,
      topCategory,
      topPercentage,
      breakdown,
      hotspots,
      insights: dynamicInsights,
      opportunities: dynamicOpportunities.slice(0, 3),
      resolvedCount,
      inProgressCount,
      openCount,
      highPriorityCount,
      resolvedPercentage
    };
  }, [filteredIssues, selectedArea]);

  return (
    <div className="ai-insights-wrapper" style={{ color: '#0f172a' }}>
      
      {/* PAGE HEADER */}
      <div className="dash-card-header" style={{ marginBottom: '1.25rem' }}>
        <div>
          <h1 className="hero-title" style={{ fontSize: '1.85rem', textAlign: 'left', marginBottom: '0.25rem', color: '#0f172a' }}>
            AI Community <span className="gradient-text">Insights</span>
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
            Real-time AI-powered civic analytics and problem pattern intelligence dynamically computed from verified community reports.
          </p>
        </div>
        <span className="badge-tag" style={{ background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', fontWeight: 800 }}>
          Live Database Analytics
        </span>
      </div>

      {/* LOCATION FILTER BAR */}
      <div className="dash-card" style={{ marginBottom: '1.5rem', padding: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <MapPin size={20} style={{ color: '#059669' }} />
            <div>
              <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 800, letterSpacing: '0.5px' }}>
                State & District
              </span>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>
                Andhra Pradesh &rarr; Visakhapatnam District
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <label className="input-label" style={{ margin: 0, fontWeight: 700 }}>Village / Area Filter:</label>
            <select
              className="form-input"
              style={{ width: 'auto', minWidth: '220px', padding: '0.5rem 0.85rem', background: '#f8fafc', border: '1.5px solid #cbd5e1', color: '#0f172a', fontWeight: 700 }}
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
            >
              {dynamicAreas.map(a => (
                <option key={a} value={a}>
                  {a === 'All' ? '📍 All Visakhapatnam' : `📍 ${a}`}
                </option>
              ))}
            </select>
          </div>

        </div>
      </div>

      {/* EMPTY STATE IF ZERO ISSUES EXIST */}
      {analytics.totalCount === 0 ? (
        <div className="dash-card" style={{ textAlign: 'center', padding: '3.5rem 1.5rem', background: '#f8fafc', border: '1.5px dashed #cbd5e1', borderRadius: '16px' }}>
          <div style={{ display: 'inline-flex', padding: '1.2rem', background: '#e2e8f0', borderRadius: '50%', marginBottom: '1rem' }}>
            <Inbox size={40} style={{ color: '#64748b' }} />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
            No community reports available yet.
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.95rem', maxWidth: '520px', margin: '0 auto', lineHeight: '1.5' }}>
            {selectedArea === 'All' 
              ? 'As citizens report civic issues, AI Insights will automatically analyze problem categories, geographic hotspots, and infrastructure needs.'
              : `No reports currently logged for ${selectedArea}. Select "All Visakhapatnam" or report a new issue to generate live insights.`}
          </p>
        </div>
      ) : (
        <>
          {/* STATS OVERVIEW CARDS */}
          <div className="dash-stats-grid" style={{ marginBottom: '1.5rem' }}>
            <div className="dash-stat-card">
              <div className="dash-stat-info">
                <div className="dash-stat-value" style={{ fontWeight: 800 }}>{analytics.totalCount}</div>
                <div className="dash-stat-label">Reports Analyzed</div>
              </div>
              <div className="dash-stat-icon" style={{ background: '#ecfdf5', color: '#059669' }}>
                <BarChart3 size={24} />
              </div>
            </div>

            <div className="dash-stat-card">
              <div className="dash-stat-info">
                <div className="dash-stat-value" style={{ color: '#dc2626', fontWeight: 800 }}>{analytics.openCount}</div>
                <div className="dash-stat-label">Open Issues</div>
              </div>
              <div className="dash-stat-icon" style={{ background: '#fef2f2', color: '#dc2626' }}>
                <AlertCircle size={24} />
              </div>
            </div>

            <div className="dash-stat-card">
              <div className="dash-stat-info">
                <div className="dash-stat-value" style={{ color: '#0284c7', fontWeight: 800 }}>{analytics.inProgressCount}</div>
                <div className="dash-stat-label">In Progress</div>
              </div>
              <div className="dash-stat-icon" style={{ background: '#f0f9ff', color: '#0284c7' }}>
                <Clock size={24} />
              </div>
            </div>

            <div className="dash-stat-card">
              <div className="dash-stat-info">
                <div className="dash-stat-value" style={{ color: '#059669', fontWeight: 800 }}>{analytics.resolvedCount}</div>
                <div className="dash-stat-label">Resolved ({analytics.resolvedPercentage}%)</div>
              </div>
              <div className="dash-stat-icon" style={{ background: '#ecfdf5', color: '#059669' }}>
                <CheckCircle2 size={24} />
              </div>
            </div>
          </div>

          {/* SECTION 1: KEY AI COMMUNITY INSIGHTS (4 Cards) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
            {analytics.insights.map((ins, i) => (
              <div key={i} className="dash-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    {ins.icon}
                    <h4 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                      {ins.title}
                    </h4>
                  </div>
                  <p style={{ color: '#475569', fontSize: '0.88rem', lineHeight: '1.55', margin: 0 }}>
                    {renderFormattedText(ins.text)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* SECTION 2: PROBLEM BREAKDOWN & REAL HOTSPOTS */}
          <div className="dash-two-col" style={{ marginBottom: '1.5rem' }}>
            
            {/* Real Problem Breakdown */}
            <div className="dash-card">
              <div className="dash-card-header" style={{ marginBottom: '1.2rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    Category Breakdown ({selectedArea === 'All' ? 'Visakhapatnam' : selectedArea})
                  </h3>
                  <p style={{ color: '#64748b', fontSize: '0.82rem', margin: '0.2rem 0 0 0' }}>
                    Calculated from verified database issues
                  </p>
                </div>
                <span className="badge-tag" style={{ fontWeight: 800 }}>
                  {analytics.totalCount} {analytics.totalCount === 1 ? 'Report' : 'Reports'} Analyzed
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                {analytics.breakdown.map((item) => (
                  <div key={item.category}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '0.4rem' }}>
                      <strong style={{ color: '#0f172a', fontWeight: 800 }}>{item.category}</strong>
                      <span style={{ color: '#059669', fontWeight: 800 }}>
                        {item.percentage}% ({item.count} {item.count === 1 ? 'report' : 'reports'})
                      </span>
                    </div>
                    <div style={{ width: '100%', height: '9px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                      <div 
                        style={{ 
                          width: `${item.percentage}%`, 
                          height: '100%', 
                          background: item.color, 
                          borderRadius: '4px', 
                          transition: 'width 0.4s ease' 
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Real Problem Hotspots */}
            <div className="dash-card">
              <div className="dash-card-header" style={{ marginBottom: '1.2rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    📍 Problem Hotspots
                  </h3>
                  <p style={{ color: '#64748b', fontSize: '0.82rem', margin: '0.2rem 0 0 0' }}>
                    Ranked by location cluster density
                  </p>
                </div>
                <span className="badge-tag urgent" style={{ fontWeight: 800 }}>
                  {analytics.hotspots.length} {analytics.hotspots.length === 1 ? 'Cluster' : 'Clusters'}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {analytics.hotspots.map((h, idx) => (
                  <div key={idx} style={{
                    background: '#f8fafc',
                    border: '1.5px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '0.9rem 1.1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                        <MapPin size={15} style={{ color: '#059669', display: 'inline', marginRight: '0.35rem', verticalAlign: 'text-bottom' }} />
                        {h.area} <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>({h.cluster})</span>
                      </h4>
                      <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem' }}>
                        Dominant: <strong style={{ color: '#0f172a', fontWeight: 800 }}>{h.dominant}</strong> &bull; <strong style={{ color: '#059669', fontWeight: 800 }}>{h.count}</strong>
                      </div>
                    </div>
                    <span className={`priority-tag ${h.risk.toLowerCase()}`} style={{ fontWeight: 800 }}>
                      {h.risk} Risk
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* SECTION 3: COMMUNITY DEVELOPMENT OPPORTUNITIES */}
          <div className="dash-card">
            <div className="dash-card-header" style={{ marginBottom: '1.2rem' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  🌱 Community Development Opportunities
                </h3>
                <p style={{ color: '#64748b', fontSize: '0.84rem', marginTop: '0.2rem' }}>
                  Actionable civic development opportunities identified from reported problem patterns.
                </p>
              </div>
              <span className="badge-tag" style={{ fontWeight: 800 }}>Opportunity Finder</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.1rem' }}>
              {analytics.opportunities.map((opp, i) => (
                <div key={i} style={{
                  background: '#f8fafc',
                  border: '1.5px solid #e2e8f0',
                  borderRadius: '14px',
                  padding: '1.15rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.45rem' }}>
                      <h4 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>{opp.title}</h4>
                      <span className="priority-tag high" style={{ fontWeight: 800 }}>{opp.need} Need</span>
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#059669', fontWeight: 800, marginBottom: '0.45rem' }}>
                      📍 {opp.location}, Visakhapatnam
                    </div>
                    <p style={{ color: '#475569', fontSize: '0.86rem', margin: 0, lineHeight: '1.45' }}>
                      {opp.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

    </div>
  );
}

