/**
 * VillageVision AI — Custom Location Manager
 *
 * Handles user-added States, Districts, Villages, and Areas
 * stored in localStorage under key: villagevision_custom_locations
 *
 * Custom locations are MERGED with the master India location dataset at runtime.
 * The master dataset is never modified.
 */

import INDIA_LOCATIONS from '../data/indiaLocations.js';

const CUSTOM_KEY = 'villagevision_custom_locations';

// Load custom locations from localStorage
export function loadCustomLocations() {
  try {
    const raw = localStorage.getItem(CUSTOM_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

// Save custom locations to localStorage
function saveCustomLocations(data) {
  localStorage.setItem(CUSTOM_KEY, JSON.stringify(data));
}

/**
 * Get merged location hierarchy (master + custom).
 * Returns: { [state]: { [district]: [village1, village2, ...] } }
 */
export function getMergedLocations() {
  const custom = loadCustomLocations();
  const merged = {};

  // Deep copy master dataset
  for (const [state, districts] of Object.entries(INDIA_LOCATIONS)) {
    merged[state] = {};
    for (const [district, villages] of Object.entries(districts)) {
      merged[state][district] = [...villages];
    }
  }

  // Merge custom
  for (const [state, districts] of Object.entries(custom)) {
    if (!merged[state]) merged[state] = {};
    for (const [district, villages] of Object.entries(districts)) {
      if (!merged[state][district]) {
        merged[state][district] = [...villages];
      } else {
        // Add custom villages that aren't already present (case-insensitive)
        for (const village of villages) {
          const exists = merged[state][district].some(
            v => v.trim().toLowerCase() === village.trim().toLowerCase()
          );
          if (!exists) merged[state][district].push(village);
        }
      }
    }
  }

  return merged;
}

// Get sorted list of all states
export function getAllStates() {
  const merged = getMergedLocations();
  return Object.keys(merged).sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' }));
}

// Get sorted districts for a state
export function getDistricts(state) {
  if (!state) return [];
  const merged = getMergedLocations();
  if (!merged[state]) return [];
  return Object.keys(merged[state]).sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' }));
}

// Get sorted villages for state+district
export function getVillages(state, district) {
  if (!state || !district) return [];
  const merged = getMergedLocations();
  if (!merged[state] || !merged[state][district]) return [];
  const villages = [...merged[state][district]];
  return villages.sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' }));
}

// ── ADD NEW LOCATIONS ────────────────────────────────────────────────────────

export function addCustomState(stateName) {
  const trimmed = stateName.trim();
  if (!trimmed) return { success: false, message: 'State name cannot be empty.' };

  const all = getAllStates();
  const duplicate = all.find(s => s.trim().toLowerCase() === trimmed.toLowerCase());
  if (duplicate) return { success: false, message: 'This state/UT already exists.' };

  const custom = loadCustomLocations();
  custom[trimmed] = {};
  saveCustomLocations(custom);
  return { success: true };
}

export function addCustomDistrict(state, districtName) {
  const trimmed = districtName.trim();
  if (!trimmed) return { success: false, message: 'District name cannot be empty.' };
  if (!state) return { success: false, message: 'Please select a state first.' };

  const existing = getDistricts(state);
  const duplicate = existing.find(d => d.trim().toLowerCase() === trimmed.toLowerCase());
  if (duplicate) return { success: false, message: 'This district already exists in the selected state.' };

  const custom = loadCustomLocations();
  if (!custom[state]) custom[state] = {};
  if (!custom[state][trimmed]) custom[state][trimmed] = [];
  saveCustomLocations(custom);
  return { success: true };
}

export function addCustomVillage(state, district, villageName) {
  const trimmed = villageName.trim();
  if (!trimmed) return { success: false, message: 'Village name cannot be empty.' };
  if (!state) return { success: false, message: 'Please select a state first.' };
  if (!district) return { success: false, message: 'Please select a district first.' };

  const existing = getVillages(state, district);
  const duplicate = existing.find(v => v.trim().toLowerCase() === trimmed.toLowerCase());
  if (duplicate) return { success: false, message: 'This village already exists in the selected district.' };

  const custom = loadCustomLocations();
  if (!custom[state]) custom[state] = {};
  if (!custom[state][district]) custom[state][district] = [];
  custom[state][district].push(trimmed);
  saveCustomLocations(custom);
  return { success: true };
}
