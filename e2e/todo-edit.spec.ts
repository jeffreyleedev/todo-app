import { test, expect } from './fixtures';

test.describe('Edit', () => {
  test('should enter edit mode via keyboard (Enter) and save', async ({
    todoPage,
  }) => {
    await todoPage.addTodo('Keyboard edit me');
    await todoPage.editTodoViaKeyboard('Keyboard edit me', 'Keyboard saved');

    await expect(todoPage.todoText('Keyboard saved')).toBeVisible();
    await expect(todoPage.todoItem('Keyboard edit me')).toHaveCount(0);
  });

  test('should edit an active todo via double-click and Enter', async ({
    todoPage,
  }) => {
    await todoPage.addTodo('Original text');
    await todoPage.editTodo('Original text', 'Updated text');

    await expect(todoPage.todoText('Updated text')).toBeVisible();
    await expect(todoPage.todoItem('Original text')).toHaveCount(0);
  });

  test('should cancel edit via Escape', async ({ todoPage }) => {
    await todoPage.addTodo('Keep me');
    await todoPage.cancelEdit('Keep me', 'Changed');

    await expect(todoPage.todoText('Keep me')).toBeVisible();
    await expect(todoPage.todoText('Keep me')).toHaveText('Keep me');
  });

  test('should save edit via blur', async ({ todoPage }) => {
    await todoPage.addTodo('Blur me');
    await todoPage.todoText('Blur me').dblclick();
    await todoPage.todoEditInput().fill('Saved on blur');
    await todoPage.todoEditInput().blur();

    await expect(todoPage.todoText('Saved on blur')).toBeVisible();
  });

  test('should not edit a completed todo', async ({ todoPage }) => {
    await todoPage.addTodo('Completed');
    await todoPage.toggleTodo('Completed');

    await todoPage.todoText('Completed').dblclick();

    await expect(todoPage.todoEditInput()).not.toBeAttached();
  });

  test('should not allow entering more than 100 characters', async ({
    todoPage,
  }) => {
    await todoPage.addTodo('Short');

    await todoPage.todoText('Short').dblclick();
    const input = todoPage.todoEditInput();
    await input.pressSequentially('a'.repeat(105));

    await expect(input).toHaveValue('a'.repeat(100));
  });

  test('should not save empty text', async ({ todoPage }) => {
    await todoPage.addTodo('Not empty');

    await todoPage.todoText('Not empty').dblclick();
    const input = todoPage.todoEditInput();
    await input.fill('');
    await input.press('Enter');

    await expect(input).toBeAttached();
    await expect(todoPage.todoEditError()).toBeVisible();
    await expect(todoPage.todoEditError()).toHaveText(
      'Task text cannot be empty.'
    );
    await input.press('Escape');
    await expect(todoPage.todoText('Not empty')).toBeVisible();
  });

  test('should not save duplicate active text', async ({ todoPage }) => {
    await todoPage.addTodo('Existing');
    await todoPage.addTodo('Edit me');

    await todoPage.todoText('Edit me').dblclick();
    const input = todoPage.todoEditInput();
    await input.fill('Existing');
    await input.press('Enter');

    await expect(input).toBeAttached();
    await expect(todoPage.todoEditError()).toBeVisible();
    await expect(todoPage.todoEditError()).toHaveText(
      'A task with this text already exists.'
    );
    await input.press('Escape');
    await expect(todoPage.todoText('Edit me')).toBeVisible();
  });

  test('should persist edited todo on reload', async ({ page, todoPage }) => {
    await todoPage.addTodo('Persist edit');
    await todoPage.editTodo('Persist edit', 'Edited');

    await page.reload();

    await expect(todoPage.todoText('Edited')).toBeVisible();
  });

  test('should show warning counter near character limit', async ({
    todoPage,
  }) => {
    await todoPage.addTodo('Short');

    await todoPage.todoText('Short').dblclick();
    const input = todoPage.todoEditInput();
    await input.fill('a'.repeat(90));

    await expect(todoPage.todoEditCharCounter()).toHaveClass(
      /text-accent-yellow/
    );
  });

  test('should show error counter at character limit', async ({ todoPage }) => {
    await todoPage.addTodo('Short');

    await todoPage.todoText('Short').dblclick();
    const input = todoPage.todoEditInput();
    await input.pressSequentially('a'.repeat(100));

    await expect(todoPage.todoEditCharCounter()).toHaveClass(
      /text-ultraviolet/
    );
  });
});
