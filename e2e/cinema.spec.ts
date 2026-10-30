import { test, expect } from '@playwright/test';

test.describe('DIRECTOR\'S CUT — Interactive Cinema E2E Workflow', () => {
  test('complete viewer journey from landing to final verdict and replay', async ({ page }) => {
    // 1. Visit Landing Page
    await page.goto('/');
    await expect(page).toHaveTitle(/DIRECTOR'S CUT/i);
    await expect(page.locator('text=Every perspective tells a different truth')).toBeVisible();

    // 2. Launch Cinematic Experience
    await page.click('[data-testid="landing-launch-btn"]');
    await expect(page.locator('[data-testid="cinematic-viewport"]')).toBeVisible();
    await expect(page.locator('[data-testid="timeline-progress-bar"]')).toBeVisible();

    // 3. Test Perspective Switching (Witness -> Suspect -> Victim)
    await page.click('[data-testid="perspective-btn-suspect"]');
    await page.waitForTimeout(300);

    await page.click('[data-testid="perspective-btn-victim"]');
    await page.waitForTimeout(300);

    // 4. Test Clue Discovery on Timeline
    const firstClueMarker = page.locator('[data-testid^="timeline-clue-marker-"]').first();
    await expect(firstClueMarker).toBeVisible();
    await firstClueMarker.click();

    // Clue detail modal should open
    await expect(page.locator('[data-testid="clue-detail-modal"]')).toBeVisible();
    await expect(page.locator('text=Perspective Contradictions')).toBeVisible();

    // Close clue modal & resume
    await page.click('[data-testid="close-clue-modal-btn"]');
    await expect(page.locator('[data-testid="clue-detail-modal"]')).not.toBeVisible();

    // 5. Navigate to Evidence Board
    await page.click('[data-testid="nav-evidence-board-btn"]');
    await expect(page.locator('text=Evidence Repository')).toBeVisible();
    await expect(page.locator('text=Evidence Pinboard')).toBeVisible();

    // 6. Navigate to Final Verdict Chamber
    await page.click('[data-testid="proceed-to-verdict-btn"]');
    await expect(page.locator('text=Final Verdict Chamber')).toBeVisible();

    // 7. Select Verdict (e.g. Deliberate Manipulation) & Confirm
    await page.click('[data-testid="verdict-option-manipulation"]');
    await page.click('[data-testid="lock-in-verdict-btn"]');

    // 8. View Ending Resolution & Epilogue
    await expect(page.locator('text=Audience Interpretation Recorded')).toBeVisible();
    await expect(page.locator('text=THE ARCHITECT OF HER OWN TRAGEDY')).toBeVisible();
    await expect(page.locator('text=Forensic Alignment Score:')).toBeVisible();

    // 9. Replay Experience
    await page.click('[data-testid="replay-experience-btn"]');
    await expect(page.locator('[data-testid="cinematic-viewport"]')).toBeVisible();
  });
});

