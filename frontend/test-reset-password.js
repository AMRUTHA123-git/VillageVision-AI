import puppeteer from 'puppeteer-core';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const APP_URL = 'http://localhost:3000/';

async function typeInput(page, selector, text) {
  await page.waitForSelector(selector, { timeout: 5000 });
  await page.focus(selector);
  await page.keyboard.down('Control');
  await page.keyboard.press('A');
  await page.keyboard.up('Control');
  await page.keyboard.press('Backspace');
  await page.type(selector, text, { delay: 10 });
}

async function runPasswordResetAudit() {
  console.log('====================================================');
  console.log('🔑 TESTING REAL PASSWORD RESET SYSTEM — VILLAGEVISION AI');
  console.log('====================================================\n');

  const consoleErrors = [];
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1400,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 900 });

  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(`[Console Error] ${msg.text()}`);
    }
  });

  page.on('pageerror', err => {
    consoleErrors.push(`[Page Error] ${err.toString()}`);
  });

  const results = {
    '1. Navigate from Login to Forgot Password': false,
    '2. Empty Email Validation Error': false,
    '3. Invalid Email Format Validation Error': false,
    '4. Unregistered Email Error': false,
    '5. Real Token & Email Dispatched for Registered User': false,
    '6. Open Reset Link Direct from Token': false,
    '7. Reset Password Screen Renders User Target': false,
    '8. Short Password Validation (<6 chars)': false,
    '9. Password Confirmation Mismatch Validation': false,
    '10. Successfully Set New Password': false,
    '11. Reset Token Marked As Used (Cannot Re-use)': false,
    '12. Old Password Rejected on Login': false,
    '13. Login with New Password Succeeds': false
  };

  try {
    // ----------------------------------------------------
    // STEP 1: OPEN HOME AND GO TO LOGIN
    // ----------------------------------------------------
    console.log('➡️ STEP 1: Opening http://localhost:3000/ and navigating to Login...');
    await page.goto(APP_URL, { waitUntil: 'networkidle2', timeout: 15000 });

    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button, a'));
      const lBtn = btns.find(b => b.textContent.trim() === 'Login' || b.textContent.includes('Get Started'));
      if (lBtn) lBtn.click();
    });
    await page.waitForSelector('.centered-login-card', { timeout: 5000 });

    // Click "Forgot Password?"
    console.log('➡️ Navigating to Forgot Password page...');
    await page.click('a.forgot-password-green');
    await page.waitForSelector('#forgot-email', { timeout: 5000 });
    console.log('✓ SUCCESS: Forgot Password screen rendered cleanly.');
    results['1. Navigate from Login to Forgot Password'] = true;

    // ----------------------------------------------------
    // STEP 2: TEST EMPTY EMAIL VALIDATION
    // ----------------------------------------------------
    console.log('\n➡️ STEP 2: Testing Empty Email submission...');
    await page.click('button[type="submit"]');
    await new Promise(r => setTimeout(r, 400));
    const emptyErr = await page.evaluate(() => document.querySelector('.error-alert-box')?.textContent || '');
    if (emptyErr.includes('Please enter your registered email')) {
      console.log(`✓ SUCCESS: Caught empty email error: "${emptyErr.trim()}"`);
      results['2. Empty Email Validation Error'] = true;
    }

    // ----------------------------------------------------
    // STEP 3: TEST INVALID EMAIL FORMAT
    // ----------------------------------------------------
    console.log('\n➡️ STEP 3: Testing Invalid Email Format...');
    await typeInput(page, '#forgot-email', 'invalidemailaddress');
    await page.click('button[type="submit"]');
    await new Promise(r => setTimeout(r, 400));
    const invalidErr = await page.evaluate(() => document.querySelector('.error-alert-box')?.textContent || '');
    if (invalidErr.includes('valid email address')) {
      console.log(`✓ SUCCESS: Caught invalid email format error: "${invalidErr.trim()}"`);
      results['3. Invalid Email Format Validation Error'] = true;
    }

    // ----------------------------------------------------
    // STEP 4: TEST UNREGISTERED EMAIL
    // ----------------------------------------------------
    console.log('\n➡️ STEP 4: Testing Unregistered Email...');
    await typeInput(page, '#forgot-email', 'nonexistent_citizen@villagevision.ai');
    await page.click('button[type="submit"]');
    await new Promise(r => setTimeout(r, 400));
    const unregErr = await page.evaluate(() => document.querySelector('.error-alert-box')?.textContent || '');
    if (unregErr.includes('No account registered')) {
      console.log(`✓ SUCCESS: Caught unregistered email error: "${unregErr.trim()}"`);
      results['4. Unregistered Email Error'] = true;
    }

    // ----------------------------------------------------
    // STEP 5: VALID REGISTERED EMAIL & DISPATCH
    // ----------------------------------------------------
    console.log('\n➡️ STEP 5: Requesting Reset for registered Citizen (citizen@villagevision.ai)...');
    await typeInput(page, '#forgot-email', 'citizen@villagevision.ai');
    await page.click('button[type="submit"]');
    await page.waitForSelector('.reset-dispatched-wrapper', { timeout: 5000 });

    const dispatchedText = await page.evaluate(() => document.body.innerText);
    if (dispatchedText.includes('Reset Link Dispatched') && dispatchedText.includes('citizen@villagevision.ai')) {
      console.log('✓ SUCCESS: Real reset token generated & official security email dispatched to outbox!');
      results['5. Real Token & Email Dispatched for Registered User'] = true;
    }

    // Get the generated token from localStorage
    const resetInfo = await page.evaluate(() => {
      const tokens = JSON.parse(localStorage.getItem('villagevision_password_reset_tokens') || '[]');
      const lastToken = tokens[tokens.length - 1];
      return lastToken;
    });
    console.log('✓ Generated Reset Token Record:', resetInfo);

    // ----------------------------------------------------
    // STEP 6 & 7: CLICK "OPEN RESET LINK NOW"
    // ----------------------------------------------------
    console.log('\n➡️ STEP 6 & 7: Opening Reset Link from token...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const openBtn = btns.find(b => b.textContent.includes('OPEN RESET LINK NOW'));
      if (openBtn) openBtn.click();
    });

    await page.waitForSelector('#new-password', { timeout: 5000 });
    const resetViewText = await page.evaluate(() => document.body.innerText);
    if (resetViewText.includes('Resetting Password for') && resetViewText.includes('citizen@villagevision.ai')) {
      console.log('✓ SUCCESS: Reset Password view verified token and displayed user target card.');
      results['6. Open Reset Link Direct from Token'] = true;
      results['7. Reset Password Screen Renders User Target'] = true;
    }

    // ----------------------------------------------------
    // STEP 8: SHORT PASSWORD VALIDATION
    // ----------------------------------------------------
    console.log('\n➡️ STEP 8: Testing Short Password (< 6 chars)...');
    await typeInput(page, '#new-password', '12345');
    await typeInput(page, '#confirm-password', '12345');
    await page.click('button[type="submit"]');
    await new Promise(r => setTimeout(r, 400));
    const shortErr = await page.evaluate(() => document.querySelector('.error-alert-box')?.textContent || '');
    if (shortErr.includes('at least 6 characters')) {
      console.log(`✓ SUCCESS: Caught short password error: "${shortErr.trim()}"`);
      results['8. Short Password Validation (<6 chars)'] = true;
    }

    // ----------------------------------------------------
    // STEP 9: PASSWORD CONFIRMATION MISMATCH
    // ----------------------------------------------------
    console.log('\n➡️ STEP 9: Testing Password Mismatch...');
    await typeInput(page, '#new-password', 'NewPass@2026');
    await typeInput(page, '#confirm-password', 'DifferentPass@2026');
    await page.click('button[type="submit"]');
    await new Promise(r => setTimeout(r, 400));
    const mismatchErr = await page.evaluate(() => document.querySelector('.error-alert-box')?.textContent || '');
    if (mismatchErr.includes('do not match')) {
      console.log(`✓ SUCCESS: Caught password mismatch error: "${mismatchErr.trim()}"`);
      results['9. Password Confirmation Mismatch Validation'] = true;
    }

    // ----------------------------------------------------
    // STEP 10: SET NEW VALID PASSWORD
    // ----------------------------------------------------
    console.log('\n➡️ STEP 10: Setting New Password ("NewCitizen@999")...');
    await typeInput(page, '#new-password', 'NewCitizen@999');
    await typeInput(page, '#confirm-password', 'NewCitizen@999');
    await page.click('button[type="submit"]');
    await page.waitForSelector('.reset-success-box', { timeout: 5000 });
    console.log('✓ SUCCESS: Password updated successfully and confirmation shown.');
    results['10. Successfully Set New Password'] = true;

    // ----------------------------------------------------
    // STEP 11: VERIFY TOKEN CANNOT BE RE-USED
    // ----------------------------------------------------
    console.log('\n➡️ STEP 11: Verifying Reset Token is marked as USED (Replay Protection)...');
    const directUrl = `${APP_URL}?token=${resetInfo.token}`;
    await page.goto(directUrl, { waitUntil: 'networkidle2' });
    await page.waitForSelector('.token-invalid-box', { timeout: 5000 });
    const usedTokenText = await page.evaluate(() => document.body.innerText);
    if (usedTokenText.includes('already been used') || usedTokenText.includes('Invalid or Expired Link')) {
      console.log('✓ SUCCESS: Expired/used token is strictly blocked from re-use!');
      results['11. Reset Token Marked As Used (Cannot Re-use)'] = true;
    }

    // Return to Login
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const retBtn = btns.find(b => b.textContent.includes('Return to Login'));
      if (retBtn) retBtn.click();
    });
    await page.waitForSelector('.centered-login-card', { timeout: 5000 });

    // ----------------------------------------------------
    // STEP 12: OLD PASSWORD REJECTED
    // ----------------------------------------------------
    console.log('\n➡️ STEP 12: Testing that OLD password ("Citizen@123") is rejected...');
    await typeInput(page, '#email', 'citizen@villagevision.ai');
    await typeInput(page, '#password', 'Citizen@123');
    await page.click('button[type="submit"]');
    await new Promise(r => setTimeout(r, 500));
    const oldPassErr = await page.evaluate(() => document.querySelector('.error-alert-box')?.textContent || '');
    if (oldPassErr.includes('Incorrect password')) {
      console.log(`✓ SUCCESS: Old password rejected with: "${oldPassErr.trim()}"`);
      results['12. Old Password Rejected on Login'] = true;
    }

    // ----------------------------------------------------
    // STEP 13: LOGIN WITH NEW PASSWORD SUCCEEDS
    // ----------------------------------------------------
    console.log('\n➡️ STEP 13: Logging in with NEW password ("NewCitizen@999")...');
    await typeInput(page, '#password', 'NewCitizen@999');
    await page.click('button[type="submit"]');
    await page.waitForSelector('.dashboard-sidebar', { timeout: 6000 });
    console.log('✓ SUCCESS: Citizen logged into Citizen Dashboard using the new password!');
    results['13. Login with New Password Succeeds'] = true;

  } catch (err) {
    console.error('❌ Error during Password Reset Verification:', err);
  } finally {
    await browser.close();
  }

  console.log('\n====================================================');
  console.log('📊 PASSWORD RESET VERIFICATION MATRIX');
  console.log('====================================================');
  console.table(results);

  console.log('Browser Console Errors:', consoleErrors.length === 0 ? '✓ ZERO ERRORS' : consoleErrors);

  return results;
}

runPasswordResetAudit();
