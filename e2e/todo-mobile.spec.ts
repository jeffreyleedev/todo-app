import { test, expect } from './fixtures';

test.describe('Todo App - Mobile Viewport', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('should add and delete a todo on mobile', async ({ todoPage }) => {
    await todoPage.addTodo('Mobile task');
    await expect(todoPage.getTodoText('Mobile task')).toBeVisible();

    // On mobile, delete button is always visible (no hover needed)
    await todoPage.getDeleteButton('Mobile task').click();
    await expect(todoPage.getTodoText('Mobile task')).not.toBeVisible();
  });

  test('should filter todos on mobile', async ({ todoPage }) => {
    await todoPage.addTodo('Active');
    await todoPage.addTodo('Completed');
    await todoPage.toggleTodo('Completed');

    await todoPage.filterBy('active');
    await expect(todoPage.getTodoText('Active')).toBeVisible();
    await expect(todoPage.getTodoText('Completed')).not.toBeVisible();
  });

  test('should display correct empty state on mobile', async ({ todoPage }) => {
    await expect(
      todoPage.getMessageByText('No tasks yet. Add one above!')
    ).toBeVisible();
  });

  test('should display "No tasks in this category" when filter hides all on mobile', async ({
    todoPage,
  }) => {
    await todoPage.addTodo('Completed task');
    await todoPage.toggleTodo('Completed task');
    await todoPage.filterBy('active');

    await expect(
      todoPage.getMessageByText('No tasks in this category.')
    ).toBeVisible();
  });

  test('should prevent duplicate todos on mobile', async ({ todoPage }) => {
    await todoPage.addTodo('Buy milk');

    const input = todoPage.getNewTodoInput();
    await input.fill('Buy milk');

    const addButton = todoPage.getAddButton();
    await expect(addButton).toBeDisabled();
  });

  test('should show character counter warning on mobile', async ({
    todoPage,
  }) => {
    const input = todoPage.getNewTodoInput();
    const charCounter = todoPage.getCharCounter();

    await input.fill('a'.repeat(90));

    await expect(charCounter).toHaveClass(/text-warning/);
  });

  test('should show character counter error at limit on mobile', async ({
    todoPage,
  }) => {
    const input = todoPage.getNewTodoInput();
    const charCounter = todoPage.getCharCounter();

    await input.fill('a'.repeat(100));

    await expect(charCounter).toHaveClass(/text-error/);
  });

  test('should persist todos on reload on mobile', async ({
    page,
    todoPage,
  }) => {
    await todoPage.addTodo('Mobile persistent');

    await page.reload();

    await expect(todoPage.getTodoText('Mobile persistent')).toBeVisible();
  });

  test('should update priority via click-to-cycle on mobile', async ({
    todoPage,
  }) => {
    await todoPage.addTodo('Mobile cycle');
    await todoPage.getPriorityPillAdd('Mobile cycle').click();

    await expect(todoPage.getPriorityPill('Mobile cycle')).toBeVisible();
    await expect(todoPage.getPriorityPill('Mobile cycle')).toHaveText('high');

    await todoPage.getPriorityPill('Mobile cycle').click();
    await expect(todoPage.getPriorityPill('Mobile cycle')).toHaveText('medium');
  });

  test('should show ghost priority pill on mobile without hover', async ({
    todoPage,
  }) => {
    await todoPage.addTodo('Mobile ghost');

    await expect(todoPage.getPriorityPillAdd('Mobile ghost')).toBeVisible();
  });

  test('should clear completed todos on mobile', async ({ todoPage }) => {
    await todoPage.addTodo('Keep me');
    await todoPage.addTodo('Remove me');
    await todoPage.toggleTodo('Remove me');

    await todoPage.clearCompleted();

    await expect(todoPage.getTodoText('Remove me')).not.toBeVisible();
    await expect(todoPage.getTodoText('Keep me')).toBeVisible();
  });

  test('should delete all todos on mobile', async ({ todoPage }) => {
    await todoPage.addTodo('Task 1');
    await todoPage.addTodo('Task 2');

    await todoPage.deleteAll();

    await expect(
      todoPage.getMessageByText('No tasks yet. Add one above!')
    ).toBeVisible();
  });

  test('should hide Delete all when all todos are completed on mobile', async ({
    todoPage,
  }) => {
    await todoPage.addTodo('Task');
    await todoPage.toggleTodo('Task');

    await expect(todoPage.getDeleteAllButton()).not.toBeVisible();
    await expect(todoPage.getClearCompletedButton()).toBeVisible();
  });

  test('should cancel confirm dialog on mobile', async ({ todoPage }) => {
    await todoPage.addTodo('Task');
    await todoPage.getDeleteAllButton().click();

    await expect(todoPage.confirmDialog.getDialog()).toBeVisible();
    await todoPage.confirmDialog.getCancelButton().click();

    await expect(todoPage.getTodoText('Task')).toBeVisible();
  });

  test('should display singular "item" on mobile', async ({ todoPage }) => {
    const itemsLeft = todoPage.getItemsLeft();
    await todoPage.addTodo('Only one');

    await expect(itemsLeft).toHaveText('1 item left');
  });

  test('should edit an active todo on mobile', async ({ todoPage }) => {
    await todoPage.addTodo('Mobile edit');
    await todoPage.editTodo('Mobile edit', 'Edited');

    await expect(todoPage.getTodoText('Edited')).toBeVisible();
  });

  test('should enforce character limit when editing on mobile', async ({
    todoPage,
  }) => {
    await todoPage.addTodo('Short');

    await todoPage.getTodoText('Short').dblclick();
    const input = todoPage.getTodoEditInput();
    await input.fill('a'.repeat(105));

    await expect(input).toHaveValue('a'.repeat(100));
  });

  test('should drag-and-drop reorder on mobile', async ({ todoPage }) => {
    await todoPage.addTodo('Mobile A');
    await todoPage.addTodo('Mobile B');
    await todoPage.addTodo('Mobile C');

    await todoPage.dragTodoAbove('Mobile C', 'Mobile A');

    const texts = await todoPage.page
      .getByTestId('todo-text')
      .allTextContents();
    expect(texts).toEqual(['Mobile C', 'Mobile A', 'Mobile B']);
  });
});
