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
  Map as MapIcon
} from 'lucide-react';

import { LOCATION_HIERARCHY, saveIssue } from '../utils/issueData';

import 'leaflet/dist/leaflet.css';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents
} from 'react-leaflet';

import L from 'leaflet';

// Fix Leaflet marker icons in Vite
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl:
    'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl:
    'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png'
});

// Allow user to click the map and select a location
function MapClickHandler({ onLocationChange }) {
  useMapEvents({
    click(e) {
      onLocationChange(e.latlng.lat, e.latlng.lng);
    }
  });

  return null;
}

export default function ReportIssuePage({ user, onNavigate }) {
  const [category, setCategory] = useState('Road Damage');
  const [description, setDescription] = useState('');

  // Photo / Camera
  const [photoPreview, setPhotoPreview] = useState(null);

  // Location hierarchy
  const [selectedState, setSelectedState] =
    useState('Andhra Pradesh');

  const [selectedDistrict, setSelectedDistrict] =
    useState('Kakinada');

  const [selectedVillage, setSelectedVillage] =
    useState('Tuni');

  const [selectedArea, setSelectedArea] =
    useState('School Road');

  // Coordinates
  const [latitude, setLatitude] =
    useState(17.3542);

  const [longitude, setLongitude] =
    useState(82.5488);

  const [geoDetected, setGeoDetected] =
    useState(false);

  const [geoError, setGeoError] =
    useState('');

  // Submission
  const [errorMessage, setErrorMessage] =
    useState('');

  const [submittedIssue, setSubmittedIssue] =
    useState(null);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  // -----------------------------
  // LOCATION OPTIONS
  // -----------------------------

  const stateOptions =
    Object.keys(LOCATION_HIERARCHY || {});

  const districtOptions =
    selectedState &&
    LOCATION_HIERARCHY[selectedState]
      ? Object.keys(
          LOCATION_HIERARCHY[selectedState]
        )
      : [];

  const villageOptions =
    selectedState &&
    selectedDistrict &&
    LOCATION_HIERARCHY[selectedState] &&
    LOCATION_HIERARCHY[selectedState][selectedDistrict]
      ? Object.keys(
          LOCATION_HIERARCHY[selectedState][selectedDistrict]
        )
      : [];

  const areaOptions =
    selectedState &&
    selectedDistrict &&
    selectedVillage &&
    LOCATION_HIERARCHY[selectedState] &&
    LOCATION_HIERARCHY[selectedState][selectedDistrict] &&
    LOCATION_HIERARCHY[selectedState][selectedDistrict][selectedVillage]
      ? LOCATION_HIERARCHY[selectedState][selectedDistrict][selectedVillage]
      : [];

  // -----------------------------
  // STATE CHANGE
  // -----------------------------

  const handleStateChange = (state) => {
    setSelectedState(state);

    const districts =
      Object.keys(
        LOCATION_HIERARCHY[state] || {}
      );

    const firstDistrict =
      districts[0] || '';

    setSelectedDistrict(firstDistrict);

    const villages =
      firstDistrict
        ? Object.keys(
            LOCATION_HIERARCHY[state][firstDistrict] || {}
          )
        : [];

    const firstVillage =
      villages[0] || '';

    setSelectedVillage(firstVillage);

    const areas =
      firstVillage
        ? LOCATION_HIERARCHY[state][firstDistrict][firstVillage] || []
        : [];

    setSelectedArea(areas[0] || '');
  };

  // -----------------------------
  // DISTRICT CHANGE
  // -----------------------------

  const handleDistrictChange = (district) => {
    setSelectedDistrict(district);

    const villages =
      Object.keys(
        LOCATION_HIERARCHY[selectedState]?.[district] || {}
      );

    const firstVillage =
      villages[0] || '';

    setSelectedVillage(firstVillage);

    const areas =
      LOCATION_HIERARCHY[selectedState]?.[district]?.[firstVillage] || [];

    setSelectedArea(areas[0] || '');
  };

  // -----------------------------
  // VILLAGE CHANGE
  // -----------------------------

  const handleVillageChange = (village) => {
    setSelectedVillage(village);

    const areas =
      LOCATION_HIERARCHY[selectedState]?.[
        selectedDistrict
      ]?.[village] || [];

    setSelectedArea(areas[0] || '');
  };

  // -----------------------------
  // PHOTO / CAMERA
  // -----------------------------

  const handlePhotoUpload = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setPhotoPreview(reader.result);
    };

    reader.readAsDataURL(file);
  };

  // -----------------------------
  // CURRENT LOCATION
  // -----------------------------

  const handleGetLocation = () => {
    setGeoError('');
    setGeoDetected(false);

    if (!navigator.geolocation) {
      setGeoError(
        'Geolocation is not supported by this browser.'
      );
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat =
          Number(position.coords.latitude.toFixed(6));

        const lng =
          Number(position.coords.longitude.toFixed(6));

        setLatitude(lat);
        setLongitude(lng);
        setGeoDetected(true);
      },
      () => {
        setGeoError(
          'Location access was denied or unavailable. Please select the location manually on the map.'
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  // -----------------------------
  // MAP CLICK
  // -----------------------------

  const handleMapLocationChange = (lat, lng) => {
    setLatitude(Number(lat.toFixed(6)));
    setLongitude(Number(lng.toFixed(6)));
    setGeoDetected(true);
    setGeoError('');
  };

  // -----------------------------
  // SUBMIT
  // -----------------------------

  const handleSubmit = (event) => {
    event.preventDefault();

    setErrorMessage('');

    if (!category) {
      setErrorMessage(
        'Please select an issue category.'
      );
      return;
    }

    if (!description.trim()) {
      setErrorMessage(
        'Please describe the problem.'
      );
      return;
    }

    if (
      !selectedState ||
      !selectedDistrict ||
      !selectedVillage ||
      !selectedArea
    ) {
      setErrorMessage(
        'Please complete the location fields.'
      );
      return;
    }

    setIsSubmitting(true);

    const priority =
      category === 'Road Damage' ||
      category === 'Water Leakage'
        ? 'High'
        : category === 'Broken Streetlight' ||
          category === 'Drainage Problem'
        ? 'Medium'
        : 'Low';

    const created = saveIssue({
      category,
      description: description.trim(),
      photo: photoPreview,

      state: selectedState,
      district: selectedDistrict,
      village: selectedVillage,
      area: selectedArea,

      latitude,
      longitude,

      priority,

      reportedBy:
        user?.fullName ||
        'Authenticated User',

      reportedByRole:
        user?.role ||
        'Citizen'
    });

    setIsSubmitting(false);
    setSubmittedIssue(created);
  };

  // -----------------------------
  // SUCCESS PAGE
  // -----------------------------

  if (submittedIssue) {
    return (
      <div className="report-issue-wrapper">

        <div
          className="dash-card"
          style={{
            textAlign: 'center',
            padding: '3rem 2rem'
          }}
        >

          <CheckCircle2
            size={60}
            style={{
              color: 'var(--primary-emerald)',
              margin: '0 auto 1rem'
            }}
          />

          <h2
            style={{
              color: '#fff',
              marginBottom: '0.75rem'
            }}
          >
            Community Issue Reported Successfully!
          </h2>

          <p
            style={{
              color: 'var(--text-muted)',
              marginBottom: '2rem'
            }}
          >
            Your issue has been geo-tagged and added
            to the community issue system.
          </p>

          <div
            style={{
              maxWidth: '500px',
              margin: '0 auto 2rem',
              padding: '1.5rem',
              borderRadius: '16px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid var(--border-color)',
              textAlign: 'left'
            }}
          >

            <p>
              <strong>Issue ID:</strong>{' '}
              {submittedIssue.id}
            </p>

            <p>
              <strong>Category:</strong>{' '}
              {submittedIssue.category}
            </p>

            <p>
              <strong>Location:</strong>{' '}
              {submittedIssue.area},{' '}
              {submittedIssue.village}
            </p>

            <p>
              <strong>Priority:</strong>{' '}
              {submittedIssue.priority}
            </p>

            <p>
              <strong>Status:</strong>{' '}
              <span className="status-pill open">
                Open
              </span>
            </p>

          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '1rem',
              flexWrap: 'wrap'
            }}
          >

            <button
              className="btn btn-primary"
              onClick={() =>
                onNavigate('my-reports')
              }
            >
              <FileText size={18} />
              View My Report
            </button>

            <button
              className="btn btn-secondary"
              onClick={() =>
                onNavigate('map')
              }
            >
              <MapIcon size={18} />
              View Community Map
            </button>

          </div>

        </div>

      </div>
    );
  }

  // -----------------------------
  // MAIN PAGE
  // -----------------------------

  return (
    <div className="report-issue-wrapper">

      {/* HEADER */}

      <div
        className="dash-card-header"
        style={{
          marginBottom: '1.5rem'
        }}
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
            Report a{' '}
            <span className="gradient-text">
              Community Issue
            </span>
          </h1>

          <p
            style={{
              color: 'var(--text-muted)'
            }}
          >
            Report problems in your village with
            photo and exact location.
          </p>

        </div>

        <span className="badge-tag">
          Geo-Tagged Submission
        </span>

      </div>

      <div className="dash-card">

        {/* ERROR */}

        {errorMessage && (
          <div
            className="error-alert-box"
            style={{
              marginBottom: '1.5rem'
            }}
          >
            <AlertCircle size={18} />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {/* ISSUE INFORMATION */}

          <div className="form-section-title">
            <PlusCircle
              size={20}
              className="gradient-text"
            />
            1. Issue Information
          </div>

          <div
            className="dash-two-col"
            style={{
              gridTemplateColumns:
                '1fr 1fr',
              gap: '1.5rem'
            }}
          >

            {/* CATEGORY */}

            <div className="form-group">

              <label className="input-label-bold">
                Issue Category *
              </label>

              <select
                className="form-input"
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value)
                }
              >

                <option>Road Damage</option>
                <option>Water Leakage</option>
                <option>Broken Streetlight</option>
                <option>Garbage Overflow</option>
                <option>Drainage Problem</option>
                <option>Water Supply</option>
                <option>Electricity Problem</option>
                <option>Healthcare</option>
                <option>Transportation</option>
                <option>Sanitation</option>
                <option>Other</option>

              </select>

            </div>

            {/* CAMERA */}

            <div className="form-group">

              <label className="input-label-bold">
                Photo / Camera
              </label>

              <div
                style={{
                  display: 'flex',
                  gap: '0.75rem',
                  flexWrap: 'wrap'
                }}
              >

                {/* CAMERA */}

                <label
                  htmlFor="camera-input"
                  className="btn btn-primary"
                  style={{
                    cursor: 'pointer'
                  }}
                >
                  <Camera size={18} />
                  Take Photo
                </label>

                <input
                  id="camera-input"
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handlePhotoUpload}
                  style={{
                    display: 'none'
                  }}
                />

                {/* FILE UPLOAD */}

                <label
                  htmlFor="photo-input"
                  className="btn btn-secondary"
                  style={{
                    cursor: 'pointer'
                  }}
                >
                  <Upload size={18} />
                  Upload
                </label>

                <input
                  id="photo-input"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  style={{
                    display: 'none'
                  }}
                />

              </div>

              {photoPreview && (
                <div
                  style={{
                    marginTop: '1rem'
                  }}
                >

                  <img
                    src={photoPreview}
                    alt="Issue preview"
                    style={{
                      width: '150px',
                      height: '110px',
                      objectFit: 'cover',
                      borderRadius: '12px',
                      border:
                        '1px solid var(--border-color)'
                    }}
                  />

                </div>
              )}

            </div>

          </div>

          {/* DESCRIPTION */}

          <div
            className="form-group"
            style={{
              marginTop: '1.5rem',
              marginBottom: '2rem'
            }}
          >

            <label className="input-label-bold">
              Describe the Problem *
            </label>

            <textarea
              className="form-input"
              rows="4"
              placeholder="Example: Deep potholes near school entrance..."
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
            />

          </div>

          {/* LOCATION */}

          <div className="form-section-title">

            <MapPin
              size={20}
              className="gradient-text"
            />

            2. Location & Geo-Tagging

          </div>

          {/* CURRENT LOCATION */}

          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleGetLocation}
            style={{
              marginBottom: '1rem'
            }}
          >

            <Navigation size={18} />

            Use My Current Location

          </button>

          {geoDetected && (
            <div
              className="success-alert-box"
              style={{
                marginBottom: '1rem'
              }}
            >
              <CheckCircle2 size={18} />

              Location selected successfully.
            </div>
          )}

          {geoError && (
            <div
              className="info-alert-box"
              style={{
                marginBottom: '1rem'
              }}
            >
              <AlertCircle size={18} />

              {geoError}
            </div>
          )}

          {/* DROPDOWNS */}

          <div
            className="dash-two-col"
            style={{
              gridTemplateColumns:
                'repeat(4, 1fr)',
              gap: '1rem',
              marginBottom: '1.5rem'
            }}
          >

            {/* STATE */}

            <div>

              <label className="input-label">
                State *
              </label>

              <select
                className="form-input"
                value={selectedState}
                onChange={(e) =>
                  handleStateChange(
                    e.target.value
                  )
                }
              >

                {stateOptions.map(
                  (state) => (
                    <option
                      key={state}
                      value={state}
                    >
                      {state}
                    </option>
                  )
                )}

              </select>

            </div>

            {/* DISTRICT */}

            <div>

              <label className="input-label">
                District *
              </label>

              <select
                className="form-input"
                value={selectedDistrict}
                onChange={(e) =>
                  handleDistrictChange(
                    e.target.value
                  )
                }
              >

                {districtOptions.map(
                  (district) => (
                    <option
                      key={district}
                      value={district}
                    >
                      {district}
                    </option>
                  )
                )}

              </select>

            </div>

            {/* VILLAGE */}

            <div>

              <label className="input-label">
                Village *
              </label>

              <select
                className="form-input"
                value={selectedVillage}
                onChange={(e) =>
                  handleVillageChange(
                    e.target.value
                  )
                }
              >

                {villageOptions.map(
                  (village) => (
                    <option
                      key={village}
                      value={village}
                    >
                      {village}
                    </option>
                  )
                )}

              </select>

            </div>

            {/* AREA */}

            <div>

              <label className="input-label">
                Area / Street *
              </label>

              <select
                className="form-input"
                value={selectedArea}
                onChange={(e) =>
                  setSelectedArea(
                    e.target.value
                  )
                }
              >

                {areaOptions.map(
                  (area) => (
                    <option
                      key={area}
                      value={area}
                    >
                      {area}
                    </option>
                  )
                )}

              </select>

            </div>

          </div>

          {/* REAL OPENSTREETMAP */}

          <div
            style={{
              marginBottom: '1.5rem'
            }}
          >

            <label className="input-label-bold">
              Interactive Location Map
            </label>

            <p
              style={{
                color: 'var(--text-muted)',
                fontSize: '0.85rem',
                marginBottom: '0.5rem'
              }}
            >
              Click anywhere on the map to place
              the issue marker.
            </p>

            <div
              style={{
                height: '350px',
                width: '100%',
                borderRadius: '16px',
                overflow: 'hidden',
                border:
                  '1px solid var(--border-color)'
              }}
            >

              <MapContainer
                center={[
                  latitude,
                  longitude
                ]}
                zoom={14}
                style={{
                  height: '100%',
                  width: '100%'
                }}
              >

                <TileLayer
                  attribution="&copy; OpenStreetMap contributors"
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <MapClickHandler
                  onLocationChange={
                    handleMapLocationChange
                  }
                />

                <Marker
                  position={[
                    latitude,
                    longitude
                  ]}
                >

                  <Popup>

                    <strong>
                      {category}
                    </strong>

                    <br />

                    {selectedArea},{' '}
                    {selectedVillage}

                    <br />

                    Lat: {latitude}

                    <br />

                    Lng: {longitude}

                  </Popup>

                </Marker>

              </MapContainer>

            </div>

          </div>

          {/* LOCATION INFO */}

          <div
            style={{
              background:
                'rgba(20,184,166,0.08)',
              border:
                '1px solid var(--border-color)',
              borderRadius: '12px',
              padding: '1rem',
              marginBottom: '2rem'
            }}
          >

            <strong>
              Selected Location:
            </strong>

            <div>
              {selectedState} →{' '}
              {selectedDistrict} →{' '}
              {selectedVillage} →{' '}
              {selectedArea}
            </div>

            <div
              style={{
                marginTop: '0.5rem',
                fontFamily: 'monospace',
                color:
                  'var(--primary-teal)'
              }}
            >
              Latitude: {latitude}
              <br />
              Longitude: {longitude}
            </div>

          </div>

          {/* SUBMIT */}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
            style={{
              width: '100%',
              justifyContent: 'center',
              padding: '1rem',
              fontSize: '1.05rem'
            }}
          >

            <PlusCircle size={20} />

            {isSubmitting
              ? 'Submitting Issue...'
              : 'Submit Issue'}

          </button>

        </form>

      </div>

    </div>
  );
}