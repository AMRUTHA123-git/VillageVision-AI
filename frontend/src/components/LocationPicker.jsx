import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, Plus, CheckCircle2, X, AlertCircle } from 'lucide-react';
import {
  getAllStates,
  getDistricts,
  getVillages,
  addCustomState,
  addCustomDistrict,
  addCustomVillage,
} from '../utils/locationManager.js';

/**
 * SearchableDropdown — Searchable, A-Z sorted dropdown with "+ Add" option.
 */
export function SearchableDropdown({
  label,
  options = [],
  value,
  onChange,
  placeholder = 'Select...',
  disabled = false,
  disabledText = 'Unavailable',
  onAdd,
  addLabel = '+ Add',
  required = false,
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [addValue, setAddValue] = useState('');
  const [addError, setAddError] = useState('');
  const [addSuccess, setAddSuccess] = useState('');
  const wrapperRef = useRef(null);
  const searchRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
        setSearch('');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search when dropdown opens
  useEffect(() => {
    if (open && searchRef.current) {
      setTimeout(() => searchRef.current?.focus(), 50);
    }
  }, [open]);

  const filtered = options.filter(opt =>
    opt.toLowerCase().includes(search.toLowerCase().trim())
  );

  const handleSelect = (opt) => {
    onChange(opt);
    setOpen(false);
    setSearch('');
  };

  const handleAddSubmit = () => {
    setAddError('');
    setAddSuccess('');
    if (!addValue.trim()) {
      setAddError('Name cannot be empty.');
      return;
    }
    const result = onAdd(addValue.trim());
    if (result.success) {
      setAddSuccess(`"${addValue.trim()}" added successfully.`);
      onChange(addValue.trim());
      setAddValue('');
      setTimeout(() => {
        setShowAddModal(false);
        setAddSuccess('');
      }, 700);
    } else {
      setAddError(result.message || 'Failed to add location.');
    }
  };

  return (
    <div className="searchable-dropdown-wrapper" ref={wrapperRef}>
      {label && (
        <label className="input-label-bold">
          {label} {required && <span style={{ color: '#f87171' }}>*</span>}
        </label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        className={`searchable-trigger ${open ? 'active' : ''} ${disabled ? 'disabled' : ''}`}
        onClick={() => { if (!disabled) setOpen(!open); }}
        disabled={disabled}
      >
        <span className={value ? 'trigger-selected' : 'trigger-placeholder'}>
          {disabled ? disabledText : (value || placeholder)}
        </span>
        <ChevronDown size={16} className={`trigger-chevron ${open ? 'rotated' : ''}`} />
      </button>

      {/* Dropdown Panel */}
      {open && !disabled && (
        <div className="dropdown-panel">
          {/* Search Input */}
          <div className="dropdown-search-row">
            <Search size={15} className="dropdown-search-icon" />
            <input
              ref={searchRef}
              type="text"
              className="dropdown-search-input"
              placeholder="Search..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              onClick={e => e.stopPropagation()}
            />
            {search && (
              <button className="dropdown-clear-search" onClick={() => setSearch('')}>
                <X size={13} />
              </button>
            )}
          </div>

          {/* Options List */}
          <ul className="dropdown-options-list">
            {filtered.length === 0 ? (
              <li className="dropdown-no-results">No results found</li>
            ) : (
              filtered.map(opt => (
                <li
                  key={opt}
                  className={`dropdown-option ${value === opt ? 'selected' : ''}`}
                  onClick={() => handleSelect(opt)}
                >
                  {opt}
                  {value === opt && <CheckCircle2 size={14} className="option-check" />}
                </li>
              ))
            )}
          </ul>

          {/* Add Option */}
          {onAdd && (
            <button
              type="button"
              className="dropdown-add-btn"
              onClick={() => { setShowAddModal(true); setOpen(false); setSearch(''); setAddError(''); setAddValue(''); }}
            >
              <Plus size={15} /> {addLabel}
            </button>
          )}
        </div>
      )}

      {/* Add Location Modal */}
      {showAddModal && (
        <div className="add-location-modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="add-location-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{addLabel}</h3>
              <button type="button" className="modal-close-btn" onClick={() => setShowAddModal(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              <label className="input-label">Name</label>
              <input
                className="form-input"
                type="text"
                placeholder={`Enter ${addLabel.replace('+ Add ', '')} name...`}
                value={addValue}
                onChange={e => { setAddValue(e.target.value); setAddError(''); }}
                onKeyDown={e => e.key === 'Enter' && handleAddSubmit()}
                autoFocus
              />

              {addError && (
                <div className="error-alert-box" style={{ marginTop: '0.75rem' }}>
                  <AlertCircle size={16} /> <span>{addError}</span>
                </div>
              )}
              {addSuccess && (
                <div className="success-alert-box" style={{ marginTop: '0.75rem' }}>
                  <CheckCircle2 size={16} /> <span>{addSuccess}</span>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowAddModal(false)}>Cancel</button>
              <button type="button" className="btn btn-primary btn-sm" onClick={handleAddSubmit}>
                <Plus size={16} /> Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * LocationPicker — Full India-wide State → District → Village → Area picker.
 */
export default function LocationPicker({
  state = '',
  district = '',
  village = '',
  area = '',
  onStateChange,
  onDistrictChange,
  onVillageChange,
  onAreaChange,
  allowAdd = true,
  required = true,
}) {
  const [stateList, setStateList] = useState(getAllStates());

  const refreshStates = () => setStateList(getAllStates());

  const districtList = getDistricts(state);
  const villageList = getVillages(state, district);

  const handleStateChange = (val) => {
    onStateChange(val);
    onDistrictChange('');
    onVillageChange('');
    onAreaChange('');
  };

  const handleDistrictChange = (val) => {
    onDistrictChange(val);
    onVillageChange('');
    onAreaChange('');
  };

  const handleVillageChange = (val) => {
    onVillageChange(val);
    onAreaChange('');
  };

  const handleAddState = (name) => {
    const result = addCustomState(name);
    if (result.success) {
      refreshStates();
      setTimeout(() => handleStateChange(name), 0);
    }
    return result;
  };

  const handleAddDistrict = (name) => {
    const result = addCustomDistrict(state, name);
    if (result.success) {
      refreshStates();
      setTimeout(() => handleDistrictChange(name), 0);
    }
    return result;
  };

  const handleAddVillage = (name) => {
    const result = addCustomVillage(state, district, name);
    if (result.success) {
      refreshStates();
      setTimeout(() => handleVillageChange(name), 0);
    }
    return result;
  };

  return (
    <div className="location-picker-grid">
      {/* STATE */}
      <SearchableDropdown
        label="State / Union Territory"
        options={stateList}
        value={state}
        onChange={handleStateChange}
        placeholder="Select State / UT"
        onAdd={allowAdd ? handleAddState : undefined}
        addLabel="+ Add State / Union Territory"
        required={required}
      />

      {/* DISTRICT */}
      <SearchableDropdown
        label="District"
        options={districtList}
        value={district}
        onChange={handleDistrictChange}
        placeholder="Select District"
        disabled={!state}
        disabledText="Select State first"
        onAdd={allowAdd && state ? handleAddDistrict : undefined}
        addLabel="+ Add District"
        required={required}
      />

      {/* VILLAGE */}
      <SearchableDropdown
        label="Village / Town"
        options={villageList}
        value={village}
        onChange={handleVillageChange}
        placeholder="Select Village"
        disabled={!district}
        disabledText="Select District first"
        onAdd={allowAdd && district ? handleAddVillage : undefined}
        addLabel="+ Add Village"
        required={required}
      />

      {/* AREA / STREET */}
      <div className="form-group">
        <label className="input-label-bold">
          Area / Street {required && <span style={{ color: '#f87171' }}>*</span>}
        </label>
        <input
          type="text"
          className="form-input"
          placeholder="Enter area or street name..."
          value={area}
          onChange={e => onAreaChange(e.target.value)}
        />
      </div>
    </div>
  );
}
