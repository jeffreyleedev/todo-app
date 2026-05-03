import { test as base } from '@playwright/test';
import { TodoPage } from './pages/TodoPage';

export const test = base.extend<{
  todoPage: TodoPage;
}>({
  todoPage: async ({ page }, use) => {
    const todoPage = new TodoPage(page);
    await todoPage.goto();
    await page.evaluate(() => {
      try {
        localStorage.clear();
      } catch {
        /* noop: localStorage may not be available */
      }
    });
    await use(todoPage);
    await page.evaluate(() => {
      try {
        localStorage.clear();
      } catch {
        /* noop: localStorage may not be available */
      }
    });
  },
});

export { expect } from '@playwright/test';
