import { test, expect } from '@playwright/test';

test.describe('Main page smoke tests', () => {
  test('should load the main page', async ({ page }) => {
    await page.goto('/');
    
    await expect(page).toHaveTitle(/Round Runner/);
    
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('should have working navigation', async ({ page }) => {
    await page.goto('/');
    
    const navLinks = page.getByRole('link');
    const count = await navLinks.count();
    
    expect(count).toBeGreaterThan(0);
    
    for (let i = 0; i < count; i++) {
      const link = navLinks.nth(i);
      const href = await link.getAttribute('href');
      if (href && !href.startsWith('http')) {
        await link.click();
        await page.waitForLoadState('networkidle');
        await expect(page).not.toHaveURL('/');
        await page.goBack();
        await page.waitForLoadState('networkidle');
      }
    }
  });
}); 