import { test, expect } from './fixtures';

test.describe('Theme toggle', () => {
  test('should switch html class on toggle click', async ({
    page,
    todoPage,
  }) => {
    const initialClass = await page.evaluate(
      () => document.documentElement.className
    );
    const isDark = !initialClass.includes('light');

    await todoPage.themeToggle().click();

    const afterClass = await page.evaluate(
      () => document.documentElement.className
    );

    if (isDark) {
      expect(afterClass).toContain('light');
    } else {
      expect(afterClass).not.toContain('light');
    }
  });

  test('should persist theme preference on reload', async ({
    page,
    todoPage,
  }) => {
    await todoPage.themeToggle().click();

    const classAfterToggle = await page.evaluate(
      () => document.documentElement.className
    );

    await page.reload();

    const classAfterReload = await page.evaluate(
      () => document.documentElement.className
    );

    expect(classAfterReload).toBe(classAfterToggle);
  });
});
