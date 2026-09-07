/**
 * VillageVision AI — Location Manager (Visakhapatnam Scope)
 */

import { VISAKHAPATNAM_VILLAGES, getAllStates, getDistricts, getVillages, LOCATION_HIERARCHY } from './issueData';

const CUSTOM_KEY = 'villagevision_custom_villages';

export function loadCustomVillages() {
  try {
    const raw = localStorage.getItem(CUSTOM_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCustomVillages(list) {
  localStorage.setItem(CUSTOM_KEY, JSON.stringify(list));
}

export function getAllVillagesList() {
  const custom = loadCustomVillages();
  const all = [...VISAKHAPATNAM_VILLAGES];
  custom.forEach(v => {
    if (!all.includes(v)) {
      all.push(v);
    }
  });
  return all;
}

export function addCustomVillage(state, district, villageName) {
  const trimmed = (villageName || '').trim();
  if (!trimmed) {
    return { success: false, message: 'Village name cannot be empty.' };
  }
  const all = getAllVillagesList();
  if (all.some(v => v.toLowerCase() === trimmed.toLowerCase())) {
    return { success: false, message: 'This village is already listed.' };
  }
  const custom = loadCustomVillages();
  custom.push(trimmed);
  saveCustomVillages(custom);
  return { success: true, message: `"${trimmed}" added successfully.` };
}

export { getAllStates, getDistricts, getVillages, LOCATION_HIERARCHY, VISAKHAPATNAM_VILLAGES };
