import { test, expect } from './fixtures';

test.describe('Todo App', () => {
  test('should add a new todo', async ({ todoPage }) => {
    const input = todoPage.getNewTodoInput();
    await input.fill('Buy milk');
    await todoPage.getAddButton().click();

    await expect(todoPage.getTodoText('Buy milk')).toBeVisible();
    await expect(input).toHaveValue('');
  });

  test('should mark a todo as completed', async ({ todoPage }) => {
    await todoPage.addTodo('Buy milk');
    await todoPage.toggleTodo('Buy milk');

    await expect(todoPage.getTodoText('Buy milk')).toHaveClass(/line-through/);
  });

  test('should filter todos', async ({ todoPage }) => {
    await todoPage.addTodo('Active task');
    await todoPage.addTodo('Completed task');
    await todoPage.toggleTodo('Completed task');

    await todoPage.filterBy('active');
    await expect(todoPage.getTodoText('Active task')).toBeVisible();
    await expect(todoPage.getTodoText('Completed task')).not.toBeVisible();

    await todoPage.filterBy('completed');
    await expect(todoPage.getTodoText('Active task')).not.toBeVisible();
    await expect(todoPage.getTodoText('Completed task')).toBeVisible();

    await todoPage.filterBy('all');
    await expect(todoPage.getTodoText('Active task')).toBeVisible();
    await expect(todoPage.getTodoText('Completed task')).toBeVisible();
  });

  test('should delete a todo', async ({ todoPage }) => {
    await todoPage.addTodo('Delete me');
    await todoPage.deleteTodo('Delete me');

    await expect(todoPage.getTodoText('Delete me')).not.toBeVisible();
  });

  test('should persist todos on reload', async ({ page, todoPage }) => {
    await todoPage.addTodo('Persistent task');
    await expect(todoPage.getTodoText('Persistent task')).toBeVisible();

    await page.reload();

    await expect(todoPage.getTodoText('Persistent task')).toBeVisible();
  });

  test('should clear completed todos', async ({ todoPage }) => {
    await todoPage.addTodo('Task 1');
    await todoPage.addTodo('Task 2');
    await todoPage.toggleTodo('Task 1');
    await todoPage.clearCompleted();

    await expect(todoPage.getTodoText('Task 1')).not.toBeVisible();
    await expect(todoPage.getTodoText('Task 2')).toBeVisible();
  });

  test('should display the correct number of items left through a full lifecycle', async ({
    todoPage,
  }) => {
    const itemsLeft = todoPage.getItemsLeft();
    await expect(itemsLeft).toHaveText('0 items left');

    await todoPage.addTodo('Task A');
    await todoPage.addTodo('Task B');
    await expect(itemsLeft).toHaveText('2 items left');

    await todoPage.toggleTodo('Task A');
    await expect(itemsLeft).toHaveText('1 item left');

    await todoPage.deleteTodo('Task B');
    await expect(itemsLeft).toHaveText('0 items left');
  });

  test('should display "No tasks yet. Add one above!" when the list is empty by default', async ({
    todoPage,
  }) => {
    await expect(
      todoPage.getMessageByText('No tasks yet. Add one above!')
    ).toBeVisible();
  });

  test('should display "No tasks in this category." when the current filter has no matching todos', async ({
    todoPage,
  }) => {
    await todoPage.addTodo('Completed task');
    await todoPage.toggleTodo('Completed task');
    await todoPage.filterBy('active');

    await expect(
      todoPage.getMessageByText('No tasks in this category.')
    ).toBeVisible();
  });

  test('should not add a todo when input is empty', async ({ todoPage }) => {
    const addButton = todoPage.getAddButton();
    await expect(addButton).toBeDisabled();

    // Pressing enter should also not add it (since form prevents empty submit)
    const input = todoPage.getNewTodoInput();
    await input.focus();
    await input.press('Enter');

    await expect(
      todoPage.getMessageByText('No tasks yet. Add one above!')
    ).toBeVisible();
  });

  test('should trim whitespace from input before adding', async ({
    todoPage,
  }) => {
    const input = todoPage.getNewTodoInput();
    await input.fill('  Trim me  ');
    await todoPage.getAddButton().click();

    await expect(todoPage.getTodoText('Trim me')).toBeVisible();

    // Verify the stored text was trimmed, not the raw input
    const todoText = todoPage.getTodoText('Trim me');
    await expect(todoText).toHaveText('Trim me');
  });

  test('should mark a completed todo as active again when toggled', async ({
    todoPage,
  }) => {
    await todoPage.addTodo('Toggle back');
    await todoPage.toggleTodo('Toggle back');
    await expect(todoPage.getTodoText('Toggle back')).toHaveClass(
      /line-through/
    );

    await todoPage.toggleTodo('Toggle back');
    await expect(todoPage.getTodoText('Toggle back')).not.toHaveClass(
      /line-through/
    );
  });

  test('should add a todo using only the keyboard', async ({ todoPage }) => {
    const input = todoPage.getNewTodoInput();
    await input.focus();
    await input.fill('Keyboard task');
    await input.press('Enter');

    await expect(todoPage.getTodoText('Keyboard task')).toBeVisible();
  });

  test('should not allow entering more than 100 characters', async ({
    todoPage,
  }) => {
    const input = todoPage.getNewTodoInput();
    const longText = 'a'.repeat(105);

    await input.fill(longText);

    await expect(input).toHaveValue('a'.repeat(100));
  });

  test('should show warning color when near character limit', async ({
    todoPage,
  }) => {
    const input = todoPage.getNewTodoInput();
    const charCounter = todoPage.getCharCounter();

    await input.fill('a'.repeat(90));

    await expect(charCounter).toHaveClass(/text-warning/);
  });

  test('should show error color when at character limit', async ({
    todoPage,
  }) => {
    const input = todoPage.getNewTodoInput();
    const charCounter = todoPage.getCharCounter();

    await input.fill('a'.repeat(100));

    await expect(charCounter).toHaveClass(/text-error/);
  });

  test('should show separator between active and completed todos', async ({
    todoPage,
  }) => {
    await todoPage.addTodo('Active todo');
    await todoPage.addTodo('Completed todo');
    await todoPage.toggleTodo('Completed todo');

    const separator = todoPage.getSeparator();
    await expect(separator).toBeVisible();
  });

  test('should delete all todos', async ({ todoPage }) => {
    await todoPage.addTodo('Task 1');
    await todoPage.addTodo('Task 2');
    await todoPage.addTodo('Task 3');

    await todoPage.deleteAll();

    await expect(todoPage.getTodoText('Task 1')).not.toBeVisible();
    await expect(todoPage.getTodoText('Task 2')).not.toBeVisible();
    await expect(todoPage.getTodoText('Task 3')).not.toBeVisible();
  });

  test('should hide Delete all when all todos are completed on the All filter', async ({
    todoPage,
  }) => {
    await todoPage.addTodo('Task');
    await todoPage.toggleTodo('Task');

    await expect(todoPage.getDeleteAllButton()).not.toBeVisible();
    await expect(todoPage.getClearCompletedButton()).toBeVisible();
  });

  test('should display singular "item" for exactly one active todo', async ({
    todoPage,
  }) => {
    const itemsLeft = todoPage.getItemsLeft();
    await todoPage.addTodo('Single task');

    await expect(itemsLeft).toHaveText('1 item left');
  });

  test('should display page title and subtitle', async ({ todoPage }) => {
    await expect(todoPage.getHeading()).toBeVisible();
    await expect(todoPage.getSubtitle()).toBeVisible();
  });

  test('should show check icon inside checkbox when todo is completed', async ({
    todoPage,
  }) => {
    await todoPage.addTodo('Completed task');
    await todoPage.toggleTodo('Completed task');

    const checkIcon = todoPage.getCheckIconLocator('Completed task');

    await expect(checkIcon).toBeVisible();
  });

  test('should highlight the active filter button', async ({ todoPage }) => {
    await todoPage.addTodo('Task');

    await todoPage.filterBy('active');
    await expect(todoPage.getFilterButton('active')).toHaveClass(
      /text-primary/
    );
    await expect(todoPage.getFilterButton('all')).not.toHaveClass(
      /text-primary/
    );

    await todoPage.filterBy('completed');
    await expect(todoPage.getFilterButton('completed')).toHaveClass(
      /text-primary/
    );
  });

  test('should not add a duplicate active todo', async ({ todoPage }) => {
    await todoPage.addTodo('Buy milk');

    const input = todoPage.getNewTodoInput();
    await input.fill('Buy milk');

    const addButton = todoPage.getAddButton();
    await expect(addButton).toBeDisabled();

    await input.press('Enter');
    const todos = todoPage.getTodoItem('Buy milk');
    await expect(todos).toHaveCount(1);
  });

  test('should treat duplicates case-insensitively', async ({ todoPage }) => {
    await todoPage.addTodo('Buy milk');

    const input = todoPage.getNewTodoInput();
    await input.fill('buy MILK');

    const addButton = todoPage.getAddButton();
    await expect(addButton).toBeDisabled();
  });

  test('should treat trimmed duplicates as duplicates', async ({
    todoPage,
  }) => {
    await todoPage.addTodo('Buy milk');

    const input = todoPage.getNewTodoInput();
    await input.fill('  Buy milk  ');

    const addButton = todoPage.getAddButton();
    await expect(addButton).toBeDisabled();
  });

  test('should allow re-adding a completed todo', async ({ todoPage }) => {
    await todoPage.addTodo('Buy milk');
    await todoPage.toggleTodo('Buy milk');

    const input = todoPage.getNewTodoInput();
    await input.fill('Buy milk');

    const addButton = todoPage.getAddButton();
    await expect(addButton).toBeEnabled();
  });

  test('should allow re-adding a deleted todo', async ({ todoPage }) => {
    await todoPage.addTodo('Buy milk');
    await todoPage.deleteTodo('Buy milk');

    const input = todoPage.getNewTodoInput();
    await input.fill('Buy milk');

    const addButton = todoPage.getAddButton();
    await expect(addButton).toBeEnabled();
  });

  test('should re-enable button when duplicate is edited to unique text', async ({
    todoPage,
  }) => {
    await todoPage.addTodo('Buy milk');

    const input = todoPage.getNewTodoInput();
    await input.fill('Buy milk');

    const addButton = todoPage.getAddButton();
    await expect(addButton).toBeDisabled();

    await input.fill('Buy eggs');
    await expect(addButton).toBeEnabled();
  });

  test('should not add a duplicate via keyboard Enter', async ({
    todoPage,
  }) => {
    await todoPage.addTodo('Buy milk');

    const input = todoPage.getNewTodoInput();
    await input.fill('Buy milk');
    await input.press('Enter');

    const todos = todoPage.getTodoItem('Buy milk');
    await expect(todos).toHaveCount(1);
  });

  test('should clear input after successful submission', async ({
    todoPage,
  }) => {
    const input = todoPage.getNewTodoInput();

    await input.fill('Clear me');
    await todoPage.getAddButton().click();

    await expect(input).toHaveValue('');

    await input.fill('Another task');
    await input.press('Enter');

    await expect(input).toHaveValue('');
  });

  test('should reorder todos via drag and drop', async ({ todoPage }) => {
    await todoPage.addTodo('Task A');
    await todoPage.addTodo('Task B');
    await todoPage.addTodo('Task C');

    // Drag Task C above Task A
    await todoPage.dragTodoAbove('Task C', 'Task A');

    const todoTexts = await todoPage.page
      .getByTestId('todo-text')
      .allTextContents();
    expect(todoTexts).toEqual(['Task C', 'Task A', 'Task B']);
  });

  test('should persist reordered todos on reload', async ({
    page,
    todoPage,
  }) => {
    await todoPage.addTodo('Task A');
    await todoPage.addTodo('Task B');

    await todoPage.dragTodoAbove('Task B', 'Task A');

    let todoTexts = await todoPage.page
      .getByTestId('todo-text')
      .allTextContents();
    expect(todoTexts).toEqual(['Task B', 'Task A']);

    await page.reload();

    todoTexts = await todoPage.page.getByTestId('todo-text').allTextContents();
    expect(todoTexts).toEqual(['Task B', 'Task A']);
  });

  test('should dismiss confirm dialog via close (X) button without acting', async ({
    todoPage,
  }) => {
    await todoPage.addTodo('Task');
    await todoPage.addTodo('Completed task');
    await todoPage.toggleTodo('Completed task');

    await todoPage.getClearCompletedButton().click();
    await expect(todoPage.confirmDialog.getDialog()).toBeVisible();
    await todoPage.confirmDialog.getCloseButton().click();

    await expect(todoPage.getTodoText('Completed task')).toBeVisible();
  });

  test('should be able to clear completed when filter is completed', async ({
    todoPage,
  }) => {
    await todoPage.addTodo('Active');
    await todoPage.addTodo('Done');
    await todoPage.toggleTodo('Done');

    await todoPage.filterBy('completed');
    await todoPage.clearCompleted();

    await expect(todoPage.getTodoText('Done')).not.toBeVisible();
    await todoPage.filterBy('all');
    await expect(todoPage.getTodoText('Active')).toBeVisible();
  });

  test('should add a todo with exactly 100 characters', async ({
    todoPage,
  }) => {
    const input = todoPage.getNewTodoInput();
    const hundredChars = 'a'.repeat(100);

    await input.fill(hundredChars);
    await todoPage.getAddButton().click();

    await expect(todoPage.getTodoText(hundredChars)).toBeVisible();
  });

  test('should maintain order when drag-and-drop with mixed active and completed items', async ({
    todoPage,
  }) => {
    await todoPage.addTodo('Active A');
    await todoPage.addTodo('Active B');
    await todoPage.addTodo('Done C');
    await todoPage.toggleTodo('Done C');

    // Drag Active B above Active A — completed items should stay in their section
    await todoPage.dragTodoAbove('Active B', 'Active A');

    const texts = await todoPage.page
      .getByTestId('todo-text')
      .allTextContents();
    expect(texts.slice(0, 2)).toEqual(['Active B', 'Active A']);
    expect(texts[2]).toBe('Done C');
  });

  test('should show confirm dialog with correct accessibility attributes', async ({
    todoPage,
  }) => {
    await todoPage.addTodo('Task');
    await todoPage.getDeleteAllButton().click();

    const dialog = todoPage.confirmDialog.getDialog();
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAttribute('role', 'dialog');
    await expect(dialog).toHaveAttribute('aria-modal', 'true');
  });

  test.describe('Edit', () => {
    test('should edit an active todo via double-click and Enter', async ({
      todoPage,
    }) => {
      await todoPage.addTodo('Original text');
      await todoPage.editTodo('Original text', 'Updated text');

      await expect(todoPage.getTodoText('Updated text')).toBeVisible();
      await expect(todoPage.getTodoItem('Original text')).toHaveCount(0);
    });

    test('should cancel edit via Escape', async ({ todoPage }) => {
      await todoPage.addTodo('Keep me');
      await todoPage.cancelEdit('Keep me', 'Changed');

      await expect(todoPage.getTodoText('Keep me')).toBeVisible();
      await expect(todoPage.getTodoText('Keep me')).toHaveText('Keep me');
    });

    test('should save edit via blur', async ({ todoPage }) => {
      await todoPage.addTodo('Blur me');
      await todoPage.getTodoText('Blur me').dblclick();
      await todoPage.getTodoEditInput().fill('Saved on blur');
      await todoPage.getTodoEditInput().blur();

      await expect(todoPage.getTodoText('Saved on blur')).toBeVisible();
    });

    test('should not edit a completed todo', async ({ todoPage }) => {
      await todoPage.addTodo('Completed');
      await todoPage.toggleTodo('Completed');

      await todoPage.getTodoText('Completed').dblclick();

      await expect(todoPage.getTodoEditInput()).not.toBeAttached();
    });

    test('should not allow entering more than 100 characters', async ({
      todoPage,
    }) => {
      await todoPage.addTodo('Short');

      await todoPage.getTodoText('Short').dblclick();
      const input = todoPage.getTodoEditInput();
      await input.pressSequentially('a'.repeat(105));

      await expect(input).toHaveValue('a'.repeat(100));
    });

    test('should not save empty text', async ({ todoPage }) => {
      await todoPage.addTodo('Not empty');

      await todoPage.getTodoText('Not empty').dblclick();
      const input = todoPage.getTodoEditInput();
      await input.fill('');
      await input.press('Enter');

      await expect(input).toBeAttached();
      await expect(input).toHaveValue('');
    });

    test('should not save duplicate active text', async ({ todoPage }) => {
      await todoPage.addTodo('Existing');
      await todoPage.addTodo('Edit me');

      await todoPage.getTodoText('Edit me').dblclick();
      const input = todoPage.getTodoEditInput();
      await input.fill('Existing');
      await input.press('Enter');

      await expect(input).toBeAttached();
      await expect(input).toHaveValue('Existing');
    });

    test('should persist edited todo on reload', async ({ page, todoPage }) => {
      await todoPage.addTodo('Persist edit');
      await todoPage.editTodo('Persist edit', 'Edited');

      await page.reload();

      await expect(todoPage.getTodoText('Edited')).toBeVisible();
    });

    test('should show warning counter near character limit', async ({
      todoPage,
    }) => {
      await todoPage.addTodo('Short');

      await todoPage.getTodoText('Short').dblclick();
      const input = todoPage.getTodoEditInput();
      await input.fill('a'.repeat(90));

      await expect(todoPage.getTodoEditCharCounter()).toHaveClass(
        /text-warning/
      );
    });

    test('should show error counter at character limit', async ({
      todoPage,
    }) => {
      await todoPage.addTodo('Short');

      await todoPage.getTodoText('Short').dblclick();
      const input = todoPage.getTodoEditInput();
      await input.pressSequentially('a'.repeat(100));

      await expect(todoPage.getTodoEditCharCounter()).toHaveClass(/text-error/);
    });
  });

  test.describe('Priority', () => {
    test('should add a todo without priority', async ({ todoPage }) => {
      await todoPage.addTodo('No priority');

      const link = todoPage.getTodoItem('No priority');
      await expect(link).toBeVisible();
      await expect(todoPage.getPriorityPillAdd('No priority')).toBeAttached();
    });

    test('should set priority on an item that has none', async ({
      todoPage,
    }) => {
      await todoPage.addTodo('Set priority');

      const item = todoPage.getTodoItem('Set priority');
      await item.hover();
      await todoPage.getPriorityPillAdd('Set priority').click();

      await expect(todoPage.getPriorityPill('Set priority')).toBeVisible();
      await expect(todoPage.getPriorityPill('Set priority')).toHaveText('high');
    });

    test('should cycle priority on an existing item', async ({ todoPage }) => {
      await todoPage.addTodo('Cycle me');
      await todoPage.getTodoItem('Cycle me').hover();
      await todoPage.getPriorityPillAdd('Cycle me').click();

      const pill = todoPage.getPriorityPill('Cycle me');
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
      await todoPage.getTodoItem('Persist priority').hover();
      await todoPage.getPriorityPillAdd('Persist priority').click();

      await page.reload();

      await expect(todoPage.getPriorityPill('Persist priority')).toBeVisible();
      await expect(todoPage.getPriorityPill('Persist priority')).toHaveText(
        'high'
      );
    });

    test('should hide priority pill when item is completed', async ({
      todoPage,
    }) => {
      await todoPage.addTodo('Complete me');
      await todoPage.getTodoItem('Complete me').hover();
      await todoPage.getPriorityPillAdd('Complete me').click();

      await todoPage.toggleTodo('Complete me');

      await expect(todoPage.getPriorityPill('Complete me')).not.toBeAttached();
      await expect(
        todoPage.getPriorityPillAdd('Complete me')
      ).not.toBeAttached();
    });

    test('should render the correct color class for each priority level', async ({
      todoPage,
    }) => {
      await todoPage.addTodo('Color high');
      await todoPage.getTodoItem('Color high').hover();
      await todoPage.getPriorityPillAdd('Color high').click();

      await todoPage.addTodo('Color medium');
      await todoPage.getTodoItem('Color medium').hover();
      await todoPage.getPriorityPillAdd('Color medium').click();
      await todoPage.getPriorityPill('Color medium').click();

      await todoPage.addTodo('Color low');
      await todoPage.getTodoItem('Color low').hover();
      await todoPage.getPriorityPillAdd('Color low').click();
      await todoPage.getPriorityPill('Color low').click();
      await todoPage.getPriorityPill('Color low').click();

      await expect(todoPage.getPriorityPill('Color high')).toHaveClass(
        /bg-error-container/
      );
      await expect(todoPage.getPriorityPill('Color medium')).toHaveClass(
        /bg-tertiary-container/
      );
      await expect(todoPage.getPriorityPill('Color low')).toHaveClass(
        /bg-secondary-container/
      );
    });
  });
});
