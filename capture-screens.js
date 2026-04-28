const { chromium } = require('playwright');
const path = require('path');

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const BASE = 'http://localhost:8000';
const OUT = __dirname;
const W = 1280;
const H = 860;
const SCALE = 2;

(async () => {
  const browser = await chromium.launch({
    executablePath: CHROME,
    headless: true,
  });
  const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: SCALE });
  const page = await ctx.newPage();

  // ── 1. DASHBOARD (Team Skill Progress) ──
  console.log('Capturing dashboard…');
  await page.goto(BASE + '/index.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: OUT + '/screen-dashboard.png' });
  console.log('✓ dashboard');

  // ── 2. LEARNER DETAIL — click on Lena Müller ──
  console.log('Capturing learner detail…');
  await page.goto(BASE + '/index.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
  try {
    await page.locator('text=Lena').first().click();
    await page.waitForTimeout(900);
  } catch(e) { console.log('  could not click Lena:', e.message); }
  await page.screenshot({ path: OUT + '/screen-learner.png' });
  console.log('✓ learner detail');

  // ── 3. GOAL BUILDER (input state) ──
  console.log('Capturing goal builder…');
  await page.goto(BASE + '/index.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  try {
    await page.locator('text=Goal Builder').first().click();
    await page.waitForTimeout(700);
  } catch(e) { console.log('  could not click Goal Builder tab:', e.message); }
  await page.screenshot({ path: OUT + '/screen-goalbuilder.png' });
  console.log('✓ goal builder');

  // ── 4. GOAL BUILDER WITH PLAN RESULT ──
  console.log('Capturing plan result…');
  await page.goto(BASE + '/index.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  try {
    await page.locator('text=Goal Builder').first().click();
    await page.waitForTimeout(600);
    // Step 1: click "Analyze goal →"
    await page.locator('text=Analyze goal').first().click();
    await page.waitForTimeout(1200);
    // Step 2: click "Build this plan →"
    await page.locator('text=Build this plan').first().click();
    await page.waitForTimeout(2800); // wait for plan to animate in
    await page.screenshot({ path: OUT + '/screen-plan-result.png' });
    console.log('✓ plan result');
  } catch(e) {
    console.log('  plan result fallback:', e.message);
    await page.screenshot({ path: OUT + '/screen-plan-result.png' });
  }

  // ── 5. SKILLS TREE ──
  console.log('Capturing skills tree…');
  await page.goto(BASE + '/index.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  try {
    // Try clicking a Skills nav item
    const skillsNav = page.locator('text=Skill Targets').first();
    await skillsNav.click();
    await page.waitForTimeout(700);
  } catch(e) {
    try {
      await page.locator('text=Skills').first().click();
      await page.waitForTimeout(700);
    } catch(e2) { console.log('  skills nav not found'); }
  }
  await page.screenshot({ path: OUT + '/screen-skills.png' });
  console.log('✓ skills');

  await browser.close();
  console.log('\nDone. Screenshots in:', OUT);
})();
