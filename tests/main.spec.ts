import { test, expect } from '@playwright/test';

test.describe('Main page smoke tests', () => {
  test('should load the main page', async ({ page }) => {
    // Navigate to the main page
    await page.goto('/');
    
    // Check if the page loaded successfully
    await expect(page).toHaveTitle(/Round Runner/);
    
    // Check for some basic elements that should be present
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('should have working navigation', async ({ page }) => {
    await page.goto('/');
    
    // Check if navigation links are present and clickable
    const navLinks = page.getByRole('link');
    const count = await navLinks.count();
    
    // Verify there are navigation links
    expect(count).toBeGreaterThan(0);
    
    // Click each link and verify it navigates
    for (let i = 0; i < count; i++) {
      const link = navLinks.nth(i);
      const href = await link.getAttribute('href');
      if (href && !href.startsWith('http')) {
        await link.click();
        // Wait for navigation to complete
        await page.waitForLoadState('networkidle');
        await expect(page).not.toHaveURL('/');
        await page.goBack();
        await page.waitForLoadState('networkidle');
      }
    }
  });
}); 