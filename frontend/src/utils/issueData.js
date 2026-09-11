// ============================================================
// VillageVision AI - Shared Issue Data & Persistence Engine
// Connected to Python Flask Backend & SQLite Database
// SINGLE SOURCE OF TRUTH: SQLite Database via Flask REST API
// ============================================================

import {
  apiGetIssues,
  apiCreateIssue,
  apiAdoptIssue,
  apiAddAfterPhoto,
  apiResolveIssue,
  apiGetMyReports,
  apiReverseGeocode
} from './api.js';

// Purge any legacy bloated localStorage keys to prevent QuotaExceededError
if (typeof window !== 'undefined') {
  [
    'villagevision_issues',
    'villagevision_issues_v2',
    'villagevision_issues_v3',
    'villagevision_issues_v4',
    'villagevision_issues_v5',
    'villagevision_issues_v6'
  ].forEach(k => {
    try {
      localStorage.removeItem(k);
    } catch (e) {
      // Safe ignore
    }
  });
}

// In-Memory Issues State (Single Source of Truth in memory synced from SQLite)
let memoryIssues = [];

// ============================================================
// ISSUE CATEGORIES
// ============================================================
export const ISSUE_CATEGORIES = [
  'Road Damage',
  'Water Leakage',
  'Broken Streetlight',
  'Garbage Overflow',
  'Drainage Problem',
  'Water Supply',
  'Electricity Problem',
  'Public Toilet',
  'School Infrastructure',
  'Healthcare Facility',
  'Transportation',
  'Internet / Network',
  'Street Safety',
  'Government Service',
  'Other'
];

// ============================================================
// UNIFIED LOCATION HIERARCHY (VISAKHAPATNAM ONLY)
// ============================================================
export const VISAKHAPATNAM_VILLAGES = [
  'Bheemunipatnam',
  'Anandapuram',
  'Padmanabham',
  'Pendurthi',
  'Sabbavaram',
  'Gajuwaka',
  'Visakhapatnam Rural',
  'Other'
];

export const LOCATION_HIERARCHY = {
  'Andhra Pradesh': {
    'Visakhapatnam': [
      'Bheemunipatnam',
      'Anandapuram',
      'Padmanabham',
      'Pendurthi',
      'Sabbavaram',
      'Gajuwaka',
      'Visakhapatnam Rural',
      'Other'
    ]
  }
};

export const INITIAL_DEMO_ISSUES = [];

// ============================================================
// NOTIFY REAL-TIME SUBSCRIBERS
// ============================================================
export const ISSUES_UPDATED_EVENT = 'villagevision_issues_updated';

export function notifyIssueUpdates(issues) {
  if (typeof window !== 'undefined') {
    try {
      window.dispatchEvent(new CustomEvent(ISSUES_UPDATED_EVENT, { detail: { issues: issues || memoryIssues } }));
    } catch (e) {
      console.warn('Failed to dispatch issues update event:', e);
    }
  }
}

// ============================================================
// FETCH ISSUES FROM FLASK BACKEND & SQLITE (SOURCE OF TRUTH)
// ============================================================
export async function fetchIssuesFromBackend() {
  try {
    const res = await apiGetIssues();
    if (res.success && Array.isArray(res.issues)) {
      memoryIssues = res.issues;
      notifyIssueUpdates(memoryIssues);
      return memoryIssues;
    }
  } catch (err) {
    console.warn('[VillageVision] Failed to fetch issues from Flask backend:', err);
  }
  return memoryIssues;
}

// Background initial sync
if (typeof window !== 'undefined') {
  setTimeout(() => {
    fetchIssuesFromBackend();
  }, 50);
}

// ============================================================
// GET STORED ISSUES (SYNC ACCESS FOR REACT RENDERING)
// ============================================================
export function getStoredIssues() {
  return memoryIssues;
}

