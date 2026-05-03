import { test, expect } from '@playwright/test';

const STORAGE_KEY = 'theme-preference';

// Each test starts on a freshly loaded page with no stored theme preference so
// the initial state is always predictable (light mode when OS is light, which
// is Playwright's default).
test.describe('Dark Mode', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate((key) => localStorage.removeItem(key), STORAGE_KEY);
    // Reload so useTheme initialises with a clean slate
    await page.reload();
  });

  test.afterEach(async ({ page }) => {
    await page.evaluate((key) => localStorage.removeItem(key), STORAGE_KEY);
  });

  // ---------------------------------------------------------------------------
  // Default state
  // ---------------------------------------------------------------------------
  test('should be in light mode by default when OS preference is light', async ({
    page,
  }) => {
    await expect(page.locator('html')).not.toHaveClass(/\bdark\b/);
  });

  test('should show "Switch to dark mode" button in light mode', async ({
    page,
  }) => {
    await expect(
      page.getByRole('button', { name: 'Switch to dark mode' })
    ).toBeVisible();
  });

  // ---------------------------------------------------------------------------
  // Toggle behaviour
  // ---------------------------------------------------------------------------
  test('should switch to dark mode when the toggle is clicked', async ({
    page,
  }) => {
    await page.getByRole('button', { name: 'Switch to dark mode' }).click();
    await expect(page.locator('html')).toHaveClass(/\bdark\b/);
  });

  test('should show "Switch to light mode" button after switching to dark mode', async ({
    page,
  }) => {
    await page.getByRole('button', { name: 'Switch to dark mode' }).click();
    await expect(
      page.getByRole('button', { name: 'Switch to light mode' })
    ).toBeVisible();
  });

  test('should switch back to light mode when the toggle is clicked again', async ({
    page,
  }) => {
    await page.getByRole('button', { name: 'Switch to dark mode' }).click();
    await page.getByRole('button', { name: 'Switch to light mode' }).click();
    await expect(page.locator('html')).not.toHaveClass(/\bdark\b/);
  });

  test('should restore "Switch to dark mode" label after toggling back to light', async ({
    page,
  }) => {
    await page.getByRole('button', { name: 'Switch to dark mode' }).click();
    await page.getByRole('button', { name: 'Switch to light mode' }).click();
    await expect(
      page.getByRole('button', { name: 'Switch to dark mode' })
    ).toBeVisible();
  });

  // ---------------------------------------------------------------------------
  // localStorage persistence
  // ---------------------------------------------------------------------------
  test('should save "dark" to localStorage after toggling to dark', async ({
    page,
  }) => {
    await page.getByRole('button', { name: 'Switch to dark mode' }).click();
    const stored = await page.evaluate(
      (key) => localStorage.getItem(key),
      STORAGE_KEY
    );
    expect(stored).toBe('dark');
  });

  test('should save "light" to localStorage after toggling back to light', async ({
    page,
  }) => {
    await page.getByRole('button', { name: 'Switch to dark mode' }).click();
    await page.getByRole('button', { name: 'Switch to light mode' }).click();
    const stored = await page.evaluate(
      (key) => localStorage.getItem(key),
      STORAGE_KEY
    );
    expect(stored).toBe('light');
  });

  test('should persist dark mode preference across page reloads', async ({
    page,
  }) => {
    await page.getByRole('button', { name: 'Switch to dark mode' }).click();
    await expect(page.locator('html')).toHaveClass(/\bdark\b/);

    await page.reload();

    await expect(page.locator('html')).toHaveClass(/\bdark\b/);
  });

  test('should persist light mode preference across page reloads after toggling back', async ({
    page,
  }) => {
    // Set dark, then toggle back to light to create an explicit "light" preference
    await page.getByRole('button', { name: 'Switch to dark mode' }).click();
    await page.getByRole('button', { name: 'Switch to light mode' }).click();

    await page.reload();

    await expect(page.locator('html')).not.toHaveClass(/\bdark\b/);
  });

  // ---------------------------------------------------------------------------
  // OS preference (prefers-color-scheme)
  // ---------------------------------------------------------------------------
  test('should respect the OS dark mode preference on first load (no stored preference)', async ({
    page,
  }) => {
    // Emulate a dark OS setting, then reload with no stored preference so
    // useTheme falls back to the system theme.
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.evaluate((key) => localStorage.removeItem(key), STORAGE_KEY);
    await page.reload();

    await expect(page.locator('html')).toHaveClass(/\bdark\b/);
  });

  test('should not revert theme after OS preference changes once user has manually toggled', async ({
    page,
  }) => {
    // Manually switch to dark — sets the hasManualOverride flag inside useTheme
    await page.getByRole('button', { name: 'Switch to dark mode' }).click();
    await expect(page.locator('html')).toHaveClass(/\bdark\b/);

    // Simulate the OS switching to light; the manual override should prevent
    // useTheme from reacting to the MediaQueryList 'change' event.
    await page.emulateMedia({ colorScheme: 'light' });

    // Theme must remain dark
    await expect(page.locator('html')).toHaveClass(/\bdark\b/);
  });

  // ---------------------------------------------------------------------------
  // Dark mode with todo content
  // ---------------------------------------------------------------------------
  test('should render todo list correctly in dark mode', async ({ page }) => {
    // Add a todo, then switch to dark mode and verify it's still visible
    await page.getByPlaceholder('Add a new task...').fill('Dark mode task');
    await page.getByTestId('add-todo-button').click();

    await page.getByRole('button', { name: 'Switch to dark mode' }).click();
    await expect(page.locator('html')).toHaveClass(/\bdark\b/);

    // The todo should still be visible and readable
    await expect(page.getByText('Dark mode task')).toBeVisible();
  });

  test('should handle invalid localStorage value gracefully', async ({
    page,
  }) => {
    await page.evaluate(
      (key) => localStorage.setItem(key, 'not-valid'),
      STORAGE_KEY
    );
    await page.reload();

    // Should fall back to light mode (default OS preference)
    await expect(page.locator('html')).not.toHaveClass(/\bdark\b/);
  });
});
