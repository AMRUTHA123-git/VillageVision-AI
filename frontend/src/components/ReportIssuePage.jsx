import React, { useState, useEffect } from 'react';
import { 
  PlusCircle, 
  MapPin, 
  Camera, 
  CheckCircle2, 
  AlertCircle, 
  Navigation, 
  Upload, 
  FileText, 
  Map as MapIcon, 
  ArrowRight,
  Sparkles,
  Layers,
  Hash
} from 'lucide-react';
import { saveIssue, ISSUE_CATEGORIES, VISAKHAPATNAM_VILLAGES } from '../utils/issueData';
import { apiReverseGeocode } from '../utils/api';

// Leaflet CSS & Component Imports
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

// Fix Leaflet default icon path in Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Helper component to center map view dynamically when coordinates change
function RecenterMap({ lat, lng }) {
  const map = useMap();
  useEffect(() => {
    if (map && lat && lng && Number.isFinite(lat) && Number.isFinite(lng)) {
      try {
        map.setView([lat, lng], 14, { animate: false });
      } catch (e) {
        // Safe fallback
      }
    }
  }, [lat, lng, map]);
  return null;
}

// Allow user to click on map to reposition marker
function MapClickHandler({ onLocationChange }) {
  useMapEvents({
    click(e) {
      if (e.latlng && onLocationChange) {
        onLocationChange(parseFloat(e.latlng.lat.toFixed(4)), parseFloat(e.latlng.lng.toFixed(4)));
      }
    }
  });
  return null;
}