// ============================================================
// MY REPORTS HELPERS (BACKEND + IN-MEMORY MATCHING)
// ============================================================
export async function fetchMyReportsFromBackend(user = {}) {
  try {
    const res = await apiGetMyReports(user);
    if (res.success && Array.isArray(res.issues)) {
      return res.issues;
    }
  } catch (err) {
    console.warn('[VillageVision] Failed to fetch personal reports from backend:', err);
  }
  return getMyReports(user);
}

export function getMyReports(user = {}, issuesList = null) {
  const all = Array.isArray(issuesList) ? issuesList : memoryIssues;
  if (!user || (!user.identifier && !user.email && !user.id && !user.fullName && !user.name)) {
    return [];
  }

  const ident = String(user.identifier || user.email || '').toLowerCase().trim();
  const email = String(user.email || user.identifier || '').toLowerCase().trim();
  const uid = String(user.id || '').toLowerCase().trim();
  const name = String(user.fullName || user.name || '').toLowerCase().trim();

  return all.filter(iss => {
    const issIdent = String(iss.reportedByIdentifier || iss.reportedByEmail || '').toLowerCase().trim();
    const issEmail = String(iss.reportedByEmail || iss.reportedByIdentifier || '').toLowerCase().trim();
    const issUid = String(iss.reportedByUserId || '').toLowerCase().trim();
    const issName = String(iss.reportedBy || '').toLowerCase().trim();

    if (ident && (issIdent === ident || issEmail === ident)) return true;
    if (email && (issEmail === email || issIdent === email)) return true;
    if (uid && issUid && (issUid === uid || issUid === `usr-${uid.replace('usr-', '')}`)) return true;
    if (name && issName && issName === name) {
      if (!issIdent && !ident) return true;
      if (issIdent === ident || issEmail === email) return true;
    }

    return false;
  });
}

export function isIssueAdoptedByNGO(issue, user = {}) {
  if (!issue || !issue.adopted || !user) return false;

  const uid = String(user.id || '').toLowerCase().trim();
  const ident = String(user.identifier || user.email || '').toLowerCase().trim();
  const email = String(user.email || user.identifier || '').toLowerCase().trim();
  const name = String(user.fullName || user.name || '').toLowerCase().trim();

  const issUid = String(issue.adoptedByUserId || '').toLowerCase().trim();
  const issName = String(issue.adoptedBy || issue.adoptedByName || issue.organization || '').toLowerCase().trim();

  // 1. Strict user ID match (e.g. USR-10 === USR-10 or 10 === 10)
  if (uid && issUid && (issUid === uid || issUid === `usr-${uid.replace('usr-', '')}` || uid === `usr-${issUid.replace('usr-', '')}`)) {
    return true;
  }

  // 2. Strict identifier / email match
  if (ident && issUid && (issUid === ident || issUid === email)) {
    return true;
  }
  if (email && issUid && (issUid === email || issUid === ident)) {
    return true;
  }

  // 3. Match on name only when no conflicting user ID is recorded
  if (name && issName && issName === name) {
    if (!issUid || (uid && (issUid === uid || issUid === `usr-${uid.replace('usr-', '')}`)) || (ident && issUid === ident)) {
      return true;
    }
  }

  return false;
}

export function getMyAdoptedIssues(user = {}, issuesList = null) {
  const all = Array.isArray(issuesList) ? issuesList : memoryIssues;
  if (!user || (!user.id && !user.identifier && !user.email && !user.fullName && !user.name)) {
    return [];
  }
  return all.filter(issue => isIssueAdoptedByNGO(issue, user));
}

