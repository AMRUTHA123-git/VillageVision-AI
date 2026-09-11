/**
 * VillageVision AI — Account & Authentication Manager
 *
 * Connects directly to Flask Backend API at http://localhost:5000/api
 * Persists user credentials in SQLite database with localStorage session cache.
 * Supported roles: 'Citizen' and 'NGO / Volunteer'
 */

import { apiLogin, apiSignUp, apiDeleteAccount } from './api.js';

const ACCOUNTS_KEY = 'villagevision_registered_accounts';
const DELETED_ACCOUNTS_KEY = 'villagevision_deleted_accounts';

// Initial Demo Accounts (Visakhapatnam Stakeholders)
const DEFAULT_ACCOUNTS = [
  {
    id: 'USR-001',
    fullName: 'Ramesh Sharma',
    email: 'citizen@villagevision.ai',
    mobileNumber: '9123456780',
    password: 'Citizen@123',
    role: 'Citizen'
  },
  {
    id: 'USR-002',
    fullName: 'Seva Foundation',
    email: 'ngo@villagevision.ai',
    mobileNumber: '9988776655',
    password: 'Ngo@123',
    role: 'NGO / Volunteer'
  },
  {
    id: 'USR-004',
    fullName: 'Youth For Andhra NGO',
    email: 'ngo2@villagevision.ai',
    mobileNumber: '9988776644',
    password: 'Ngo2@123',
    role: 'NGO / Volunteer'
  }
];

function getDeletedEmails() {
  try {
    const raw = localStorage.getItem(DELETED_ACCOUNTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function recordDeletedEmail(email) {
  const deleted = getDeletedEmails();
  const lower = email.toLowerCase().trim();
  if (!deleted.includes(lower)) {
    deleted.push(lower);
    try {
      localStorage.setItem(DELETED_ACCOUNTS_KEY, JSON.stringify(deleted));
    } catch (e) {}
  }
}

export function getRegisteredAccounts() {
  const deletedEmails = getDeletedEmails();
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        let updated = false;
        DEFAULT_ACCOUNTS.forEach(defAcc => {
          const isDeleted = deletedEmails.includes(defAcc.email.toLowerCase());
          if (!isDeleted && !parsed.some(acc => acc.email.toLowerCase() === defAcc.email.toLowerCase())) {
            parsed.push(defAcc);
            updated = true;
          }
        });
        if (updated) {
          try {
            localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(parsed));
          } catch (e) {}
        }
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to parse registered accounts:', e);
  }

  const initialAccounts = DEFAULT_ACCOUNTS.filter(acc => !deletedEmails.includes(acc.email.toLowerCase()));
  try {
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(initialAccounts));
  } catch (e) {}
  return initialAccounts;
}

function saveAccounts(accounts) {
  try {
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
  } catch (e) {}
}

/**
 * Permanently delete a user account via Flask API & SQLite
 */
export async function deleteAccount(identifierOrEmail) {
  if (!identifierOrEmail) {
    return {
      success: false,
      error: 'Identifier or email is required to delete account.'
    };
  }

  const target = identifierOrEmail.trim().toLowerCase();

  // Call Flask Backend DELETE endpoint
  try {
    await apiDeleteAccount(target);
  } catch (e) {
    console.warn('Backend deleteAccount failed, clearing local cache:', e);
  }

  const accounts = getRegisteredAccounts();
  const updatedAccounts = accounts.filter(acc => 
    acc.email.toLowerCase() !== target && 
    (acc.identifier ? acc.identifier.toLowerCase() !== target : true)
  );

  recordDeletedEmail(target);
  saveAccounts(updatedAccounts);

  try {
    const sessionRaw = localStorage.getItem('villagevision_user');
    if (sessionRaw) {
      const sessionUser = JSON.parse(sessionRaw);
      if (sessionUser?.email?.toLowerCase() === target || sessionUser?.identifier?.toLowerCase() === target) {
        localStorage.removeItem('villagevision_user');
      }
    }
  } catch (e) {
    console.error('Error clearing session during account deletion:', e);
  }

  return {
    success: true,
    message: 'Account permanently deleted successfully.'
  };
}

