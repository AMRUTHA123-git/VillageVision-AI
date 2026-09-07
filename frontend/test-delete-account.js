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

async function runDeleteAccountAudit() {
  console.log('====================================================');
  console.log('🗑️ TESTING DELETE ACCOUNT FUNCTIONALITY');
  console.log('====================================================\n');

  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1400,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 900 });

  const results = {
    '1. Sign Up Temporary Account': false,
    '2. Login with New Account': false,
    '3. Profile Page Displays Danger Zone': false,
    '4. Open Delete Confirmation Modal': false,
    '5. Confirm Account Deletion': false,
    '6. Redirects to Home on Deletion': false,
    '7. Deleted Account Login Fails (Account Gone)': false
  };

  try {
    const testEmail = `testuser_${Date.now().toString().slice(-4)}@villagevision.ai`;
    const testPass = 'TestPass@123';

    // 1. OPEN HOME & GO TO SIGN UP
    console.log('➡️ STEP 1: Creating temporary test account...');
    await page.goto(APP_URL, { waitUntil: 'networkidle2' });
    
    // Click Login -> Sign Up
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button, a'));
      const lBtn = btns.find(b => b.textContent.trim() === 'Login' || b.textContent.includes('Get Started'));
      if (lBtn) lBtn.click();
    });
    await page.waitForSelector('.centered-login-card', { timeout: 5000 });

    await page.click('.signup-link');
    await page.waitForSelector('#su-fullname', { timeout: 5000 });

    await typeInput(page, '#su-fullname', 'Delete Test User');
    await typeInput(page, '#su-email', testEmail);
    await typeInput(page, '#su-password', testPass);
    await typeInput(page, '#su-confirm-password', testPass);
    await page.click('button[type="submit"]');

    await page.waitForSelector('.centered-login-card', { timeout: 5000 });
    console.log(`✓ Account created: ${testEmail}`);
    results['1. Sign Up Temporary Account'] = true;

    // 2. LOGIN
    console.log('\n➡️ STEP 2: Logging into new account...');
    await typeInput(page, '#email', testEmail);
    await typeInput(page, '#password', testPass);
    await page.click('button[type="submit"]');
    await page.waitForSelector('.dashboard-sidebar', { timeout: 6000 });
    console.log('✓ Logged in to dashboard successfully.');
    results['2. Login with New Account'] = true;

    // 3. NAVIGATE TO PROFILE
    console.log('\n➡️ STEP 3: Navigating to Profile tab...');
    await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('.sidebar-link'));
      const profTab = items.find(i => i.textContent.includes('Profile'));
      if (profTab) profTab.click();
    });
    await new Promise(r => setTimeout(r, 600));

    const profileText = await page.evaluate(() => document.body.innerText);
    if (profileText.includes('Delete Account') && profileText.includes('Delete My Account')) {
      console.log('✓ SUCCESS: Profile page contains Delete Account danger zone.');
      results['3. Profile Page Displays Danger Zone'] = true;
    }

    // 4. OPEN CONFIRMATION MODAL
    console.log('\n➡️ STEP 4: Opening Delete Confirmation modal...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const delBtn = btns.find(b => b.textContent.includes('Delete My Account'));
      if (delBtn) delBtn.click();
    });
    await new Promise(r => setTimeout(r, 500));

    const modalVisible = await page.evaluate(() => {
      return document.body.innerText.includes('Confirm Account Deletion');
    });
    if (modalVisible) {
      console.log('✓ SUCCESS: Confirmation modal opened.');
      results['4. Open Delete Confirmation Modal'] = true;
    }

    // 5 & 6. CONFIRM DELETION
    console.log('\n➡️ STEP 5 & 6: Confirming deletion...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const yesBtn = btns.find(b => b.textContent.includes('Yes, Delete'));
      if (yesBtn) yesBtn.click();
    });
    await new Promise(r => setTimeout(r, 1000));

    const isHome = await page.evaluate(() => document.querySelector('.hero-section') !== null);
    if (isHome) {
      console.log('✓ SUCCESS: Account deleted and user returned to Home page.');
      results['5. Confirm Account Deletion'] = true;
      results['6. Redirects to Home on Deletion'] = true;
    }

    // 7. VERIFY LOGIN FAILS
    console.log('\n➡️ STEP 7: Verifying deleted account cannot log in...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button, a'));
      const lBtn = btns.find(b => b.textContent.trim() === 'Login' || b.textContent.includes('Get Started'));
      if (lBtn) lBtn.click();
    });
    await page.waitForSelector('.centered-login-card', { timeout: 5000 });

    await typeInput(page, '#email', testEmail);
    await typeInput(page, '#password', testPass);
    await page.click('button[type="submit"]');
    await new Promise(r => setTimeout(r, 500));

    const loginErr = await page.evaluate(() => document.querySelector('.error-alert-box')?.textContent || '');
    if (loginErr.includes('No account found')) {
      console.log(`✓ SUCCESS: Deleted account rejected: "${loginErr.trim()}"`);
      results['7. Deleted Account Login Fails (Account Gone)'] = true;
    }

  } catch (err) {
    console.error('❌ Error during Delete Account test:', err);
  } finally {
    await browser.close();
  }

  console.log('\n====================================================');
  console.log('📊 DELETE ACCOUNT VERIFICATION REPORT');
  console.log('====================================================');
  console.table(results);

  return results;
}

runDeleteAccountAudit();
