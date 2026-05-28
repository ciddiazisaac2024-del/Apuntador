import { chromium } from 'playwright';
import path from 'path';

const artifactDir = 'C:\\Users\\icidd\\.gemini\\antigravity\\brain\\bfc67ce3-44bd-43ca-bd59-c83a7b5bf6cc';

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('Navigating to login...');
  await page.goto('http://localhost:5173/login');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(artifactDir, 'test_1_login.png') });
  
  console.log('Logging in as ana.super...');
  await page.fill('input[type="text"]', 'ana.super');
  await page.fill('input[type="password"]', 'super123');
  await page.screenshot({ path: path.join(artifactDir, 'test_2_login_filled.png') });
  
  await Promise.all([
    page.waitForNavigation(),
    page.click('button[type="submit"]')
  ]);
  
  console.log('Taking screenshot of dashboard...');
  await page.waitForTimeout(2000); // wait for data to load
  await page.screenshot({ path: path.join(artifactDir, 'test_3_dashboard.png') });
  
  console.log('Logging out...');
  await Promise.all([
    page.waitForNavigation(),
    page.click('text=Cerrar Sesión')
  ]);
  
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(artifactDir, 'test_4_logout.png') });
  
  await browser.close();
  console.log('Visual tests completed successfully.');
}

run().catch(console.error);
