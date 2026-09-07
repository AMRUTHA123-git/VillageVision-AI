// ============================================================
// VillageVision AI - Shared Issue Data & Persistence Engine
// ============================================================

const STORAGE_KEY = 'villagevision_issues_v2';

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

// ============================================================
// INITIAL DEMO ISSUES (VISAKHAPATNAM LOCALITIES WITH PINCODES & TIME)
// ============================================================
export const INITIAL_DEMO_ISSUES = [
  {
    id: 'VV-1042',
    category: 'Road Damage',
    description: 'Severe potholes reported near the main road causing vehicular hazard and traffic delays.',
    photo: null,
    state: 'Andhra Pradesh',
    district: 'Visakhapatnam',
    village: 'Bheemunipatnam',
    area: 'Main Road',
    pincode: '531163',
    latitude: 17.8912,
    longitude: 83.4542,
    priority: 'High',
    status: 'Open',
    reportedBy: 'Ramesh Sharma',
    reportedByRole: 'Citizen',
    date: '2026-08-18',
    time: '10:30 AM'
  },
  {
    id: 'VV-1043',
    category: 'Water Leakage',
    description: 'Main clean water pipeline leaking onto public walkway near Sector 3 center.',
    photo: null,
    state: 'Andhra Pradesh',
    district: 'Visakhapatnam',
    village: 'Anandapuram',
    area: 'Village Center',
    pincode: '530052',
    latitude: 17.9150,
    longitude: 83.3980,
    priority: 'High',
    status: 'In Progress',
    reportedBy: 'Seva Foundation',
    reportedByRole: 'NGO / Volunteer',
    date: '2026-08-19',
    time: '02:15 PM'
  },
  {
    id: 'VV-1039',
    category: 'Broken Streetlight',
    description: 'Dark street corner due to non-functioning LED streetlight fixture near evening bus stop.',
    photo: null,
    state: 'Andhra Pradesh',
    district: 'Visakhapatnam',
    village: 'Pendurthi',
    area: 'Market Road',
    pincode: '531173',
    latitude: 17.8315,
    longitude: 83.2005,
    priority: 'Medium',
    status: 'Open',
    reportedBy: 'Suresh Rao',
    reportedByRole: 'Volunteer',
    date: '2026-08-17',
    time: '07:45 PM'
  },
  {
    id: 'VV-1028',
    category: 'Garbage Overflow',
    description: 'Unattended municipal waste bin overflowing and attracting pests in commercial zone.',
    photo: null,
    state: 'Andhra Pradesh',
    district: 'Visakhapatnam',
    village: 'Gajuwaka',
    area: 'Main Road',
    pincode: '530026',
    latitude: 17.6904,
    longitude: 83.2185,
    priority: 'Medium',
    status: 'Verified',
    reportedBy: 'Green Earth Foundation',
    reportedByRole: 'NGO / Volunteer',
    date: '2026-08-15',
    time: '11:20 AM'
  },
  {
    id: 'VV-1015',
    category: 'Drainage Problem',
    description: 'Clogged storm drain backing up water onto pedestrian pathway during heavy rains.',
    photo: null,
    state: 'Andhra Pradesh',
    district: 'Visakhapatnam',
    village: 'Sabbavaram',
    area: 'Temple Road',
    pincode: '531035',
    latitude: 17.8010,
    longitude: 83.1320,
    priority: 'High',
    status: 'Assigned',
    reportedBy: 'Kiran Sarma',
    reportedByRole: 'Citizen',
    date: '2026-08-12',
    time: '04:10 PM'
  },
  {
    id: 'VV-1012',
    category: 'Healthcare Facility',
    description: 'Village healthcare center requires medicine restocking and first-aid support.',
    photo: null,
    state: 'Andhra Pradesh',
    district: 'Visakhapatnam',
    village: 'Padmanabham',
    area: 'Village Square',
    pincode: '531219',
    latitude: 17.9860,
    longitude: 83.3340,
    priority: 'High',
    status: 'Open',
    reportedBy: 'Ananya Rao',
    reportedByRole: 'Citizen',
    date: '2026-08-10',
    time: '09:05 AM'
  },
  {
    id: 'VV-1008',
    category: 'Transportation',
    description: 'Feeder bus route frequency needed during morning and evening rush hours.',
    photo: null,
    state: 'Andhra Pradesh',
    district: 'Visakhapatnam',
    village: 'Visakhapatnam Rural',
    area: 'Highway Junction',
    pincode: '530045',
    latitude: 17.7500,
    longitude: 83.2800,
    priority: 'Low',
    status: 'Open',
    reportedBy: 'Ramesh Sharma',
    reportedByRole: 'Citizen',
    date: '2026-08-08',
    time: '06:30 PM'
  }
];

