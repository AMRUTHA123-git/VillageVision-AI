/**
 * VillageVision AI — Account & Authentication Manager
 *
 * Manages registered users, credentials validation, and role enforcement.
 * Supported roles: 'Citizen' and 'NGO / Volunteer'
 * Persists accounts in localStorage under key: villagevision_registered_accounts
 */

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

/**
 * Retrieve list of deleted account emails
 */
function getDeletedEmails() {
  try {
    const raw = localStorage.getItem(DELETED_ACCOUNTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

/**
 * Record an email as deleted
 */
function recordDeletedEmail(email) {
  const deleted = getDeletedEmails();
  const lower = email.toLowerCase().trim();
  if (!deleted.includes(lower)) {
    deleted.push(lower);
    localStorage.setItem(DELETED_ACCOUNTS_KEY, JSON.stringify(deleted));
  }
}

/**
 * Clear email from deleted list when user re-registers
 */
function unmarkDeletedEmail(email) {
  const deleted = getDeletedEmails().filter(e => e.toLowerCase() !== email.toLowerCase().trim());
  localStorage.setItem(DELETED_ACCOUNTS_KEY, JSON.stringify(deleted));
}

/**
 * Retrieve all registered accounts from localStorage or initialize defaults
 */
export function getRegisteredAccounts() {
  const deletedEmails = getDeletedEmails();
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Ensure default accounts are present (unless explicitly deleted)
        let updated = false;
        DEFAULT_ACCOUNTS.forEach(defAcc => {
          const isDeleted = deletedEmails.includes(defAcc.email.toLowerCase());
          if (!isDeleted && !parsed.some(acc => acc.email.toLowerCase() === defAcc.email.toLowerCase())) {
            parsed.push(defAcc);
            updated = true;
          }
        });
        if (updated) {
          localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(parsed));
        }
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to parse registered accounts:', e);
  }

  // Initialize with non-deleted default demo accounts
  const initialAccounts = DEFAULT_ACCOUNTS.filter(acc => !deletedEmails.includes(acc.email.toLowerCase()));
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(initialAccounts));
  return initialAccounts;
}

/**
 * Save updated accounts list to localStorage
 */
function saveAccounts(accounts) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

/**
 * Permanently delete a user account from storage and active session
 */
export function deleteAccount(identifierOrEmail) {
  if (!identifierOrEmail) {
    return {
      success: false,
      error: 'Identifier or email is required to delete account.'
    };
  }

  const target = identifierOrEmail.trim().toLowerCase();
  const accounts = getRegisteredAccounts();
  const updatedAccounts = accounts.filter(acc => 
    acc.email.toLowerCase() !== target && 
    (acc.identifier ? acc.identifier.toLowerCase() !== target : true)
  );

  // Record email in deleted tracking so default accounts don't auto-revive
  recordDeletedEmail(target);
  saveAccounts(updatedAccounts);

  // Clear current active session if it matches
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
 * Register a new account from Sign Up
 */
export function registerAccount({ fullName, email, mobileNumber = '', password, role = 'Citizen' }) {
  const accounts = getRegisteredAccounts();
  const trimmedEmail = email.trim().toLowerCase();

  // Validate allowed role
  const validRoles = ['Citizen', 'NGO / Volunteer', 'Volunteer', 'NGO'];
  if (!validRoles.includes(role)) {
    return {
      success: false,
      error: 'Please select a valid role (Citizen or NGO / Volunteer).'
    };
  }

  // Check if email already registered
  const existing = accounts.find(acc => acc.email.toLowerCase() === trimmedEmail);
  if (existing) {
    return {
      success: false,
      error: 'An account with this email already exists. Please login.'
    };
  }

  const newAccount = {
    id: `USR-${Date.now().toString().slice(-4)}`,
    fullName: fullName.trim(),
    email: trimmedEmail,
    mobileNumber: (mobileNumber || '').trim(),
    password: password,
    role: role
  };

  accounts.push(newAccount);
  saveAccounts(accounts);

  return {
    success: true,
    user: newAccount
  };
}

/**
 * Validate email format
 */
export function isValidEmailFormat(email) {
  if (!email || typeof email !== 'string') return false;
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email.trim());
}

/**
 * Authenticate user credentials and role for Login
 *
 * Checks:
 * 1. Email format
 * 2. Registered account existence
 * 3. Password match
 * 4. Selected role matches account role
 */
