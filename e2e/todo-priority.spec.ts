import { test, expect } from './fixtures';

test.describe('Priority', () => {
  test('should add a todo without priority', async ({ todoPage }) => {
    await todoPage.addTodo('No priority');

    const link = todoPage.todoItem('No priority');
    await expect(link).toBeVisible();
    await expect(todoPage.priorityPillAdd('No priority')).toBeAttached();
  });

  test('should set priority on an item that has none', async ({ todoPage }) => {
    await todoPage.addTodo('Set priority');

    await todoPage.addPriorityToItem('Set priority');

    await expect(todoPage.priorityPill('Set priority')).toBeVisible();
    await expect(todoPage.priorityPill('Set priority')).toHaveText('high');
  });

  test('should cycle priority on an existing item', async ({ todoPage }) => {
    await todoPage.addTodo('Cycle me');
    await todoPage.addPriorityToItem('Cycle me');

    const pill = todoPage.priorityPill('Cycle me');
    await expect(pill).toHaveText('high');

    await pill.click();
    await expect(pill).toHaveText('medium');

    await pill.click();
    await expect(pill).toHaveText('low');

    await pill.click();
    await expect(pill).not.toBeAttached();
  });

  test('should persist priority after page reload', async ({
    page,
    todoPage,
  }) => {
    await todoPage.addTodo('Persist priority');
    await todoPage.addPriorityToItem('Persist priority');

    await page.reload();

    await expect(todoPage.priorityPill('Persist priority')).toBeVisible();
    await expect(todoPage.priorityPill('Persist priority')).toHaveText('high');
  });

  test('should hide priority pill when item is completed', async ({
    todoPage,
  }) => {
    await todoPage.addTodo('Complete me');
    await todoPage.addPriorityToItem('Complete me');

    await todoPage.toggleTodo('Complete me');

    await expect(todoPage.priorityPill('Complete me')).not.toBeAttached();
    await expect(todoPage.priorityPillAdd('Complete me')).not.toBeAttached();
  });

  test('should render the correct color class for each priority level', async ({
    todoPage,
  }) => {
    await todoPage.addTodo('Color high');
    await todoPage.addPriorityToItem('Color high');

    await todoPage.addTodo('Color medium');
    await todoPage.addPriorityToItem('Color medium');
    await todoPage.priorityPill('Color medium').click();

    await todoPage.addTodo('Color low');
    await todoPage.addPriorityToItem('Color low');
    await todoPage.priorityPill('Color low').click();
    await todoPage.priorityPill('Color low').click();

    await expect(todoPage.priorityPill('Color high')).toHaveClass(
      /bg-ultraviolet/
    );
    await expect(todoPage.priorityPill('Color medium')).toHaveClass(
      /bg-accent-yellow/
    );
    await expect(todoPage.priorityPill('Color low')).toHaveClass(/bg-mint/);
  });
});