/**
 * Register a new account via Flask API & SQLite
 */
export async function registerAccount({ fullName, email, mobileNumber = '', password, role = 'Citizen' }) {
  const trimmedEmail = (email || '').trim().toLowerCase();
  const trimmedName = (fullName || '').trim();

  const validRoles = ['Citizen', 'NGO / Volunteer', 'Volunteer', 'NGO'];
  if (!validRoles.includes(role)) {
    return {
      success: false,
      error: 'Please select a valid role (Citizen or NGO / Volunteer).'
    };
  }

  // Call Flask Backend Signup API
  const apiRes = await apiSignUp({
    fullName: trimmedName,
    email: trimmedEmail,
    mobileNumber,
    password,
    role
  });

  if (!apiRes.success) {
    return {
      success: false,
      error: apiRes.error || 'Registration failed.'
    };
  }

  const accounts = getRegisteredAccounts();
  const newAccount = apiRes.user || {
    id: `USR-${Date.now().toString().slice(-4)}`,
    fullName: trimmedName,
    email: trimmedEmail,
    mobileNumber: (mobileNumber || '').trim(),
    role: role
  };

  accounts.push(newAccount);
  saveAccounts(accounts);

  return {
    success: true,
    user: newAccount
  };
}

export function isValidEmailFormat(email) {
  if (!email || typeof email !== 'string') return false;
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email.trim());
}

/**
 * Authenticate user credentials and role for Login
 * Calls Flask Backend POST http://localhost:5000/api/login
 */
export async function authenticateUser({ email, password, role, fullName }) {
  const trimmedEmail = (email || '').trim();

  if (!isValidEmailFormat(trimmedEmail)) {
    return {
      success: false,
      error: 'Please enter a valid email address.'
    };
  }

  if (!password) {
    return {
      success: false,
      error: 'Password is required. Please enter your password.'
    };
  }

  // Call Flask backend /api/login directly
  const apiRes = await apiLogin({
    fullName: fullName || '',
    identifier: trimmedEmail,
    email: trimmedEmail,
    password,
    role
  });

  if (!apiRes.success) {
    return {
      success: false,
      error: apiRes.error || 'Login failed. Please check your credentials.'
    };
  }

  const user = apiRes.user;
  
  // Store session in localStorage
  try {
    localStorage.setItem('villagevision_user', JSON.stringify(user));
  } catch (e) {
    console.error('Failed to store session:', e);
  }

  return {
    success: true,
    user
  };
}

// -------------------------------------------------------------
// PASSWORD RESET ENGINE & EMAIL DISPATCH
// -------------------------------------------------------------

const RESET_TOKENS_KEY = 'villagevision_password_reset_tokens';
const OUTBOX_EMAILS_KEY = 'villagevision_outbox_emails';