export function authenticateUser({ email, password, role }) {
  const trimmedEmail = (email || '').trim();

  // 1. EMAIL FORMAT VALIDATION
  if (!isValidEmailFormat(trimmedEmail)) {
    return {
      success: false,
      error: 'Please enter a valid email address.'
    };
  }

  // 2. REGISTERED USER CHECK
  const accounts = getRegisteredAccounts();
  const account = accounts.find(acc => acc.email.toLowerCase() === trimmedEmail.toLowerCase());

  if (!account) {
    return {
      success: false,
      error: 'No account found with this email. Please sign up first.'
    };
  }

  // 3. PASSWORD CHECK
  if (account.password !== password) {
    return {
      success: false,
      error: 'Incorrect password. Please try again.'
    };
  }

  // 4. ROLE CHECK
  const selectedRoleNorm = (role || '').trim().toLowerCase();
  const accountRoleNorm = (account.role || '').trim().toLowerCase();

  const isCitizenMatch = selectedRoleNorm.includes('citizen') && accountRoleNorm.includes('citizen');
  const isNgoMatch = (selectedRoleNorm.includes('ngo') || selectedRoleNorm.includes('volunteer')) && 
                     (accountRoleNorm.includes('ngo') || accountRoleNorm.includes('volunteer'));

  const isRoleMatching = isCitizenMatch || isNgoMatch || (selectedRoleNorm === accountRoleNorm);

  if (!isRoleMatching) {
    return {
      success: false,
      error: 'Your account does not belong to this role.'
    };
  }

  // Authentication Succeeded
  return {
    success: true,
    user: {
      id: account.id,
      fullName: account.fullName,
      email: account.email,
      identifier: account.email,
      role: account.role
    }
  };
}

// -------------------------------------------------------------
// PASSWORD RESET ENGINE & EMAIL DISPATCH
// -------------------------------------------------------------

const RESET_TOKENS_KEY = 'villagevision_password_reset_tokens';
const OUTBOX_EMAILS_KEY = 'villagevision_outbox_emails';

/**
 * Retrieve all password reset tokens from storage
 */
export function getPasswordResetTokens() {
  try {
    const raw = localStorage.getItem(RESET_TOKENS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to read reset tokens:', e);
    return [];
  }
}

/**
 * Save password reset tokens to storage
 */
function savePasswordResetTokens(tokens) {
  localStorage.setItem(RESET_TOKENS_KEY, JSON.stringify(tokens));
}

/**
 * Retrieve system outbox emails from storage
 */
export function getOutboxEmails() {
  try {
    const raw = localStorage.getItem(OUTBOX_EMAILS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to read outbox emails:', e);
    return [];
  }
}

/**
 * Dispatch an email to the system outbox
 */
function recordOutboxEmail(emailData) {
  const outbox = getOutboxEmails();
  outbox.unshift(emailData);
  localStorage.setItem(OUTBOX_EMAILS_KEY, JSON.stringify(outbox.slice(0, 50)));
}

/**
 * Generate a cryptographically secure random token string
 */
function generateSecureToken() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'rst_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 12);
}

/**
 * Request a Password Reset Link
 *
 * Validates the email, creates an expiring single-use token,
 * generates the real reset URL, and records the email dispatch.
 */
export function requestPasswordReset(email) {
  const trimmedEmail = (email || '').trim();

  // 1. EMPTY EMAIL VALIDATION
  if (!trimmedEmail) {
    return {
      success: false,
      error: 'Please enter your registered email address.'
    };
  }

  // 2. EMAIL FORMAT VALIDATION
  if (!isValidEmailFormat(trimmedEmail)) {
    return {
      success: false,
      error: 'Please enter a valid email address (e.g. name@domain.com).'
    };
  }

  // 3. REGISTERED USER CHECK
  const accounts = getRegisteredAccounts();
  const account = accounts.find(acc => acc.email.toLowerCase() === trimmedEmail.toLowerCase());

  if (!account) {
    return {
      success: false,
      error: 'No account registered with this email address. Please check and try again or sign up.'
    };
  }

  // 4. GENERATE SECURE RESET TOKEN & EXPIRY (15 minutes)
  const token = generateSecureToken();
  const now = Date.now();
  const expiresAt = now + 15 * 60 * 1000; // 15 mins

  // Base URL for reset link
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

  // 5. DISPATCH OFFICIAL SECURITY EMAIL
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
    body: `Hello ${account.fullName},\n\nWe received a request to reset your password for VillageVision AI (${account.role}).\n\nClick the link below to set a new password. This link is valid for 15 minutes:\n${resetUrl}\n\nIf you did not request this, you can safely ignore this message.`
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

/**
 * Verify if a reset token is valid, unused, and not expired
 */
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

/**
 * Update the user's password using a verified reset token
 */
export function resetPassword({ token, newPassword, confirmPassword }) {
  // 1. VERIFY TOKEN
  const tokenCheck = verifyResetToken(token);
  if (!tokenCheck.valid) {
    return {
      success: false,
      error: tokenCheck.error
    };
  }

  // 2. VALIDATE NEW PASSWORD
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

  // 3. CONFIRM PASSWORD MATCH
  if (newPassword !== confirmPassword) {
    return {
      success: false,
      error: 'Passwords do not match. Please ensure both fields are identical.'
    };
  }

  // 4. UPDATE USER ACCOUNT PASSWORD
  const accounts = getRegisteredAccounts();
  const accountIndex = accounts.findIndex(acc => acc.email.toLowerCase() === tokenCheck.email.toLowerCase());

  if (accountIndex === -1) {
    return {
      success: false,
      error: 'Associated account could not be found. Please contact support.'
    };
  }

  accounts[accountIndex].password = newPassword;
  saveAccounts(accounts);

  // 5. MARK TOKEN AS USED
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

