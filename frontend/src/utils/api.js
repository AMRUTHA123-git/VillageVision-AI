/**
 * VillageVision AI — Flask Backend API Client
 * Dynamically resolves API base for both Local Development and Production (Vercel)
 */

const getApiBase = () => {
  // 1. Explicit Vite environment variable (configured in Vercel / .env)
  const envUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE;
  if (envUrl && typeof envUrl === 'string') {
    const trimmed = envUrl.trim().replace(/\/+$/, '');
    return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
  }

  // 2. Production build without explicit environment variable:
  // Use relative '/api' which routes seamlessly on the same origin (Vercel serverless / rewrites)
  if (import.meta.env.PROD) {
    return '/api';
  }

  // 3. Local Development fallback:
  return 'http://127.0.0.1:5000/api';
};

const API_BASE = getApiBase();

/**
 * Universal JSON Fetch Helper with error parsing and timeout protection
 */
async function request(endpoint, options = {}) {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${API_BASE}${cleanEndpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers
    });

    const contentType = response.headers.get('content-type');
    let data;
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      const errorMsg = (data && typeof data === 'object' && (data.error || data.message))
        ? (data.error || data.message)
        : `Request failed with status ${response.status}`;
      return {
        success: false,
        status: response.status,
        error: errorMsg,
        data
      };
    }

    return {
      success: true,
      status: response.status,
      data
    };
  } catch (err) {
    console.warn(`[VillageVision API] Network error connecting to ${url}:`, err.message);
    return {
      success: false,
      error: `Could not connect to backend API at ${API_BASE}. Please ensure the backend service is running and accessible.`,
      networkError: true
    };
  }
}

// =========================================================================
// HEALTH & AUTHENTICATION API METHODS
// =========================================================================

export async function apiHealthCheck() {
  return await request('/health', { method: 'GET' });
}

export async function apiLogin({ fullName, identifier, email, password, role }) {
  const payload = {
    fullName: fullName || '',
    identifier: identifier || email || '',
    password: password || '',
    role: role || 'Citizen'
  };

  const res = await request('/login', {
    method: 'POST',
    body: JSON.stringify(payload)
  });

  if (!res.success) {
    return {
      success: false,
      error: res.error || 'Login failed. Please check your credentials.'
    };
  }

  return {
    success: true,
    message: res.data?.message || 'Login successful',
    user: res.data?.user
  };
}

export async function apiSignUp({ fullName, email, mobileNumber = '', password, role = 'Citizen' }) {
  const payload = {
    fullName,
    email,
    mobileNumber,
    password,
    role
  };

  const res = await request('/signup', {
    method: 'POST',
    body: JSON.stringify(payload)
  });

  if (!res.success) {
    return {
      success: false,
      error: res.error || 'Registration failed.'
    };
  }

  return {
    success: true,
    message: res.data?.message || 'Account created successfully',
    user: res.data?.user
  };
}

export async function apiDeleteAccount(identifier) {
  const res = await request('/delete-account', {
    method: 'POST',
    body: JSON.stringify({ identifier })
  });

  return res.success ? { success: true, message: res.data?.message } : { success: false, error: res.error };
}

// =========================================================================
// ISSUE MANAGEMENT API METHODS
// =========================================================================

export async function apiGetIssues() {
  const res = await request('/issues', { method: 'GET' });
  if (res.success && Array.isArray(res.data)) {
    return {
      success: true,
      issues: res.data
    };
  }
  return {
    success: false,
    error: res.error,
    issues: []
  };
}

export async function apiCreateIssue(issueData) {
  const res = await request('/issues', {
    method: 'POST',
    body: JSON.stringify(issueData)
  });

  if (res.success && res.data?.issue) {
    return {
      success: true,
      message: res.data.message,
      issue: res.data.issue
    };
  }

  return {
    success: false,
    error: res.error || 'Failed to submit issue.'
  };
}

export async function apiAdoptIssue(issueId, adopterUser = {}) {
  const payload = {
    adoptedBy: (adopterUser?.fullName || adopterUser?.name || 'NGO / Volunteer Organization').trim(),
    adoptedByUserId: adopterUser?.id || adopterUser?.email || adopterUser?.identifier || '',
    adoptedByRole: adopterUser?.role || 'NGO / Volunteer'
  };

  const res = await request(`/issues/${issueId}/adopt`, {
    method: 'POST',
    body: JSON.stringify(payload)
  });

  if (res.success && res.data?.issue) {
    return {
      success: true,
      message: res.data.message,
      issue: res.data.issue
    };
  }

  return {
    success: false,
    error: res.error || 'Failed to adopt issue.'
  };
}

export async function apiAddAfterPhoto(issueId, afterPhoto, { solutionDescription = '', updatedByUser = {} } = {}) {
  const payload = {
    afterPhoto,
    solutionDescription,
    updatedBy: updatedByUser?.fullName || updatedByUser?.name || 'NGO / Volunteer'
  };

  const res = await request(`/issues/${issueId}/after-photo`, {
    method: 'POST',
    body: JSON.stringify(payload)
  });

  if (res.success && res.data?.issue) {
    return {
      success: true,
      message: res.data.message,
      issue: res.data.issue
    };
  }

  return {
    success: false,
    error: res.error || 'Failed to upload after-solution photo.'
  };
}

export async function apiResolveIssue(issueId, { solutionPhoto, solutionDescription = '', resolvedByUser = {} } = {}) {
  const payload = {
    solutionPhoto,
    afterPhoto: solutionPhoto,
    solutionDescription,
    resolvedBy: (resolvedByUser?.fullName || resolvedByUser?.name || 'NGO / Volunteer Organization').trim(),
    resolvedByUserId: resolvedByUser?.id || resolvedByUser?.email || resolvedByUser?.identifier || '',
    resolvedByRole: resolvedByUser?.role || 'NGO / Volunteer'
  };

  const res = await request(`/issues/${issueId}/resolve`, {
    method: 'POST',
    body: JSON.stringify(payload)
  });

  if (res.success && res.data?.issue) {
    return {
      success: true,
      message: res.data.message,
      issue: res.data.issue
    };
  }

  return {
    success: false,
    error: res.error || 'Failed to mark issue as resolved.'
  };
}

export async function apiGetMyReports(user = {}) {
  const identifier = user?.identifier || user?.email || '';
  const email = user?.email || user?.identifier || '';
  const userId = user?.id || '';
  const fullName = user?.fullName || user?.name || '';

  const params = new URLSearchParams();
  if (identifier) params.append('identifier', identifier);
  if (email) params.append('email', email);
  if (userId) params.append('userId', userId);
  if (fullName) params.append('fullName', fullName);

  const res = await request(`/issues/my-reports?${params.toString()}`, { method: 'GET' });
  if (res.success && Array.isArray(res.data)) {
    return {
      success: true,
      issues: res.data
    };
  }
  return {
    success: false,
    error: res.error || 'Failed to fetch personal reports.',
    issues: []
  };
}

export async function apiReverseGeocode(lat, lon) {
  const res = await request(`/reverse-geocode?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}`, {
    method: 'GET'
  });

  if (res.success && res.data) {
    return {
      success: true,
      data: res.data
    };
  }

  return {
    success: false,
    error: res.error || 'Reverse geocoding failed.'
  };
}