// ============================================================
// GET STORED ISSUES
// ============================================================
export function getStoredIssues() {
  const defaultTimes = ['10:30 AM', '02:15 PM', '07:45 PM', '11:20 AM', '04:10 PM', '09:05 AM', '06:30 PM', '01:45 PM'];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Ensure every issue has date and distinct time
        const withTimes = parsed.map((item, idx) => {
          if (!item.time) {
            return {
              ...item,
              time: defaultTimes[idx % defaultTimes.length]
            };
          }
          return item;
        });
        return withTimes;
      }
    }
  } catch (error) {
    console.error('Failed to parse stored issues:', error);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DEMO_ISSUES));
  return INITIAL_DEMO_ISSUES;
}

// ============================================================
// SAVE NEW ISSUE
// ============================================================
export function saveIssue(newIssueData = {}) {
  const existing = getStoredIssues();

  // Generate safe unique issue ID
  const maxId = existing.reduce((max, item) => {
    const number = parseInt(String(item.id || '').replace('VV-', ''), 10);
    return Number.isNaN(number) ? max : Math.max(max, number);
  }, 1044);

  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

  const newRecord = {
    id: `VV-${maxId + 1}`,
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
    status: 'Open',
    reportedBy: newIssueData.reportedBy || 'Authenticated User',
    reportedByRole: newIssueData.reportedByRole || 'Citizen',
    date: newIssueData.date || dateStr,
    time: newIssueData.time || timeStr
  };

  const updated = [newRecord, ...existing];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save issue to localStorage:', e);
  }

  notifyIssueUpdates(updated);
  return newRecord;
}

// ============================================================
// NOTIFY REAL-TIME SUBSCRIBERS
// ============================================================
export const ISSUES_UPDATED_EVENT = 'villagevision_issues_updated';

export function notifyIssueUpdates(issues) {
  if (typeof window !== 'undefined') {
    try {
      window.dispatchEvent(new CustomEvent(ISSUES_UPDATED_EVENT, { detail: { issues } }));
    } catch (e) {
      console.error('Failed to dispatch issues update event:', e);
    }
  }
}

// ============================================================
// SUBSCRIBE TO REAL-TIME & CROSS-TAB UPDATES
// ============================================================
export function subscribeToIssueUpdates(callback) {
  if (typeof window === 'undefined' || typeof callback !== 'function') {
    return () => {};
  }

  const handleCustomEvent = (e) => {
    if (e?.detail?.issues) {
      callback(e.detail.issues);
    } else {
      callback(getStoredIssues());
    }
  };

  const handleStorageEvent = (e) => {
    if (e.key === STORAGE_KEY) {
      callback(getStoredIssues());
    }
  };

  window.addEventListener(ISSUES_UPDATED_EVENT, handleCustomEvent);
  window.addEventListener('storage', handleStorageEvent);

  return () => {
    window.removeEventListener(ISSUES_UPDATED_EVENT, handleCustomEvent);
    window.removeEventListener('storage', handleStorageEvent);
  };
}

// ============================================================
// ATOMIC ISSUE ADOPTION (ANTI-DUPLICATE LOCK)
// ============================================================
export function adoptIssue(issueId, adopterUser = {}) {
  const issues = getStoredIssues();
  const target = issues.find(item => item.id === issueId);

  if (!target) {
    return {
      success: false,
      error: 'Issue not found.'
    };
  }

  // ATOMIC CHECK: If already adopted, reject second adoption
  if (target.adopted === true) {
    return {
      success: false,
      error: `This issue is already adopted by ${target.adoptedBy || 'another organization'}.`,
      issue: target
    };
  }

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  const adoptedAtStr = `${dateStr}, ${timeStr}`;

  const adopterName = (adopterUser?.fullName || adopterUser?.name || 'NGO / Volunteer Organization').trim();
  const adopterRole = adopterUser?.role || 'NGO / Volunteer';
  const adopterId = adopterUser?.id || adopterUser?.email || '';

  let updatedIssue = null;
  const updated = issues.map(item => {
    if (item.id === issueId) {
      updatedIssue = {
        ...item,
        adopted: true,
        adoptedBy: adopterName,
        adoptedByUserId: adopterId,
        adoptedByRole: adopterRole,
        adoptedDate: dateStr,
        adoptedTime: timeStr,
        adoptedAt: adoptedAtStr,
        status: 'Adopted'
      };
      return updatedIssue;
    }
    return item;
  });

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save adopted issue to localStorage:', e);
  }

  notifyIssueUpdates(updated);

  return {
    success: true,
    issue: updatedIssue,
    issues: updated
  };
}

// ============================================================
// UPDATE ISSUE STATUS
// ============================================================
export function updateIssueStatus(id, newStatus, metadata = {}) {
  const issues = getStoredIssues();
  const updated = issues.map(item => {
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

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to update issue status in localStorage:', e);
  }

  notifyIssueUpdates(updated);
  return updated;
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
    // 1. Village / Area filter
    if (village && village !== 'All Villages / Areas' && village !== 'All' && issue.village !== village) {
      return false;
    }

    // 2. Exact Pincode filter if valid 6-digit entered
    if (pincode && pincode.trim().length === 6) {
      if ((issue.pincode || '').trim() !== pincode.trim()) {
        return false;
      }
    }

    // 3. Search query (matches Category, Description, Village, Area, ID, Pincode)
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