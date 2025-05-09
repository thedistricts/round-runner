import { test, expect } from '@playwright/test';

test.describe('Frog Graham Round Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/frog-graham');
  });

  test('should load with correct title and metadata', async ({ page }) => {
    await expect(page).toHaveTitle(/Round Runner: Validate Your Frog Graham Round ratification/);
    
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute('content', /Round Runner is an online tool/);
  });

  test('should display file upload component', async ({ page }) => {
    const filepondWrapper = page.getByTestId('filepond-wrapper');
    await expect(filepondWrapper).toBeVisible();
    
    const filepondInput = page.locator('.filepond--root');
    await expect(filepondInput).toBeVisible();
  });

  test('should display route information and checkpoints', async ({ page }) => {
    const routeInfoLink = page.getByRole('link', { name: /Route Information/i });
    await expect(routeInfoLink).toBeVisible();
    
    await routeInfoLink.click();
    
    const checkpointsHeading = page.getByRole('heading', { name: /\d+ Checkpoints/ });
    await expect(checkpointsHeading).toBeVisible();
    
    const checkpointsList = page.locator('ol.text-sm');
    await expect(checkpointsList).toBeVisible();
    
    const firstCheckpoint = checkpointsList.getByRole('button', { name: /^1: Moot Hall \(Start\)$/ });
    await expect(firstCheckpoint).toBeVisible();
  });

  test('should handle route information toggle', async ({ page }) => {
    const routeInfoLink = page.getByRole('link', { name: /Route Information/i });
    await routeInfoLink.click();
    
    await expect(page).toHaveURL(/\/frog-graham\/route-information/);
    
    await routeInfoLink.click();
    await expect(page).toHaveURL(/\/frog-graham$/);
  });

  test('should maintain state after page refresh', async ({ page }) => {
    const routeInfoLink = page.getByRole('link', { name: /Route Information/i });
    await routeInfoLink.click();
    
    await expect(page).toHaveURL(/\/frog-graham\/route-information/);
    
    await page.reload();
    
    await expect(page).toHaveURL(/\/frog-graham\/route-information/);
  });
}); 