// ============================================================
// SAVE NEW ISSUE (Saves to Flask & SQLite)
// ============================================================
export async function saveIssue(newIssueData = {}) {
  const payload = {
    category: newIssueData.category || 'Road Damage',
    description: newIssueData.description || '',
    photo: newIssueData.photo || null,
    state: newIssueData.state || 'Andhra Pradesh',
    district: newIssueData.district || 'Visakhapatnam',
    village: newIssueData.village || 'Bheemunipatnam',
    area: newIssueData.area || 'Main Road',
    pincode: String(newIssueData.pincode || '531163').trim(),
    latitude: Number.isFinite(parseFloat(newIssueData.latitude)) ? parseFloat(newIssueData.latitude) : 17.8912,
    longitude: Number.isFinite(parseFloat(newIssueData.longitude)) ? parseFloat(newIssueData.longitude) : 83.4542,
    priority: newIssueData.priority || 'Medium',
    reportedBy: newIssueData.reportedBy || 'Authenticated Citizen',
    reportedByUserId: newIssueData.reportedByUserId || '',
    reportedByIdentifier: newIssueData.reportedByIdentifier || newIssueData.reportedByEmail || '',
    reportedByEmail: newIssueData.reportedByEmail || newIssueData.reportedByIdentifier || '',
    reportedByRole: newIssueData.reportedByRole || 'Citizen'
  };

  // Call Flask API (Single Source of Truth)
  const apiRes = await apiCreateIssue(payload);

  if (apiRes.success && apiRes.issue) {
    const newRecord = apiRes.issue;
    memoryIssues = [newRecord, ...memoryIssues.filter(i => i.id !== newRecord.id)];
    notifyIssueUpdates(memoryIssues);
    return newRecord;
  }

  // Fallback if offline
  const maxId = memoryIssues.reduce((max, item) => {
    const number = parseInt(String(item.id || '').replace('VV-', ''), 10);
    return Number.isNaN(number) ? max : Math.max(max, number);
  }, 1000);

  const now = new Date();
  const fallbackRecord = {
    ...payload,
    id: `VV-${maxId + 1}`,
    status: 'Open',
    date: now.toISOString().split('T')[0],
    time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
    adopted: false,
    resolved: false
  };

  memoryIssues = [fallbackRecord, ...memoryIssues];
  notifyIssueUpdates(memoryIssues);
  return fallbackRecord;
}

// ============================================================
// SUBSCRIBE TO REAL-TIME & CROSS-TAB UPDATES
// ============================================================
export function subscribeToIssueUpdates(callback) {
  if (typeof window === 'undefined' || typeof callback !== 'function') {
    return () => {};
  }

  // Trigger background sync from backend
  fetchIssuesFromBackend().then(latest => {
    if (latest && Array.isArray(latest)) callback(latest);
  }).catch(() => {});

  const handleCustomEvent = (e) => {
    if (e?.detail?.issues) {
      callback(e.detail.issues);
    } else {
      callback(memoryIssues);
    }
  };

  window.addEventListener(ISSUES_UPDATED_EVENT, handleCustomEvent);

  return () => {
    window.removeEventListener(ISSUES_UPDATED_EVENT, handleCustomEvent);
  };
}

// ============================================================
// ATOMIC ISSUE ADOPTION (ANTI-DUPLICATE LOCK via Flask & SQLite)
// ============================================================
export async function adoptIssue(issueId, adopterUser = {}) {
  const apiRes = await apiAdoptIssue(issueId, adopterUser);

  if (!apiRes.success) {
    return {
      success: false,
      error: apiRes.error || 'Failed to adopt issue.',
      issue: apiRes.data?.issue
    };
  }

  const updatedIssue = apiRes.issue;
  memoryIssues = memoryIssues.map(item => item.id === issueId ? updatedIssue : item);
  notifyIssueUpdates(memoryIssues);

  return {
    success: true,
    issue: updatedIssue,
    issues: memoryIssues
  };
}

