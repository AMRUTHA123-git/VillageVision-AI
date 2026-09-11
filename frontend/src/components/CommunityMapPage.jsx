import React, { useState, useEffect, useRef } from 'react';
import { 
  Map as MapIcon, 
  MapPin, 
  Info, 
  Layers, 
  Sparkles, 
  Filter,
  CheckCircle2,
  Clock,
  Navigation
} from 'lucide-react';
import { getStoredIssues, fetchIssuesFromBackend, subscribeToIssueUpdates, VISAKHAPATNAM_VILLAGES } from '../utils/issueData';

import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Custom Blue Map Marker with Priority Indicator Dot
const createMarkerIcon = (priority, isHighlighted = false) => {
  const pinColor = isHighlighted ? '#1d4ed8' : '#2563eb'; // Vibrant Blue Marker
  const size = isHighlighted ? 38 : 30;
  const borderColor = isHighlighted ? '#93c5fd' : '#ffffff';
  const zIndex = isHighlighted ? 1000 : 50;

  // Inner dot denoting Priority (Red for High, Yellow/Amber for Medium, Green for Low)
  let dotColor = '#facc15';
  if (priority === 'High') dotColor = '#ef4444';
  if (priority === 'Low') dotColor = '#10b981';

  return L.divIcon({
    className: isHighlighted ? 'custom-blue-highlight-marker' : 'custom-blue-marker',
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background: ${pinColor};
        border: ${isHighlighted ? '3px' : '2.5px'} solid ${borderColor};
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        box-shadow: ${isHighlighted ? '0 0 20px rgba(37, 99, 235, 0.9), 0 6px 14px rgba(0,0,0,0.35)' : '0 4px 10px rgba(37, 99, 235, 0.4), 0 2px 4px rgba(0,0,0,0.2)'};
        position: relative;
        z-index: ${zIndex};
        transition: transform 0.2s ease;
      ">
        <div style="
          width: ${isHighlighted ? 12 : 9}px;
          height: ${isHighlighted ? 12 : 9}px;
          background: ${dotColor};
          border: 1.5px solid #ffffff;
          border-radius: 50%;
          position: absolute;
          top: ${isHighlighted ? 7 : 5}px;
          left: ${isHighlighted ? 7 : 5}px;
        "></div>
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size]
  });
};

function MapController({ issues, highlightIssueId }) {
  const map = useMap();

  useEffect(() => {
    if (!map || !issues || issues.length === 0) return;

    if (highlightIssueId) {
      const target = issues.find(i => i.id === highlightIssueId);
      if (target && Number.isFinite(target.latitude) && Number.isFinite(target.longitude)) {
        try {
          map.setView([target.latitude, target.longitude], 15, { animate: true });
        } catch (e) {
          // fallback
        }
        return;
      }
    }

    const valid = issues.filter(i => Number.isFinite(i.latitude) && Number.isFinite(i.longitude));
    if (valid.length === 1) {
      try {
        map.setView([valid[0].latitude, valid[0].longitude], 14, { animate: false });
      } catch (e) {}
    } else if (valid.length > 1) {
      try {
        const bounds = L.latLngBounds(valid.map(i => [i.latitude, i.longitude]));
        map.fitBounds(bounds, { padding: [40, 40], animate: false });
      } catch (e) {}
    }
  }, [issues, highlightIssueId, map]);

  return null;
}

