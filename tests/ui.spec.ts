import { test, expect } from '@playwright/test';

test.describe('UI Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display main heading and subheading', async ({ page }) => {
    const mainHeading = page.getByRole('heading', { name: 'Round Runner', level: 1 });
    await expect(mainHeading).toBeVisible();

    const subHeading = page.getByRole('heading', { 
      name: 'Plan, explore & verify your long-distance challenges',
      level: 2 
    });
    await expect(subHeading).toBeVisible();
  });

  test('should display rounds count and description', async ({ page }) => {
    const roundsText = page.getByText(/route breakdowns, split times by stage, gpx waypoints/);
    await expect(roundsText).toBeVisible();
  });

  test('should display rounds in a grid layout', async ({ page }) => {
    const nav = page.getByRole('navigation');
    await expect(nav).toBeVisible();
    
    const roundCards = page.getByRole('heading', { level: 3 });
    const count = await roundCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should have properly structured round cards with content', async ({ page }) => {
    const firstRoundCard = page.getByRole('heading', { level: 3 }).first();
    await expect(firstRoundCard).toBeVisible();
    
    const roundLink = firstRoundCard.getByRole('link');
    await expect(roundLink).toBeVisible();
    
    const roundContainer = firstRoundCard.locator('..');
    const paragraphs = roundContainer.locator('p');
    await expect(paragraphs.first()).toBeVisible();
  });

  test('should display round information', async ({ page }) => {
    const firstRoundCard = page.getByRole('heading', { level: 3 }).first();
    const roundInfo = firstRoundCard.locator('..').getByText(/^Frog Graham Round/);
    await expect(roundInfo).toBeVisible();
  });

  test('should be responsive', async ({ page }) => {
    const nav = page.getByRole('navigation');
    await expect(nav).toHaveClass(/grid-cols-1/);
    
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(nav).toHaveClass(/md:grid-cols-2/);
    
    await page.setViewportSize({ width: 1280, height: 800 });
    await expect(nav).toHaveClass(/xl:grid-cols-3/);
  });
}); 