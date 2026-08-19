import React, { useState, useEffect } from 'react';
import { 
  Layers, 
  Filter, 
  Search, 
  RotateCcw, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  User 
} from 'lucide-react';
import { getStoredIssues, filterIssues, LOCATION_HIERARCHY } from '../utils/issueData';

export default function CommunityIssuesPage({ user }) {
  const [issues, setIssues] = useState([]);
  
  // Filter States
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedVillage, setSelectedVillage] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setIssues(getStoredIssues());
  }, []);

  // Dynamic Options
  const stateOptions = Object.keys(LOCATION_HIERARCHY);
  const districtOptions = selectedState ? Object.keys(LOCATION_HIERARCHY[selectedState] || {}) : [];
  const villageOptions = (selectedState && selectedDistrict) 
    ? Object.keys(LOCATION_HIERARCHY[selectedState][selectedDistrict] || {}) : [];
  const areaOptions = (selectedState && selectedDistrict && selectedVillage)
    ? (LOCATION_HIERARCHY[selectedState][selectedDistrict][selectedVillage] || []) : [];

  const handleClearFilters = () => {
    setSelectedState('');
    setSelectedDistrict('');
    setSelectedVillage('');
    setSelectedArea('');
    setSelectedCategory('');
    setSelectedStatus('');
    setSelectedPriority('');
    setSearchQuery('');
  };

  const filteredIssues = filterIssues(issues, {
    state: selectedState,
    district: selectedDistrict,
    village: selectedVillage,
    area: selectedArea,
    category: selectedCategory,
    status: selectedStatus,
    priority: selectedPriority,
    search: searchQuery
  });

  return (
    <div className="community-issues-wrapper">
      
      {/* HEADER */}
      <div className="dash-card-header" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h1 className="hero-title" style={{ fontSize: '2rem', textAlign: 'left', marginBottom: '0.25rem' }}>
            Community <span className="gradient-text">Issues Feed</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.98rem' }}>
            Browse and filter reported village problems across all locations and categories.
          </p>
        </div>
        <span className="badge-tag">{filteredIssues.length} Issues Found</span>
      </div>

      {/* FILTER ISSUES SECTION */}
      <div className="dash-card" style={{ marginBottom: '2rem' }}>
        <div className="dash-card-header" style={{ marginBottom: '1.2rem' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Filter size={18} className="gradient-text" /> FILTER ISSUES
          </h3>
          <button className="btn btn-outline btn-sm" onClick={handleClearFilters}>
            <RotateCcw size={14} /> Clear Filters
          </button>
        </div>

        {/* Search Bar */}
        <div className="form-group" style={{ marginBottom: '1.2rem' }}>
          <div className="input-wrapper">
            <Search size={18} className="field-icon" />
            <input
              type="text"
              className="form-input"
              placeholder="Search by issue, village, street, ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Location Filters Grid */}
        <div className="dash-two-col" style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          
          <div className="form-group">
            <label className="input-label">State</label>
            <select 
              className="form-input"
              value={selectedState}
              onChange={(e) => { setSelectedState(e.target.value); setSelectedDistrict(''); setSelectedVillage(''); setSelectedArea(''); }}
            >
              <option value="">All States</option>
              {stateOptions.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label className="input-label">District</label>
            <select 
              className="form-input"
              value={selectedDistrict}
              onChange={(e) => { setSelectedDistrict(e.target.value); setSelectedVillage(''); setSelectedArea(''); }}
              disabled={!selectedState}
            >
              <option value="">All Districts</option>
              {districtOptions.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label className="input-label">Village</label>
            <select 
              className="form-input"
              value={selectedVillage}
              onChange={(e) => { setSelectedVillage(e.target.value); setSelectedArea(''); }}
              disabled={!selectedDistrict}
            >
              <option value="">All Villages</option>
              {villageOptions.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label className="input-label">Area / Street</label>
            <select 
              className="form-input"
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              disabled={!selectedVillage}
            >
              <option value="">All Areas</option>
              {areaOptions.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>

        </div>

        {/* Category, Status & Priority Filters Grid */}
        <div className="dash-two-col" style={{ gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
          
          <div className="form-group">
            <label className="input-label">Problem Category</label>
            <select 
              className="form-input"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="Road Damage">Road Damage</option>
              <option value="Water Leakage">Water Leakage</option>
              <option value="Broken Streetlight">Broken Streetlight</option>
              <option value="Garbage Overflow">Garbage Overflow</option>
              <option value="Water Supply">Water Supply</option>
              <option value="Fallen Tree">Fallen Tree</option>
              <option value="Drainage Problem">Drainage Problem</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Transportation">Transportation</option>
              <option value="Sanitation">Sanitation</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label className="input-label">Status</label>
            <select 
              className="form-input"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="Open">Open</option>
              <option value="Verified">Verified</option>
              <option value="Assigned">Assigned</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          <div className="form-group">
            <label className="input-label">Priority</label>
            <select 
              className="form-input"
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
            >
              <option value="">All Priorities</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>
          </div>

        </div>

      </div>

      {/* ISSUES LIST GRID */}
      {filteredIssues.length === 0 ? (
        <div className="dash-card empty-state-box">
          <AlertCircle size={36} style={{ color: 'var(--primary-teal)', margin: '0 auto 0.75rem' }} />
          <h3>No matching community issues found</h3>
          <p style={{ marginTop: '0.4rem' }}>Try broadening your filter criteria or search query.</p>
        </div>
      ) : (
        <div className="pending-cards-grid">
          {filteredIssues.map((issue) => (
            <div key={issue.id} className="authority-issue-card">
              <div className="authority-card-top">
                <div>
                  <span className={`priority-tag ${issue.priority.toLowerCase()}`}>
                    {issue.priority} Priority
                  </span>
                  <h4 className="issue-card-title">{issue.category}</h4>
                </div>
                <code className="id-code">{issue.id}</code>
              </div>

              <div className="issue-meta-row" style={{ marginTop: '0.5rem' }}>
                <span><MapPin size={14} /> {issue.area}, {issue.village}, {issue.district}, {issue.state}</span>
                <span>Reported by: <strong>{issue.reportedBy} ({issue.reportedByRole})</strong> &bull; {issue.date}</span>
              </div>

              <p className="issue-desc">{issue.description}</p>

              <div style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className={`status-pill ${issue.status.toLowerCase().replace(/\s+/g, '-')}`}>
                  {issue.status}
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Lat: {issue.latitude}, Lng: {issue.longitude}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
