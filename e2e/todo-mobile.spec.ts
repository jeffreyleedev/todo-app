import { test, expect } from './fixtures';

test.describe('Todo App - Mobile Viewport', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('should add and delete a todo on mobile', async ({ todoPage }) => {
    await todoPage.addTodo('Mobile task');
    await expect(todoPage.todoText('Mobile task')).toBeVisible();

    // On mobile, delete button is always visible (no hover needed)
    await todoPage.deleteButton('Mobile task').click();
    await expect(todoPage.todoText('Mobile task')).not.toBeVisible();
  });

  test('should filter todos on mobile', async ({ todoPage }) => {
    await todoPage.addTodo('Active');
    await todoPage.addTodo('Completed');
    await todoPage.toggleTodo('Completed');

    await todoPage.filterBy('active');
    await expect(todoPage.todoText('Active')).toBeVisible();
    await expect(todoPage.todoText('Completed')).not.toBeVisible();
  });

  test('should display correct empty state on mobile', async ({ todoPage }) => {
    await expect(
      todoPage.messageByText('No tasks yet. Add one above!')
    ).toBeVisible();
  });

  test('should display "No tasks in this category" when filter hides all on mobile', async ({
    todoPage,
  }) => {
    await todoPage.addTodo('Completed task');
    await todoPage.toggleTodo('Completed task');
    await todoPage.filterBy('active');

    await expect(
      todoPage.messageByText('No tasks in this category.')
    ).toBeVisible();
  });

  test('should prevent duplicate todos on mobile', async ({ todoPage }) => {
    await todoPage.addTodo('Buy milk');

    const input = todoPage.newTodoInput();
    await input.fill('Buy milk');

    const addButton = todoPage.addButton();
    await expect(addButton).toBeDisabled();
  });

  test('should show character counter warning on mobile', async ({
    todoPage,
  }) => {
    const input = todoPage.newTodoInput();
    const charCounter = todoPage.charCounter();

    await input.fill('a'.repeat(90));

    await expect(charCounter).toHaveClass(/text-accent-yellow/);
  });

  test('should show character counter error at limit on mobile', async ({
    todoPage,
  }) => {
    const input = todoPage.newTodoInput();
    const charCounter = todoPage.charCounter();

    await input.fill('a'.repeat(100));

    await expect(charCounter).toHaveClass(/text-ultraviolet/);
  });

  test('should persist todos on reload on mobile', async ({
    page,
    todoPage,
  }) => {
    await todoPage.addTodo('Mobile persistent');

    await page.reload();

    await expect(todoPage.todoText('Mobile persistent')).toBeVisible();
  });

  test('should update priority via click-to-cycle on mobile', async ({
    todoPage,
  }) => {
    await todoPage.addTodo('Mobile cycle');
    await todoPage.priorityPillAddMobile('Mobile cycle').click();

    await expect(todoPage.priorityPill('Mobile cycle')).toBeVisible();
    await expect(todoPage.priorityPill('Mobile cycle')).toHaveText('high');

    await todoPage.priorityPill('Mobile cycle').click();
    await expect(todoPage.priorityPill('Mobile cycle')).toHaveText('medium');
  });

  test('should show mobile add-priority button when no priority is set', async ({
    todoPage,
  }) => {
    await todoPage.addTodo('Mobile ghost');

    await expect(
      todoPage.priorityPillAddMobile('Mobile ghost')
    ).toBeVisible();
  });

  test('should clear completed todos on mobile', async ({ todoPage }) => {
    await todoPage.addTodo('Keep me');
    await todoPage.addTodo('Remove me');
    await todoPage.toggleTodo('Remove me');

    await todoPage.clearCompleted();

    await expect(todoPage.todoText('Remove me')).not.toBeVisible();
    await expect(todoPage.todoText('Keep me')).toBeVisible();
  });

  test('should delete all todos on mobile', async ({ todoPage }) => {
    await todoPage.addTodo('Task 1');
    await todoPage.addTodo('Task 2');

    await todoPage.deleteAll();

    await expect(
      todoPage.messageByText('No tasks yet. Add one above!')
    ).toBeVisible();
  });

  test('should hide Delete all when all todos are completed on mobile', async ({
    todoPage,
  }) => {
    await todoPage.addTodo('Task');
    await todoPage.toggleTodo('Task');

    await expect(todoPage.deleteAllButton()).not.toBeVisible();
    await expect(todoPage.clearCompletedButton()).toBeVisible();
  });

  test('should cancel confirm dialog on mobile', async ({ todoPage }) => {
    await todoPage.addTodo('Task');
    await todoPage.deleteAllButton().click();

    await expect(todoPage.confirmDialog.dialog()).toBeVisible();
    await todoPage.confirmDialog.cancelButton().click();

    await expect(todoPage.todoText('Task')).toBeVisible();
  });

  test('should display singular "item" on mobile', async ({ todoPage }) => {
    const itemsLeft = todoPage.itemsLeft();
    await todoPage.addTodo('Only one');

    await expect(itemsLeft).toHaveText('1 ITEM LEFT');
  });

  test('should edit an active todo on mobile', async ({ todoPage }) => {
    await todoPage.addTodo('Mobile edit');
    await todoPage.editTodo('Mobile edit', 'Edited');

    await expect(todoPage.todoText('Edited')).toBeVisible();
  });

  test('should enforce character limit when editing on mobile', async ({
    todoPage,
  }) => {
    await todoPage.addTodo('Short');

    await todoPage.todoText('Short').dblclick();
    const input = todoPage.todoEditInput();
    await input.pressSequentially('a'.repeat(105));

    await expect(input).toHaveValue('a'.repeat(100));
  });

  test('should drag-and-drop reorder on mobile', async ({ todoPage }) => {
    await todoPage.addTodo('Mobile A');
    await todoPage.addTodo('Mobile B');
    await todoPage.addTodo('Mobile C');

    await todoPage.dragTodoAbove('Mobile C', 'Mobile A');

    const texts = await todoPage.getAllTodoTexts();
    expect(texts).toEqual(['Mobile C', 'Mobile A', 'Mobile B']);
  });
});
