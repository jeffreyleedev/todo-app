import { test as base } from '@playwright/test';
import { TodoPage } from './pages/TodoPage';

export const test = base.extend<{
  todoPage: TodoPage;
}>({
  todoPage: async ({ page }, use) => {
    const clearStorageSafely = () =>
      page.evaluate(() => {
        try {
          localStorage.clear();
        } catch {
          /* noop: localStorage may not be available */
        }
      });

    const todoPage = new TodoPage(page);
    await todoPage.goto();
    await clearStorageSafely();
    await use(todoPage);
    await clearStorageSafely();
  },
});

export { expect } from '@playwright/test';
