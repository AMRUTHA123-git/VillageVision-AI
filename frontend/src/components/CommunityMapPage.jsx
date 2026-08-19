import React, { useState, useEffect } from 'react';
import {
  Filter,
  RotateCcw,
  MapPin,
  Info
} from 'lucide-react';

import {
  getStoredIssues,
  filterIssues,
  LOCATION_HIERARCHY,
  ISSUE_CATEGORIES
} from '../utils/issueData';

import 'leaflet/dist/leaflet.css';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap
} from 'react-leaflet';

import L from 'leaflet';

// Fix Leaflet default icons
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
});


// ---------------------------------------------
// COLOURED MARKERS
// ---------------------------------------------

const createPriorityIcon = (priority) => {

  let color = '#facc15';

  if (priority === 'High') {
    color = '#ef4444';
  }

  if (priority === 'Medium') {
    color = '#facc15';
  }

  if (priority === 'Low') {
    color = '#22c55e';
  }

  return L.divIcon({
    className: 'custom-priority-marker',

    html: `
      <div style="
        width: 30px;
        height: 30px;
        background: ${color};
        border: 3px solid white;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        box-shadow: 0 3px 10px rgba(0,0,0,0.35);
        position: relative;
      ">
        <div style="
          width: 9px;
          height: 9px;
          background: white;
          border-radius: 50%;
          position: absolute;
          top: 7px;
          left: 7px;
        "></div>
      </div>
    `,

    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30]
  });
};


// ---------------------------------------------
// MAP CENTER COMPONENT
// ---------------------------------------------

function MapController({ issues }) {

  const map = useMap();

  useEffect(() => {

    if (!issues.length) return;

    const validIssues = issues.filter(
      issue =>
        Number.isFinite(Number(issue.latitude)) &&
        Number.isFinite(Number(issue.longitude))
    );

    if (!validIssues.length) return;

    const bounds = L.latLngBounds(
      validIssues.map(issue => [
        Number(issue.latitude),
        Number(issue.longitude)
      ])
    );

    map.fitBounds(bounds, {
      padding: [50, 50],
      maxZoom: 15
    });

  }, [issues, map]);

  return null;
}


// ---------------------------------------------
// MAIN COMPONENT
// ---------------------------------------------