export default function CommunityMapPage({ highlightIssueId = null, onClearHighlight = null }) {
  const [issues, setIssues] = useState([]);
  const [selectedVillage, setSelectedVillage] = useState('All Villages / Areas');
  const [activeHighlight, setActiveHighlight] = useState(highlightIssueId);

  useEffect(() => {
    setActiveHighlight(highlightIssueId);
  }, [highlightIssueId]);

  useEffect(() => {
    setIssues(getStoredIssues());

    // Fresh fetch from SQLite backend
    fetchIssuesFromBackend().then((fresh) => {
      if (Array.isArray(fresh)) {
        setIssues(fresh);
      }
    }).catch(() => {});

    const unsubscribe = subscribeToIssueUpdates((latest) => {
      setIssues(latest);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const validIssues = issues.filter(i => 
    i.latitude && i.longitude && Number.isFinite(Number(i.latitude)) && Number.isFinite(Number(i.longitude))
  );

  const filteredIssues = validIssues.filter(issue => {
    if (activeHighlight && issue.id === activeHighlight) return true;
    if (selectedVillage && selectedVillage !== 'All Villages / Areas' && issue.village !== selectedVillage) {
      return false;
    }
    return true;
  });

  const highlightedIssue = activeHighlight ? validIssues.find(i => i.id === activeHighlight) : null;
  const mapCenter = highlightedIssue ? [highlightedIssue.latitude, highlightedIssue.longitude] : [17.8912, 83.4542];

  return (
    <div className="community-map-wrapper">
      
      {/* HEADER */}
      <div className="dash-card-header" style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="hero-title" style={{ fontSize: '1.85rem', textAlign: 'left', marginBottom: '0.25rem', color: '#0f172a' }}>
            Interactive <span className="gradient-text">Community Map</span>
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem', margin: 0 }}>
            Spatial visualization of real geo-tagged community issues across Visakhapatnam.
          </p>
        </div>

        {/* Location Badge */}
        <div style={{
          background: '#ecfdf5',
          border: '1.5px solid #a7f3d0',
          borderRadius: '9999px',
          padding: '0.5rem 1.15rem',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.45rem',
          color: '#047857',
          fontWeight: 800,
          fontSize: '0.9rem'
        }}>
          <MapPin size={16} style={{ color: '#059669' }} />
          <span>📍 Visakhapatnam, Andhra Pradesh</span>
        </div>
      </div>

      {/* HIGHLIGHTED FOCUS BANNER */}
      {highlightedIssue && (
        <div className="dash-card" style={{ background: '#eff6ff', border: '1.5px solid #93c5fd', marginBottom: '1.25rem', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#2563eb', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Navigation size={18} />
            </div>
            <div>
              <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#1e40af' }}>
                📍 Focused on Selected Issue: {highlightedIssue.id} &bull; {highlightedIssue.category}
              </span>
              <div style={{ fontSize: '0.82rem', color: '#3b82f6', marginTop: '0.1rem' }}>
                Centered on coordinates: <strong>{highlightedIssue.latitude}, {highlightedIssue.longitude}</strong> (Marked with <strong>BLUE PIN</strong>)
              </div>
            </div>
          </div>

          <button 
            className="btn btn-outline btn-sm"
            onClick={() => {
              setActiveHighlight(null);
              if (onClearHighlight) onClearHighlight();
            }}
            style={{ fontSize: '0.78rem', background: '#ffffff', color: '#1e40af', borderColor: '#bfdbfe' }}
          >
            Show All Issues
          </button>
        </div>
      )}

      {/* MAP FILTER CONTROLS */}
      <div className="dash-card" style={{ marginBottom: '1.5rem', padding: '1.25rem 1.5rem', background: '#ffffff', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <label className="input-label-bold" style={{ margin: 0 }}>Filter Village / Area:</label>
          <select 
            className="form-input" 
            value={selectedVillage} 
            onChange={(e) => setSelectedVillage(e.target.value)}
            style={{ minWidth: 'min(220px, 100%)', background: '#f8fafc' }}
          >
            <option value="All Villages / Areas">📍 All Villages / Areas ({validIssues.length})</option>
            {VISAKHAPATNAM_VILLAGES.map(v => (
              <option key={v} value={v}>📍 {v}</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', fontSize: '0.85rem', fontWeight: 700, flexWrap: 'wrap' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: '#2563eb' }}>
            📍 Blue Issue Pins
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: '#dc2626' }}>
            🔴 High Priority
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: '#ca8a04' }}>
            🟡 Medium Priority
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: '#16a34a' }}>
            🟢 Low Priority
          </span>
        </div>
      </div>

      {/* LEAFLET INTERACTIVE MAP CONTAINER */}
      <div className="dash-card map-card-container" style={{ padding: 0, overflow: 'hidden', height: '520px', minHeight: '340px', marginBottom: '2rem', border: '1.5px solid #e2e8f0', borderRadius: '18px' }}>
        <MapContainer center={mapCenter} zoom={13} style={{ height: '100%', width: '100%' }}>
          <MapController issues={filteredIssues} highlightIssueId={activeHighlight} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {filteredIssues.map((issue) => {
            const isBlueSelected = (activeHighlight === issue.id);

            return (
              <Marker 
                key={issue.id} 
                position={[issue.latitude, issue.longitude]}
                icon={createMarkerIcon(issue.priority, isBlueSelected)}
              >
                <Popup>
                  <div style={{ padding: '0.35rem', minWidth: '220px', maxWidth: '280px' }}>
                    
                    {/* Header with ID & Category */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                      <code style={{ fontSize: '0.82rem', color: isBlueSelected ? '#2563eb' : '#059669', fontWeight: 800, background: isBlueSelected ? '#eff6ff' : '#ecfdf5', padding: '0.2rem 0.4rem', borderRadius: '6px' }}>
                        {issue.id}
                      </code>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '0.15rem 0.4rem', borderRadius: '4px', background: issue.status === 'Resolved' ? '#dcfce7' : (issue.status === 'Adopted' ? '#eff6ff' : '#fef3c7'), color: issue.status === 'Resolved' ? '#166534' : (issue.status === 'Adopted' ? '#1e40af' : '#92400e') }}>
                        {issue.status}
                      </span>
                    </div>

                    <h4 style={{ margin: '0.25rem 0', fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
                      {issue.category}
                    </h4>

                    {/* Exact Location & Pin Code */}
                    <div style={{ margin: '0.4rem 0', fontSize: '0.83rem', color: '#334155', lineHeight: '1.45', background: '#f8fafc', padding: '0.5rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                      <div>📍 <strong>{issue.area}</strong>, {issue.village}</div>
                      <div>📮 PIN Code: <strong>{issue.pincode || '531163'}</strong></div>
                      <div>🏛️ District: <strong>Visakhapatnam, AP</strong></div>
                      <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '0.2rem', fontFamily: 'monospace' }}>
                        🌐 {issue.latitude}, {issue.longitude}
                      </div>
                    </div>

                    {/* Priority & Reporter */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#64748b', marginBottom: '0.4rem' }}>
                      <span>Priority: <strong style={{ color: issue.priority === 'High' ? '#dc2626' : (issue.priority === 'Low' ? '#16a34a' : '#ca8a04') }}>{issue.priority}</strong></span>
                      <span>By: <strong>{issue.reportedBy || 'Citizen'}</strong></span>
                    </div>

                    {/* Description */}
                    <p style={{ fontSize: '0.8rem', color: '#475569', fontStyle: 'italic', margin: '0.35rem 0 0', lineHeight: '1.4' }}>
                      "{issue.description}"
                    </p>

                    {/* Solved by badge if resolved */}
                    {issue.status === 'Resolved' && (
                      <div style={{ marginTop: '0.4rem', padding: '0.3rem 0.5rem', background: '#f0fdf4', borderRadius: '6px', fontSize: '0.75rem', color: '#166534', fontWeight: 700 }}>
                        ✓ Solved by: {issue.resolvedBy}
                      </div>
                    )}
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      {/* GEO-MAPPING EXPLANATION CARD */}
      <div className="dash-card" style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0' }}>
        <div className="dash-card-header" style={{ marginBottom: '0.75rem' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0f172a', fontWeight: 800 }}>
            <Info size={20} style={{ color: '#059669' }} /> Why Geo-Mapping?
          </h3>
          <span className="badge-tag">Spatial Analytics</span>
        </div>
        <p style={{ color: '#475569', fontSize: '0.92rem', lineHeight: '1.7', margin: 0 }}>
          Geo-mapping helps identify where community problems are concentrated. By combining issue categories with Visakhapatnam locality coordinates, VillageVision AI highlights problem clusters and supports rapid authority response.
        </p>
      </div>

    </div>
  );
}
