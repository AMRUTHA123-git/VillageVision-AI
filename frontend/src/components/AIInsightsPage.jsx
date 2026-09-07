import React, { useState } from 'react';
import { 
  Sparkles, 
  MapPin, 
  TrendingUp, 
  AlertTriangle, 
  Droplets, 
  Zap, 
  HeartPulse, 
  Building, 
  Filter, 
  Info,
  CheckCircle2
} from 'lucide-react';

export default function AIInsightsPage() {
  const [selectedArea, setSelectedArea] = useState('All');

  // Visakhapatnam villages and areas
  const vizagAreas = [
    'All',
    'Bheemunipatnam',
    'Gajuwaka',
    'Anandapuram',
    'Padmanabham',
    'Pendurthi',
    'Sabbavaram',
    'Vizag Old Town'
  ];

  // Dynamic Visakhapatnam Data
  const vizagData = {
    'All': {
      topCategory: 'Road & Transportation',
      totalCount: 42,
      breakdown: [
        { category: 'Road Damage & Potholes', percentage: 36, count: 15, color: '#10b981' },
        { category: 'Water Supply & Leakage', percentage: 26, count: 11, color: '#06b6d4' },
        { category: 'Broken Streetlights', percentage: 19, count: 8, color: '#f59e0b' },
        { category: 'Drainage & Sanitation', percentage: 12, count: 5, color: '#6366f1' },
        { category: 'Public Healthcare Access', percentage: 7, count: 3, color: '#ec4899' },
      ],
      hotspots: [
        { area: 'Bheemunipatnam', cluster: 'Beach Road & Colony', count: '11 Reports', dominant: 'Road Damage', risk: 'High' },
        { area: 'Gajuwaka', cluster: 'Industrial Belt & Sector 3', count: '9 Reports', dominant: 'Drainage & Dust', risk: 'High' },
        { area: 'Pendurthi', cluster: 'Railway Feeder Road', count: '8 Reports', dominant: 'Streetlight & Roads', risk: 'Medium' },
        { area: 'Anandapuram', cluster: 'Junction & Market', count: '6 Reports', dominant: 'Water Supply', risk: 'Medium' },
        { area: 'Sabbavaram', cluster: 'University Road', count: '5 Reports', dominant: 'Public Transit', risk: 'Low' },
        { area: 'Padmanabham', cluster: 'Main Village Square', count: '3 Reports', dominant: 'Healthcare Clinic', risk: 'Low' }
      ],
      insights: [
        {
          icon: <TrendingUp size={20} style={{ color: '#059669' }} />,
          title: 'Common Issues in Visakhapatnam',
          text: 'Road-related problems and asphalt erosion represent 36% of all civic issues logged across Visakhapatnam rural and suburban corridors.'
        },
        {
          icon: <Droplets size={20} style={{ color: '#0284c7' }} />,
          title: 'Water & Sanitation Needs',
          text: 'Water pipeline maintenance and storm drainage complaints require prioritized municipal coordination in coastal and low-lying clusters.'
        },
        {
          icon: <Zap size={20} style={{ color: '#d97706' }} />,
          title: 'Infrastructure Maintenance',
          text: 'Public streetlight fixtures along feeder routes require automated fault inspection during evening transit hours.'
        },
        {
          icon: <HeartPulse size={20} style={{ color: '#dc2626' }} />,
          title: 'Development Needs & Healthcare',
          text: 'Rural clusters around Padmanabham and Anandapuram benefit from periodic mobile health clinics and emergency medical transit.'
        }
      ],
      opportunities: [
        { title: 'Local Pharmacy & First Aid', location: 'Padmanabham', need: 'High', desc: 'Residents have to travel 8km for emergency medical supplies.' },
        { title: 'Feeder Bus / Mini Transit', location: 'Sabbavaram', need: 'Medium', desc: 'High student and commuter traffic towards city centers.' },
        { title: 'Agri-Produce Solar Storage', location: 'Anandapuram', need: 'High', desc: 'Farmers market area benefits from clean cold storage.' }
      ]
    },
    'Bheemunipatnam': {
      topCategory: 'Road Damage',
      totalCount: 11,
      breakdown: [
        { category: 'Road Damage & Potholes', percentage: 55, count: 6, color: '#10b981' },
        { category: 'Water Supply', percentage: 27, count: 3, color: '#06b6d4' },
        { category: 'Streetlights', percentage: 18, count: 2, color: '#f59e0b' }
      ],
      hotspots: [
        { area: 'Bheemunipatnam', cluster: 'Beach Road Ext.', count: '6 Reports', dominant: 'Road Damage', risk: 'High' },
        { area: 'Bheemunipatnam', cluster: 'Old Town Colony', count: '5 Reports', dominant: 'Water Supply', risk: 'Medium' }
      ],
      insights: [
        {
          icon: <TrendingUp size={20} style={{ color: '#059669' }} />,
          title: 'Road Surface Erosion in Bheemunipatnam',
          text: 'Coastal humidity and monsoon rainfall have caused recurring asphalt potholes near the heritage town and beach road stretch.'
        },
        {
          icon: <Droplets size={20} style={{ color: '#0284c7' }} />,
          title: 'Clean Water Pipeline Pressurization',
          text: 'Drinking water distribution requires pressure regulators during peak morning hours in upper wards.'
        }
      ],
      opportunities: [
        { title: 'Eco-Tourism & Clean Waste Hub', location: 'Bheemunipatnam', need: 'High', desc: 'High weekend visitor footfall creates opportunity for green civic services.' }
      ]
    },
    'Gajuwaka': {
      topCategory: 'Drainage & Air Quality',
      totalCount: 9,
      breakdown: [
        { category: 'Drainage & Industrial Dust', percentage: 45, count: 4, color: '#6366f1' },
        { category: 'Road Damage', percentage: 33, count: 3, color: '#10b981' },
        { category: 'Streetlight Repair', percentage: 22, count: 2, color: '#f59e0b' }
      ],
      hotspots: [
        { area: 'Gajuwaka', cluster: 'Sector 3 Commercial Zone', count: '5 Reports', dominant: 'Drainage Overflow', risk: 'High' },
        { area: 'Gajuwaka', cluster: 'BHPV Feeder Gate', count: '4 Reports', dominant: 'Road Potholes', risk: 'Medium' }
      ],
      insights: [
        {
          icon: <Droplets size={20} style={{ color: '#0284c7' }} />,
          title: 'Drainage Clearing Needed',
          text: 'Heavy vehicular traffic and commercial activity in Gajuwaka require scheduled weekly culvert desilting.'
        }
      ],
      opportunities: [
        { title: 'Recycling & Commercial Sorting', location: 'Gajuwaka', need: 'High', desc: 'Opportunity for organized plastic and dry waste recovery.' }
      ]
    },
    'Anandapuram': {
      topCategory: 'Water Supply',
      totalCount: 6,
      breakdown: [
        { category: 'Water Supply & Pressure', percentage: 50, count: 3, color: '#06b6d4' },
        { category: 'Road Junction Safety', percentage: 33, count: 2, color: '#10b981' },
        { category: 'Streetlights', percentage: 17, count: 1, color: '#f59e0b' }
      ],
      hotspots: [
        { area: 'Anandapuram', cluster: 'Junction Highway Area', count: '4 Reports', dominant: 'Water Supply', risk: 'Medium' },
        { area: 'Anandapuram', cluster: 'Weekly Market', count: '2 Reports', dominant: 'Road Safety', risk: 'Low' }
      ],
      insights: [
        {
          icon: <Droplets size={20} style={{ color: '#0284c7' }} />,
          title: 'Agricultural & Domestic Water Balance',
          text: 'Anandapuram junction areas experience seasonal groundwater level variations requiring overhead tank replenishment.'
        }
      ],
      opportunities: [
        { title: 'Agri-Cold Storage & Direct Farmer Hub', location: 'Anandapuram', need: 'High', desc: 'Central junction connection makes it prime for fresh produce distribution.' }
      ]
    },
    'Padmanabham': {
      topCategory: 'Healthcare Access',
      totalCount: 4,
      breakdown: [
        { category: 'Healthcare Access', percentage: 50, count: 2, color: '#ec4899' },
        { category: 'Road Maintenance', percentage: 25, count: 1, color: '#10b981' },
        { category: 'Drinking Water', percentage: 25, count: 1, color: '#06b6d4' }
      ],
      hotspots: [
        { area: 'Padmanabham', cluster: 'Temple Hill Feeder', count: '3 Reports', dominant: 'Healthcare Transit', risk: 'Medium' }
      ],
      insights: [
        {
          icon: <HeartPulse size={20} style={{ color: '#dc2626' }} />,
          title: 'Primary Health Clinic Extension',
          text: 'Padmanabham village residents benefit from scheduled tele-medicine and local diagnostic kiosk support.'
        }
      ],
      opportunities: [
        { title: 'Community Medical Dispensary', location: 'Padmanabham', need: 'High', desc: 'Nearest tertiary hospital is 18km away.' }
      ]
    },
    'Pendurthi': {
      topCategory: 'Road & Lighting',
      totalCount: 8,
      breakdown: [
        { category: 'Road Maintenance', percentage: 50, count: 4, color: '#10b981' },
        { category: 'Streetlighting', percentage: 38, count: 3, color: '#f59e0b' },
        { category: 'Sanitation', percentage: 12, count: 1, color: '#6366f1' }
      ],
      hotspots: [
        { area: 'Pendurthi', cluster: 'Station Road', count: '5 Reports', dominant: 'Streetlighting', risk: 'Medium' }
      ],
      insights: [
        {
          icon: <Zap size={20} style={{ color: '#d97706' }} />,
          title: 'Commuter Station Corridor Lighting',
          text: 'High evening pedestrian volume between railway terminal and bus stop requires LED streetlight upgrades.'
        }
      ],
      opportunities: [
        { title: 'EV Charging & Two-Wheeler Service', location: 'Pendurthi', need: 'Medium', desc: 'Growing suburban EV commuter base.' }
      ]
    },
    'Sabbavaram': {
      topCategory: 'Public Transportation',
      totalCount: 5,
      breakdown: [
        { category: 'Public Transit Frequency', percentage: 60, count: 3, color: '#0284c7' },
        { category: 'Road Patching', percentage: 40, count: 2, color: '#10b981' }
      ],
      hotspots: [
        { area: 'Sabbavaram', cluster: 'University Bypass', count: '4 Reports', dominant: 'Public Transit', risk: 'Low' }
      ],
      insights: [
        {
          icon: <TrendingUp size={20} style={{ color: '#059669' }} />,
          title: 'Educational Corridor Bus Connectivity',
          text: 'Morning and evening college hours see transit crowding along the Sabbavaram highway.'
        }
      ],
      opportunities: [
        { title: 'Shared Student Transit & Book Cafe', location: 'Sabbavaram', need: 'Medium', desc: 'High university population looking for local study amenities.' }
      ]
    },
    'Vizag Old Town': {
      topCategory: 'Sanitation & Heritage Streets',
      totalCount: 5,
      breakdown: [
        { category: 'Streetlights & Heritage Wires', percentage: 40, count: 2, color: '#f59e0b' },
        { category: 'Sanitation & Waste Clearing', percentage: 40, count: 2, color: '#10b981' },
        { category: 'Drainage', percentage: 20, count: 1, color: '#6366f1' }
      ],
      hotspots: [
        { area: 'Vizag Old Town', cluster: 'Port Road & Market', count: '4 Reports', dominant: 'Waste Clearing', risk: 'Medium' }
      ],
      insights: [
        {
          icon: <Building size={20} style={{ color: '#059669' }} />,
          title: 'Narrow Street Waste Collection',
          text: 'Compact electric collection carts improve daily waste removal in densely populated Old Town lanes.'
        }
      ],
      opportunities: [
        { title: 'Heritage Tourism & Walking Tour Hub', location: 'Vizag Old Town', need: 'Medium', desc: 'Rich historic architecture and harbor views.' }
      ]
    }
  };

  const activeData = vizagData[selectedArea] || vizagData['All'];

  return (
    <div className="ai-insights-wrapper" style={{ color: '#0f172a' }}>
      
      {/* PAGE HEADER */}
      <div className="dash-card-header" style={{ marginBottom: '1.25rem' }}>
        <div>
          <h1 className="hero-title" style={{ fontSize: '1.85rem', textAlign: 'left', marginBottom: '0.25rem', color: '#0f172a' }}>
            AI Community <span className="gradient-text">Insights</span>
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
            AI-powered civic insights and problem pattern analysis for <strong>Visakhapatnam (Vizag)</strong> and its rural village clusters.
          </p>
        </div>
        <span className="badge-tag" style={{ background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0' }}>
          Visakhapatnam Focus
        </span>
      </div>

      {/* LOCATION SELECTOR / FILTER BAR */}
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
            <label className="input-label" style={{ margin: 0 }}>Village / Area:</label>
            <select
              className="form-input"
              style={{ width: 'auto', minWidth: '220px', padding: '0.5rem 0.85rem', background: '#f8fafc', border: '1.5px solid #cbd5e1', color: '#0f172a' }}
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
            >
              {vizagAreas.map(a => (
                <option key={a} value={a}>
                  {a === 'All' ? '📍 All Visakhapatnam' : `📍 ${a}`}
                </option>
              ))}
            </select>
          </div>

        </div>
      </div>

      {/* PROTOTYPE DISCLAIMER BANNER */}
      <div className="dash-card" style={{ marginBottom: '1.5rem', background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
          <Sparkles size={20} style={{ color: '#059669', flexShrink: 0, marginTop: '0.15rem' }} />
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#065f46', margin: 0 }}>
              AI-Based Civic Analysis &bull; Visakhapatnam Prototype
            </h4>
            <p style={{ color: '#166534', fontSize: '0.86rem', marginTop: '0.2rem', lineHeight: '1.5' }}>
              These simulated AI insights demonstrate how machine learning aggregates incoming reports across Visakhapatnam to detect issue spikes, recurring repair demands, and underserved infrastructure needs.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 1: KEY COMMUNITY INSIGHTS (4 Cards) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
        {activeData.insights.map((ins, i) => (
          <div key={i} className="dash-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                {ins.icon}
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>{ins.title}</h4>
              </div>
              <p style={{ color: '#475569', fontSize: '0.86rem', lineHeight: '1.5', margin: 0 }}>
                {ins.text}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* SECTION 2: PROBLEM BREAKDOWN & HOTSPOTS */}
      <div className="dash-two-col" style={{ marginBottom: '1.5rem' }}>
        
        {/* Most Reported Problems in Visakhapatnam */}
        <div className="dash-card">
          <div className="dash-card-header" style={{ marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
              Problem Breakdown ({selectedArea === 'All' ? 'Visakhapatnam' : selectedArea})
            </h3>
            <span className="badge-tag">{activeData.totalCount} Reports Analyzed</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {activeData.breakdown.map((item) => (
              <div key={item.category}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem', marginBottom: '0.35rem' }}>
                  <strong style={{ color: '#1e293b' }}>{item.category}</strong>
                  <span style={{ color: '#059669', fontWeight: 700 }}>{item.percentage}% ({item.count} reports)</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${item.percentage}%`, height: '100%', background: item.color, borderRadius: '4px', transition: 'width 0.4s ease' }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Problem Hotspots in Visakhapatnam */}
        <div className="dash-card">
          <div className="dash-card-header" style={{ marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
              📍 Visakhapatnam Problem Hotspots
            </h3>
            <span className="badge-tag urgent">Civic Hotspots</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {activeData.hotspots.map((h, idx) => (
              <div key={idx} style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '0.85rem 1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div>
                  <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    <MapPin size={14} style={{ color: '#059669', display: 'inline', marginRight: '0.25rem' }} />
                    {h.area} <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 500 }}>({h.cluster})</span>
                  </h4>
                  <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                    Dominant: <strong>{h.dominant}</strong> &bull; {h.count}
                  </span>
                </div>
                <span className={`priority-tag ${h.risk.toLowerCase()}`}>
                  {h.risk} Risk
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* SECTION 3: DEVELOPMENT OPPORTUNITIES IN VISAKHAPATNAM */}
      <div className="dash-card">
        <div className="dash-card-header" style={{ marginBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              🌱 Community Development Opportunities (Visakhapatnam)
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.84rem', marginTop: '0.2rem' }}>
              Potential local business & public service gaps identified from community request clusters.
            </p>
          </div>
          <span className="badge-tag">Opportunity Finder</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          {activeData.opportunities.map((opp, i) => (
            <div key={i} style={{
              background: '#f8fafc',
              border: '1.5px solid #e2e8f0',
              borderRadius: '14px',
              padding: '1.1rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>{opp.title}</h4>
                  <span className="priority-tag high">{opp.need} Need</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#059669', fontWeight: 700, marginBottom: '0.4rem' }}>
                  📍 {opp.location}, Visakhapatnam
                </div>
                <p style={{ color: '#475569', fontSize: '0.84rem', margin: 0, lineHeight: '1.4' }}>
                  {opp.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