export default function CommunityMapPage() {

  const [issues, setIssues] = useState([]);

  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedVillage, setSelectedVillage] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');

  // Load issues
  useEffect(() => {

    const loadIssues = () => {
      setIssues(getStoredIssues());
    };

    loadIssues();

    // Refresh map whenever another page adds/updates an issue
    const interval = setInterval(loadIssues, 1000);

    return () => clearInterval(interval);

  }, []);


  // ---------------------------------------------
  // LOCATION FILTERS
  // ---------------------------------------------

  const stateOptions =
    Object.keys(LOCATION_HIERARCHY || {})
      .filter(state => state !== 'Other');


  const districtOptions =
    selectedState
      ? Object.keys(
          LOCATION_HIERARCHY[selectedState] || {}
        ).filter(district => district !== 'Other')
      : [];


  const villageOptions =
    selectedState && selectedDistrict
      ? (
          Array.isArray(
            LOCATION_HIERARCHY[selectedState]?.[selectedDistrict]
          )
            ? LOCATION_HIERARCHY[selectedState][selectedDistrict]
            : Object.keys(
                LOCATION_HIERARCHY[selectedState]?.[selectedDistrict] || {}
              )
        ).filter(village => village !== 'Other')
      : [];


  // ---------------------------------------------
  // CLEAR FILTERS
  // ---------------------------------------------

  const handleClearFilters = () => {

    setSelectedState('');
    setSelectedDistrict('');
    setSelectedVillage('');
    setSelectedCategory('');
    setSelectedStatus('');
    setSelectedPriority('');

  };


  // ---------------------------------------------
  // FILTER ISSUES
  // ---------------------------------------------

  const filteredIssues = filterIssues(
    issues,
    {
      state: selectedState,
      district: selectedDistrict,
      village: selectedVillage,
      category: selectedCategory,
      status: selectedStatus,
      priority: selectedPriority
    }
  ).filter(issue => issue.status !== 'Resolved');


  // ---------------------------------------------
  // DEFAULT MAP LOCATION
  // ---------------------------------------------

  const defaultCenter = [17.3542, 82.5488];


  return (

    <div className="community-map-wrapper">

      {/* HEADER */}

      <div
        className="dash-card-header"
        style={{ marginBottom: '1.5rem' }}
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
            Real-Time{' '}
            <span className="gradient-text">
              Community Map
            </span>
          </h1>

          <p
            style={{
              color: 'var(--text-muted)',
              fontSize: '0.98rem'
            }}
          >
            View community problems geographically with
            colour-coded priority markers.
          </p>

        </div>

        <span className="badge-tag">
          {filteredIssues.length} Active Issues
        </span>

      </div>


      {/* LEGEND */}

      <div
        className="dash-card"
        style={{
          marginBottom: '1.25rem',
          display: 'flex',
          gap: '1.5rem',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}
      >

        <strong>
          Priority:
        </strong>

        <span>
          🔴 High
        </span>

        <span>
          🟡 Medium
        </span>

        <span>
          🟢 Low
        </span>

        <span style={{ color: 'var(--text-muted)' }}>
          Resolved issues are automatically removed from the map.
        </span>

      </div>


      {/* FILTER BAR */}

      <div
        className="dash-card"
        style={{ marginBottom: '1.5rem' }}
      >

        <div
          className="dash-card-header"
          style={{ marginBottom: '1rem' }}
        >

          <h3>
            <Filter
              size={18}
              style={{
                verticalAlign: 'middle',
                marginRight: '6px'
              }}
            />

            Map Filters
          </h3>

          <button
            className="btn btn-outline btn-sm"
            onClick={handleClearFilters}
          >

            <RotateCcw size={14} />

            Clear Filters

          </button>

        </div>


        <div
          className="dash-two-col"
          style={{
            gridTemplateColumns:
              'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '0.75rem'
          }}
        >

          {/* STATE */}

          <div>

            <label className="input-label">
              State
            </label>

            <select
              className="form-input"
              value={selectedState}
              onChange={(e) => {

                setSelectedState(e.target.value);
                setSelectedDistrict('');
                setSelectedVillage('');

              }}
            >

              <option value="">
                All States
              </option>

              {stateOptions.map(state => (

                <option
                  key={state}
                  value={state}
                >
                  {state}
                </option>

              ))}

            </select>

          </div>


          {/* DISTRICT */}

          <div>

            <label className="input-label">
              District
            </label>

            <select
              className="form-input"
              value={selectedDistrict}
              disabled={!selectedState}
              onChange={(e) => {

                setSelectedDistrict(e.target.value);
                setSelectedVillage('');

              }}
            >

              <option value="">
                All Districts
              </option>

              {districtOptions.map(district => (

                <option
                  key={district}
                  value={district}
                >
                  {district}
                </option>

              ))}

            </select>

          </div>


          {/* VILLAGE */}

          <div>

            <label className="input-label">
              Village
            </label>

            <select
              className="form-input"
              value={selectedVillage}
              disabled={!selectedDistrict}
              onChange={(e) =>
                setSelectedVillage(e.target.value)
              }
            >

              <option value="">
                All Villages
              </option>

              {villageOptions.map(village => (

                <option
                  key={village}
                  value={village}
                >
                  {village}
                </option>

              ))}

            </select>

          </div>


          {/* CATEGORY */}

          <div>

            <label className="input-label">
              Category
            </label>

            <select
              className="form-input"
              value={selectedCategory}
              onChange={(e) =>
                setSelectedCategory(e.target.value)
              }
            >

              <option value="">
                All Categories
              </option>

              {ISSUE_CATEGORIES.map(category => (

                <option
                  key={category}
                  value={category}
                >
                  {category}
                </option>

              ))}

            </select>

          </div>


          {/* STATUS */}

          <div>

            <label className="input-label">
              Status
            </label>

            <select
              className="form-input"
              value={selectedStatus}
              onChange={(e) =>
                setSelectedStatus(e.target.value)
              }
            >

              <option value="">
                All Statuses
              </option>

              <option value="Open">
                Open
              </option>

              <option value="Verified">
                Verified
              </option>

              <option value="Assigned">
                Assigned
              </option>

              <option value="In Progress">
                In Progress
              </option>

            </select>

          </div>


          {/* PRIORITY */}

          <div>

            <label className="input-label">
              Priority
            </label>

            <select
              className="form-input"
              value={selectedPriority}
              onChange={(e) =>
                setSelectedPriority(e.target.value)
              }
            >

              <option value="">
                All Priorities
              </option>

              <option value="High">
                High
              </option>

              <option value="Medium">
                Medium
              </option>

              <option value="Low">
                Low
              </option>

            </select>

          </div>

        </div>

      </div>


      {/* REAL OPENSTREETMAP */}

      <div
        className="dash-card"
        style={{
          padding: 0,
          overflow: 'hidden',
          height: '550px',
          marginBottom: '2rem'
        }}
      >

        <MapContainer
          center={defaultCenter}
          zoom={13}
          scrollWheelZoom={true}
          style={{
            height: '100%',
            width: '100%'
          }}
        >

          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />


          <MapController
            issues={filteredIssues}
          />


          {/* ISSUE MARKERS */}

          {filteredIssues.map(issue => (

            <Marker
              key={issue.id}
              position={[
                Number(issue.latitude),
                Number(issue.longitude)
              ]}
              icon={createPriorityIcon(issue.priority)}
            >

              <Popup>

                <div
                  style={{
                    minWidth: '220px'
                  }}
                >

                  <strong>
                    {issue.id}
                  </strong>

                  <h3
                    style={{
                      margin: '5px 0'
                    }}
                  >
                    {issue.category}
                  </h3>

                  <p>
                    📍 {issue.area},
                    {' '}
                    {issue.village}
                  </p>

                  <p>
                    <strong>
                      Priority:
                    </strong>{' '}
                    {issue.priority}
                  </p>

                  <p>
                    <strong>
                      Status:
                    </strong>{' '}
                    {issue.status}
                  </p>

                  <p
                    style={{
                      color: '#64748b'
                    }}
                  >
                    {issue.description}
                  </p>

                </div>

              </Popup>

            </Marker>

          ))}

        </MapContainer>

      </div>


      {/* INFORMATION */}

      <div
        className="dash-card"
        style={{
          background:
            'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(20,184,166,0.05))'
        }}
      >

        <h3>

          <Info
            size={20}
            style={{
              verticalAlign: 'middle',
              marginRight: '6px'
            }}
          />

          Geo-Mapping & AI

        </h3>

        <p
          style={{
            color: 'var(--text-light)',
            lineHeight: '1.7'
          }}
        >

          VillageVision AI uses geo-tagged reports to
          visualize community problems on a real map.
          High-priority problems appear in red, medium
          priority problems in yellow and low-priority
          problems in green. Once an issue is resolved,
          its marker automatically disappears from the
          active map.

        </p>

      </div>

    </div>

  );

}