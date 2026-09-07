import React, { useState, useEffect } from 'react';
import { 
  Map as MapIcon, 
  MapPin, 
  Info, 
  Layers,
  Sparkles,
  Filter
} from 'lucide-react';
import { getStoredIssues, filterIssues, VISAKHAPATNAM_VILLAGES } from '../utils/issueData';

import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Priority-colored map marker helper
const createPriorityIcon = (priority) => {
  let color = '#eab308'; // medium yellow/orange
  if (priority === 'High') {
    color = '#ef4444'; // red
  } else if (priority === 'Low') {
    color = '#10b981'; // green
  }

  return L.divIcon({
    className: 'custom-priority-marker',
    html: `
      <div style="
        width: 28px;
        height: 28px;
        background: ${color};
        border: 2px solid #ffffff;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        position: relative;
      ">
        <div style="
          width: 8px;
          height: 8px;
          background: white;
          border-radius: 50%;
          position: absolute;
          top: 6px;
          left: 6px;
        "></div>
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28]
  });
};

function MapAutoCenter({ issues }) {
  const map = useMap();
  useEffect(() => {
    if (map && issues && issues.length > 0) {
      const valid = issues.filter(i => i.latitude && i.longitude && Number.isFinite(i.latitude) && Number.isFinite(i.longitude));
      if (valid.length > 0) {
        try {
          if (valid.length === 1) {
            map.setView([valid[0].latitude, valid[0].longitude], 14, { animate: false });
          } else {
            const bounds = L.latLngBounds(valid.map(i => [i.latitude, i.longitude]));
            map.fitBounds(bounds, { padding: [40, 40], animate: false });
          }
        } catch (e) {
          // Safe fallback
        }
      }
    }
  }, [issues, map]);
  return null;
}

export default function CommunityMapPage() {
  const [issues, setIssues] = useState([]);
  const [selectedVillage, setSelectedVillage] = useState('All Villages / Areas');

  useEffect(() => {
    setIssues(getStoredIssues());
  }, []);

  // Filter out Resolved issues from active map markers
  const activeIssues = issues.filter(i => i.status !== 'Resolved');

  const filteredIssues = activeIssues.filter(issue => {
    if (selectedVillage && selectedVillage !== 'All Villages / Areas' && issue.village !== selectedVillage) {
      return false;
    }
    return true;
  });

  const mapCenter = [17.8912, 83.4542]; // Visakhapatnam center fallback

  return (
    <div className="community-map-wrapper">
      
      {/* HEADER */}
      <div className="dash-card-header" style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="hero-title" style={{ fontSize: '1.85rem', textAlign: 'left', marginBottom: '0.25rem', color: '#0f172a' }}>
            Interactive <span className="gradient-text">Community Map</span>
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem', margin: 0 }}>
            Spatial visualization of active geo-tagged community issues in Visakhapatnam.
          </p>
        </div>

        {/* Fixed Location Badge */}
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

      {/* MAP FILTER CONTROLS */}
      <div className="dash-card" style={{ marginBottom: '1.5rem', padding: '1.25rem 1.5rem', background: '#ffffff', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <label className="input-label-bold" style={{ margin: 0 }}>Select Village / Area:</label>
          <select 
            className="form-input" 
            value={selectedVillage} 
            onChange={(e) => setSelectedVillage(e.target.value)}
            style={{ minWidth: '220px', background: '#f8fafc' }}
          >
            <option value="All Villages / Areas">📍 All Villages / Areas</option>
            {VISAKHAPATNAM_VILLAGES.map(v => <option key={v} value={v}>📍 {v}</option>)}
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.85rem', fontWeight: 700 }}>
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
      <div className="dash-card" style={{ padding: 0, overflow: 'hidden', height: '520px', marginBottom: '2rem', border: '1.5px solid #e2e8f0', borderRadius: '18px' }}>
        <MapContainer center={mapCenter} zoom={13} style={{ height: '100%', width: '100%' }}>
          <MapAutoCenter issues={filteredIssues} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {filteredIssues.map((issue) => (
            <Marker 
              key={issue.id} 
              position={[issue.latitude, issue.longitude]}
              icon={createPriorityIcon(issue.priority)}
            >
              <Popup>
                <div style={{ padding: '0.25rem', minWidth: '180px' }}>
                  <code style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 700 }}>{issue.id}</code>
                  <h4 style={{ margin: '0.2rem 0', fontSize: '0.95rem', color: '#0f172a' }}>{issue.category}</h4>
                  <p style={{ margin: '0.2rem 0', fontSize: '0.82rem', color: '#475569' }}>
                    <strong>{issue.area}</strong>, {issue.village}<br />
                    Visakhapatnam ({issue.pincode})<br />
                    Priority: <strong>{issue.priority}</strong> &bull; Status: <strong>{issue.status}</strong>
                  </p>
                  <p style={{ fontSize: '0.8rem', color: '#64748b', fontStyle: 'italic', margin: '0.35rem 0 0' }}>
                    "{issue.description.substring(0, 75)}..."
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}
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