export default function ReportIssuePage({ user, onNavigate }) {
  const [category, setCategory] = useState('Road Damage');
  const [description, setDescription] = useState('');
  const [photoPreview, setPhotoPreview] = useState(null);

  // Visakhapatnam Location State
  const [selectedState] = useState('Andhra Pradesh');
  const [selectedDistrict] = useState('Visakhapatnam');
  const [selectedVillage, setSelectedVillage] = useState('Bheemunipatnam');
  const [selectedArea, setSelectedArea] = useState('');
  const [pincode, setPincode] = useState('531163');

  // Priority Selection: High, Medium, Low
  const [priority, setPriority] = useState('High');

  // Geolocation & Coordinates (Visakhapatnam)
  const [latitude, setLatitude] = useState(17.8912);
  const [longitude, setLongitude] = useState(83.4542);
  const [geoDetected, setGeoDetected] = useState(false);
  const [geoError, setGeoError] = useState('');
  const [isLocating, setIsLocating] = useState(false);

  // Submission State
  const [errorMessage, setErrorMessage] = useState('');
  const [submittedIssue, setSubmittedIssue] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Photo Upload Handler with FileReader preview
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Browser Geolocation Trigger + Reverse Geocoding
  const handleGetLocation = () => {
    setGeoError('');
    setGeoDetected(false);
    setIsLocating(true);

    if (!navigator.geolocation) {
      setIsLocating(false);
      setGeoError('Geolocation is not supported by your browser. Please select location manually.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = parseFloat(pos.coords.latitude.toFixed(4));
        const lng = parseFloat(pos.coords.longitude.toFixed(4));
        setLatitude(lat);
        setLongitude(lng);

        try {
          const res = await apiReverseGeocode(lat, lng);
          if (res.success && res.data) {
            if (res.data.village) {
              setSelectedVillage(res.data.village);
            }
            if (res.data.area) {
              setSelectedArea(res.data.area);
            }
            if (res.data.pincode && String(res.data.pincode).trim().length === 6) {
              setPincode(String(res.data.pincode).trim());
              setGeoDetected(true);
              setGeoError('');
            } else {
              // Real reverse geocode did not detect PIN code -> prompt citizen to enter manually without guessing
              setGeoDetected(true);
              setGeoError('PIN code could not be detected. Please enter it manually.');
            }
          } else {
            setGeoDetected(true);
            setGeoError('PIN code could not be detected. Please enter it manually.');
          }
        } catch (err) {
          console.warn('Reverse geocode error:', err);
          setGeoDetected(true);
          setGeoError('PIN code could not be detected. Please enter it manually.');
        } finally {
          setIsLocating(false);
        }
      },
      (err) => {
        setIsLocating(false);
        console.warn('Geolocation access denied/failed:', err);
        if (err.code === 1) {
          setGeoError('Location access was denied. Please allow location permissions in your browser or select your area manually.');
        } else {
          setGeoError('Unable to access your GPS location. You can click on the map below or enter the area manually.');
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!category) {
      setErrorMessage('Please select an issue category.');
      return;
    }

    if (!description.trim()) {
      setErrorMessage('Please enter a description for the issue.');
      return;
    }

    if (!selectedVillage) {
      setErrorMessage('Please select a village / area within Visakhapatnam.');
      return;
    }

    if (!selectedArea.trim()) {
      setErrorMessage('Please specify the Area / Street (e.g. School Road, Market Street).');
      return;
    }

    if (pincode && pincode.trim().length > 0 && pincode.trim().length !== 6) {
      setErrorMessage('Please enter a valid 6-digit pincode.');
      return;
    }

    setIsSubmitting(true);

    try {
      const created = await saveIssue({
        category,
        description: description.trim(),
        photo: photoPreview,
        state: selectedState,
        district: selectedDistrict,
        village: selectedVillage,
        area: selectedArea.trim(),
        pincode: (pincode || '').trim(),
        latitude,
        longitude,
        priority,
        reportedBy: user?.fullName || user?.name || 'Authenticated Citizen',
        reportedByUserId: user?.id || '',
        reportedByIdentifier: user?.identifier || user?.email || '',
        reportedByEmail: user?.email || user?.identifier || '',
        reportedByRole: user?.role || 'Citizen'
      });

      setIsSubmitting(false);
      setSubmittedIssue(created);
    } catch (err) {
      setIsSubmitting(false);
      setErrorMessage(err.message || 'Failed to submit issue.');
    }
  };

  return (
    <div className="report-issue-wrapper">
      
      {/* PAGE HEADER */}
      <div className="dash-card-header" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h1 className="hero-title" style={{ fontSize: '1.85rem', textAlign: 'left', marginBottom: '0.25rem', color: '#0f172a' }}>
            Report a <span className="gradient-text">Community Issue</span>
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
            Report civic, road, sanitation, or infrastructure problems across <strong>Visakhapatnam</strong> with instant GPS & geo-tagging.
          </p>
        </div>
        <span className="badge-tag">Visakhapatnam Civic Portal</span>
      </div>

      {/* SUCCESS CONFIRMATION CARD */}
      {submittedIssue ? (
        <div className="dash-card" style={{ textAlign: 'center', padding: '3rem 2rem', background: '#ffffff', border: '1px solid #e2e8f0' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
            <CheckCircle2 size={36} />
          </div>

          <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
            Your issue has been reported successfully!
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.95rem', maxWidth: '520px', margin: '0 auto 1.75rem' }}>
            Your civic report has been registered with status <strong style={{ color: '#059669' }}>Open</strong> and geo-tagged for community monitoring.
          </p>

          <div style={{
            background: '#f8fafc',
            border: '1.5px solid #e2e8f0',
            borderRadius: '16px',
            padding: '1.5rem',
            maxWidth: '480px',
            margin: '0 auto 2rem',
            textAlign: 'left'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Issue ID:</span>
              <code className="id-code">{submittedIssue.id}</code>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Category:</span>
              <strong style={{ color: '#0f172a' }}>{submittedIssue.category}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Location:</span>
              <strong style={{ color: '#059669' }}>
                {submittedIssue.area}, {submittedIssue.village}, Visakhapatnam
              </strong>
            </div>
            {submittedIssue.pincode && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Pincode:</span>
                <strong style={{ color: '#059669', fontFamily: 'monospace' }}>
                  📮 {submittedIssue.pincode}
                </strong>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Priority:</span>
              <span className={`priority-tag ${submittedIssue.priority.toLowerCase()}`}>
                {submittedIssue.priority} Priority
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Coordinates:</span>
              <span style={{ fontFamily: 'monospace', color: '#64748b', fontSize: '0.85rem' }}>
                {submittedIssue.latitude}, {submittedIssue.longitude}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={() => onNavigate && onNavigate('my-reports')}>
              <FileText size={18} /> View in My Reports
            </button>
            <button className="btn btn-secondary" onClick={() => onNavigate && onNavigate('map')}>
              <MapIcon size={18} /> View on Community Map
            </button>
            <button 
              className="btn btn-outline" 
              onClick={() => {
                setSubmittedIssue(null);
                setDescription('');
                setSelectedArea('');
                setPhotoPreview(null);
              }}
            >
              <PlusCircle size={18} /> Report Another Issue
            </button>
          </div>
        </div>
      ) : (

        /* MAIN REPORT FORM */
        <div className="dash-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0' }}>
          
          {/* Error Alert Banner */}
          {errorMessage && (
            <div className="error-alert-box" style={{ marginBottom: '1.5rem' }}>
              <AlertCircle size={18} className="error-alert-icon" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            
            {/* SECTION 1: ISSUE DETAILS */}
            <div className="form-section-title" style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <PlusCircle size={20} style={{ color: '#059669' }} /> 1. Problem Information
            </div>

            <div className="form-two-col" style={{ marginBottom: '1.25rem' }}>
              
              {/* Category Selection */}
              <div className="form-group">
                <label className="input-label-bold">Problem Category *</label>
                <select 
                  className="form-input"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  {ISSUE_CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Priority Selection */}
              <div className="form-group">
                <label className="input-label-bold">Priority Level *</label>
                <select 
                  className="form-input"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  required
                >
                  <option value="High">🔴 High Priority (Immediate Danger / Major Disruption)</option>
                  <option value="Medium">🟠 Medium Priority (Moderate Inconvenience)</option>
                  <option value="Low">🔵 Low Priority (Minor / General Maintenance)</option>
                </select>
              </div>

            </div>

            {/* Photo Upload with capture="environment" for camera on mobile */}
            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label className="input-label-bold">Attach Photo (Optional)</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <input 
                  type="file" 
                  id="photo-input" 
                  accept="image/*"
                  capture="environment"
                  onChange={handlePhotoUpload}
                  style={{ display: 'none' }}
                />
                <label 
                  htmlFor="photo-input" 
                  className="btn btn-outline" 
                  style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <Camera size={18} /> {photoPreview ? "Change Photo" : "Take Photo / Upload Image"}
                </label>
                {photoPreview && (
                  <div style={{ width: '64px', height: '64px', borderRadius: '10px', overflow: 'hidden', border: '2px solid #10b981' }}>
                    <img src={photoPreview} alt="Issue preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="form-group" style={{ marginBottom: '1.75rem' }}>
              <label className="input-label-bold">Problem Description *</label>
              <textarea
                className="form-input"
                rows="3"
                placeholder="Describe the problem clearly (e.g. Broken water pipeline leaking onto road near community center...)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
            </div>

            {/* SECTION 2: VISAKHAPATNAM LOCATION & GPS */}
            <div className="form-section-title" style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin size={20} style={{ color: '#059669' }} /> 2. Location & Geo-Tagging (Visakhapatnam)
            </div>

            {/* Location Fields Grid */}
            <div className="form-four-col" style={{ marginBottom: '1.25rem' }}>
              
              {/* Village / Area */}
              <div className="form-group">
                <label className="input-label-bold">Village / Area *</label>
                <select 
                  className="form-input"
                  value={selectedVillage}
                  onChange={(e) => setSelectedVillage(e.target.value)}
                  required
                >
                  {VISAKHAPATNAM_VILLAGES.map((v) => (
                    <option key={v} value={v}>📍 {v}</option>
                  ))}
                </select>
              </div>

              {/* Area / Street */}
              <div className="form-group">
                <label className="input-label-bold">Area / Street *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Main Road, School St"
                  value={selectedArea}
                  onChange={(e) => setSelectedArea(e.target.value)}
                  required
                />
              </div>

              {/* Pincode Input */}
              <div className="form-group">
                <label className="input-label-bold">Pincode (6-digits) *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. 531163"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  maxLength={6}
                  required
                />
              </div>

              {/* District / State */}
              <div className="form-group">
                <label className="input-label">District & State</label>
                <input type="text" className="form-input" value="Visakhapatnam, AP" disabled style={{ background: '#f1f5f9', cursor: 'not-allowed' }} />
              </div>

            </div>

            {/* Geolocation Button */}
            <div style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={handleGetLocation}
                disabled={isLocating}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <Navigation size={18} style={{ color: '#059669' }} /> {isLocating ? "Detecting GPS & Location..." : "📍 Use My Current Location"}
              </button>

              {geoDetected && (
                <span style={{ fontSize: '0.86rem', color: '#059669', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                  <CheckCircle2 size={16} /> GPS Detected ({latitude}, {longitude})
                </span>
              )}
            </div>

            {geoError && (
              <div className="info-alert-box" style={{ marginBottom: '1.25rem' }}>
                <AlertCircle size={18} className="info-alert-icon" />
                <span>{geoError}</span>
              </div>
            )}

            {/* OPENSTREETMAP LEAFLET INTERACTIVE MAP */}
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label className="input-label-bold" style={{ margin: 0 }}>
                  Interactive Location Map (Click anywhere on map to pin problem spot)
                </label>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  Lat: {latitude}, Lng: {longitude}
                </span>
              </div>

              <div style={{ height: '300px', width: '100%', borderRadius: '16px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                <MapContainer center={[latitude, longitude]} zoom={14} style={{ height: '100%', width: '100%' }}>
                  <RecenterMap lat={latitude} lng={longitude} />
                  <MapClickHandler onLocationChange={(lat, lng) => { setLatitude(lat); setLongitude(lng); }} />
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={[latitude, longitude]}>
                    <Popup>
                      <strong>{category}</strong><br />
                      {selectedArea || 'Selected Area'}, {selectedVillage}, Visakhapatnam ({pincode})
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <button 
              type="submit" 
              className="login-green-btn" 
              disabled={isSubmitting}
              style={{ width: '100%', padding: '0.95rem', fontSize: '1.05rem' }}
            >
              <PlusCircle size={20} />
              <span>{isSubmitting ? "Submitting Issue..." : "Submit Issue"}</span>
            </button>

          </form>

        </div>
      )}

    </div>
  );
}