// ============================================================
// ADD / UPDATE AFTER-SOLUTION PHOTO TO ADOPTED ISSUE
// ============================================================
export async function addAfterPhoto(issueId, afterPhoto, { solutionDescription = '', updatedByUser = {} } = {}) {
  if (!afterPhoto || typeof afterPhoto !== 'string' || !afterPhoto.trim()) {
    return {
      success: false,
      error: 'Please select or upload a valid after-solution photo.'
    };
  }

  const apiRes = await apiAddAfterPhoto(issueId, afterPhoto, {
    solutionDescription,
    updatedByUser
  });

  if (!apiRes.success) {
    return {
      success: false,
      error: apiRes.error || 'Failed to save after-solution photo.'
    };
  }

  const updatedIssue = apiRes.issue;
  memoryIssues = memoryIssues.map(item => item.id === issueId ? updatedIssue : item);
  notifyIssueUpdates(memoryIssues);

  return {
    success: true,
    issue: updatedIssue,
    issues: memoryIssues
  };
}

// ============================================================
// RESOLVE ISSUE WITH MANDATORY AFTER-SOLUTION PHOTO
// ============================================================
export async function resolveIssue(issueId, { solutionPhoto, solutionDescription = '', resolvedByUser = {} } = {}) {
  const apiRes = await apiResolveIssue(issueId, {
    solutionPhoto,
    solutionDescription,
    resolvedByUser
  });

  if (!apiRes.success) {
    return {
      success: false,
      error: apiRes.error || 'Failed to mark issue as resolved.'
    };
  }

  const updatedIssue = apiRes.issue;
  memoryIssues = memoryIssues.map(item => item.id === issueId ? updatedIssue : item);
  notifyIssueUpdates(memoryIssues);

  return {
    success: true,
    issue: updatedIssue,
    issues: memoryIssues
  };
}

// ============================================================
// UPDATE ISSUE STATUS
// ============================================================
export function updateIssueStatus(id, newStatus, metadata = {}) {
  memoryIssues = memoryIssues.map(item => {
    if (item.id === id) {
      const updatedItem = {
        ...item,
        status: newStatus,
        updatedAt: new Date().toISOString().split('T')[0]
      };
      if (typeof metadata === 'string') {
        updatedItem.assignedDept = metadata;
      } else if (metadata && typeof metadata === 'object') {
        if (metadata.assignedDept) updatedItem.assignedDept = metadata.assignedDept;
        if (metadata.resolutionNote) updatedItem.resolutionNote = metadata.resolutionNote;
        if (metadata.assignedTo) updatedItem.assignedTo = metadata.assignedTo;
        if (metadata.slaDays) updatedItem.slaDays = metadata.slaDays;
        if (metadata.rejectionReason) updatedItem.rejectionReason = metadata.rejectionReason;
      }
      return updatedItem;
    }
    return item;
  });

  notifyIssueUpdates(memoryIssues);
  return memoryIssues;
}

// ============================================================
// FILTER ISSUES (VILLAGE, SEARCH, PINCODE)
// ============================================================
export function filterIssues(issues, filters = {}) {
  if (!Array.isArray(issues)) return [];

  const {
    village = '',
    pincode = '',
    search = ''
  } = filters;

  return issues.filter(issue => {
    if (village && village !== 'All Villages / Areas' && village !== 'All' && issue.village !== village) {
      return false;
    }

    if (pincode && pincode.trim().length === 6) {
      if ((issue.pincode || '').trim() !== pincode.trim()) {
        return false;
      }
    }

    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      const match =
        (issue.id || '').toLowerCase().includes(q) ||
        (issue.category || '').toLowerCase().includes(q) ||
        (issue.description || '').toLowerCase().includes(q) ||
        (issue.village || '').toLowerCase().includes(q) ||
        (issue.area || '').toLowerCase().includes(q) ||
        (issue.pincode || '').toLowerCase().includes(q) ||
        (issue.reportedBy || '').toLowerCase().includes(q);

      if (!match) return false;
    }

    return true;
  });
}

// ============================================================
// LOCATION QUERY HELPERS (VISAKHAPATNAM ONLY)
// ============================================================
export function getAllStates() {
  return ['Andhra Pradesh'];
}

export function getDistricts(state) {
  return ['Visakhapatnam'];
}

export function getVillages(state, district) {
  return [...VISAKHAPATNAM_VILLAGES];
}