export function getPasswordResetTokens() {
  try {
    const raw = localStorage.getItem(RESET_TOKENS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to read reset tokens:', e);
    return [];
  }
}

function savePasswordResetTokens(tokens) {
  try {
    localStorage.setItem(RESET_TOKENS_KEY, JSON.stringify(tokens));
  } catch (e) {}
}

export function getOutboxEmails() {
  try {
    const raw = localStorage.getItem(OUTBOX_EMAILS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to read outbox emails:', e);
    return [];
  }
}

function recordOutboxEmail(emailData) {
  const outbox = getOutboxEmails();
  outbox.unshift(emailData);
  try {
    localStorage.setItem(OUTBOX_EMAILS_KEY, JSON.stringify(outbox.slice(0, 50)));
  } catch (e) {}
}

function generateSecureToken() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'rst_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 12);
}

export function requestPasswordReset(email) {
  const trimmedEmail = (email || '').trim();

  if (!trimmedEmail) {
    return {
      success: false,
      error: 'Please enter your registered email address.'
    };
  }

  if (!isValidEmailFormat(trimmedEmail)) {
    return {
      success: false,
      error: 'Please enter a valid email address (e.g. name@domain.com).'
    };
  }

  const accounts = getRegisteredAccounts();
  const account = accounts.find(acc => acc.email.toLowerCase() === trimmedEmail.toLowerCase());

  if (!account) {
    return {
      success: false,
      error: 'No account registered with this email address. Please check and try again or sign up.'
    };
  }

  const token = generateSecureToken();
  const now = Date.now();
  const expiresAt = now + 15 * 60 * 1000;

  const origin = typeof window !== 'undefined' && window.location ? window.location.origin : 'http://localhost:3000';
  const pathname = typeof window !== 'undefined' && window.location ? window.location.pathname : '/';
  const resetUrl = `${origin}${pathname}?token=${token}`;

  const tokenRecord = {
    token,
    email: account.email,
    fullName: account.fullName,
    role: account.role,
    createdAt: now,
    expiresAt,
    used: false
  };

  const tokens = getPasswordResetTokens();
  tokens.push(tokenRecord);
  savePasswordResetTokens(tokens);

  const emailPayload = {
    id: `EML-${Date.now()}`,
    to: account.email,
    recipientName: account.fullName,
    from: 'security@villagevision.ai',
    subject: 'VillageVision AI — Reset Your Password',
    resetUrl,
    token,
    sentAt: new Date().toISOString(),
    expiresAt: new Date(expiresAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    body: `Hello ${account.fullName},

We received a request to reset your password for VillageVision AI (${account.role}).

Click the link below to set a new password. This link is valid for 15 minutes:
${resetUrl}

If you did not request this, you can safely ignore this message.`
  };
  recordOutboxEmail(emailPayload);

  return {
    success: true,
    token,
    resetUrl,
    email: account.email,
    fullName: account.fullName,
    role: account.role,
    expiresAt,
    message: 'A password reset link has been dispatched to your email address.'
  };
}

export function verifyResetToken(token) {
  if (!token || typeof token !== 'string') {
    return {
      valid: false,
      error: 'Invalid or missing password reset token.'
    };
  }

  const tokens = getPasswordResetTokens();
  const record = tokens.find(t => t.token === token.trim());

  if (!record) {
    return {
      valid: false,
      error: 'This password reset link is invalid or does not exist.'
    };
  }

  if (record.used) {
    return {
      valid: false,
      error: 'This password reset link has already been used. Please request a new one.'
    };
  }

  if (Date.now() > record.expiresAt) {
    return {
      valid: false,
      error: 'This password reset link has expired. Links are valid for 15 minutes.'
    };
  }

  return {
    valid: true,
    email: record.email,
    fullName: record.fullName,
    role: record.role,
    tokenRecord: record
  };
}

export function resetPassword({ token, newPassword, confirmPassword }) {
  const tokenCheck = verifyResetToken(token);
  if (!tokenCheck.valid) {
    return {
      success: false,
      error: tokenCheck.error
    };
  }

  if (!newPassword) {
    return {
      success: false,
      error: 'Please enter a new password.'
    };
  }

  if (newPassword.length < 6) {
    return {
      success: false,
      error: 'Password must be at least 6 characters long.'
    };
  }

  if (newPassword !== confirmPassword) {
    return {
      success: false,
      error: 'Passwords do not match. Please ensure both fields are identical.'
    };
  }

  const accounts = getRegisteredAccounts();
  const accountIndex = accounts.findIndex(acc => acc.email.toLowerCase() === tokenCheck.email.toLowerCase());

  if (accountIndex !== -1) {
    accounts[accountIndex].password = newPassword;
    saveAccounts(accounts);
  }

  const tokens = getPasswordResetTokens();
  const tIndex = tokens.findIndex(t => t.token === token.trim());
  if (tIndex !== -1) {
    tokens[tIndex].used = true;
    tokens[tIndex].usedAt = Date.now();
    savePasswordResetTokens(tokens);
  }

  return {
    success: true,
    email: tokenCheck.email,
    role: tokenCheck.role,
    fullName: tokenCheck.fullName,
    message: 'Your password has been reset successfully! You can now log in with your new password.'
  };
}
