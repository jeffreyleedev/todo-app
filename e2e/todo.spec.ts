import { test, expect } from './fixtures';

test.describe('Todo App', () => {
  test('should add a new todo', async ({ todoPage }) => {
    const input = todoPage.newTodoInput();
    await input.fill('Buy milk');
    await todoPage.addButton().click();

    await expect(todoPage.todoText('Buy milk')).toBeVisible();
    await expect(input).toHaveValue('');
  });

  test('should mark a todo as completed', async ({ todoPage }) => {
    await todoPage.addTodo('Buy milk');
    await todoPage.toggleTodo('Buy milk');

    await expect(todoPage.todoText('Buy milk')).toHaveClass(/line-through/);
  });

  test('should filter todos', async ({ todoPage }) => {
    await todoPage.addTodo('Active task');
    await todoPage.addTodo('Completed task');
    await todoPage.toggleTodo('Completed task');

    await todoPage.filterBy('active');
    await expect(todoPage.todoText('Active task')).toBeVisible();
    await expect(todoPage.todoText('Completed task')).not.toBeVisible();

    await todoPage.filterBy('completed');
    await expect(todoPage.todoText('Active task')).not.toBeVisible();
    await expect(todoPage.todoText('Completed task')).toBeVisible();

    await todoPage.filterBy('all');
    await expect(todoPage.todoText('Active task')).toBeVisible();
    await expect(todoPage.todoText('Completed task')).toBeVisible();
  });

  test('should delete a todo', async ({ todoPage }) => {
    await todoPage.addTodo('Delete me');
    await todoPage.deleteTodo('Delete me');

    await expect(todoPage.todoText('Delete me')).not.toBeVisible();
  });

  test('should persist todos on reload', async ({ page, todoPage }) => {
    await todoPage.addTodo('Persistent task');
    await expect(todoPage.todoText('Persistent task')).toBeVisible();

    await page.reload();

    await expect(todoPage.todoText('Persistent task')).toBeVisible();
  });

  test('should clear completed todos', async ({ todoPage }) => {
    await todoPage.addTodo('Task 1');
    await todoPage.addTodo('Task 2');
    await todoPage.toggleTodo('Task 1');
    await todoPage.clearCompleted();

    await expect(todoPage.todoText('Task 1')).not.toBeVisible();
    await expect(todoPage.todoText('Task 2')).toBeVisible();
  });

  test('should display the correct number of items left through a full lifecycle', async ({
    todoPage,
  }) => {
    const itemsLeft = todoPage.itemsLeft();
    await expect(itemsLeft).toHaveText('0 ITEMS LEFT');

    await todoPage.addTodo('Task A');
    await todoPage.addTodo('Task B');
    await expect(itemsLeft).toHaveText('2 ITEMS LEFT');

    await todoPage.toggleTodo('Task A');
    await expect(itemsLeft).toHaveText('1 ITEM LEFT');

    await todoPage.deleteTodo('Task B');
    await expect(itemsLeft).toHaveText('0 ITEMS LEFT');
  });

  test('should display "No tasks yet. Add one above!" when the list is empty by default', async ({
    todoPage,
  }) => {
    await expect(
      todoPage.messageByText('No tasks yet. Add one above!')
    ).toBeVisible();
  });

  test('should display "No tasks in this category." when the current filter has no matching todos', async ({
    todoPage,
  }) => {
    await todoPage.addTodo('Completed task');
    await todoPage.toggleTodo('Completed task');
    await todoPage.filterBy('active');

    await expect(
      todoPage.messageByText('No tasks in this category.')
    ).toBeVisible();
  });

  test('should not add a todo when input is empty', async ({ todoPage }) => {
    const addButton = todoPage.addButton();
    await expect(addButton).toBeDisabled();

    // Pressing enter should also not add it (since form prevents empty submit)
    const input = todoPage.newTodoInput();
    await input.focus();
    await input.press('Enter');

    await expect(
      todoPage.messageByText('No tasks yet. Add one above!')
    ).toBeVisible();
  });

  test('should trim whitespace from input before adding', async ({
    todoPage,
  }) => {
    const input = todoPage.newTodoInput();
    await input.fill('  Trim me  ');
    await todoPage.addButton().click();

    await expect(todoPage.todoText('Trim me')).toBeVisible();

    // Verify the stored text was trimmed, not the raw input
    const todoText = todoPage.todoText('Trim me');
    await expect(todoText).toHaveText('Trim me');
  });

  test('should mark a completed todo as active again when toggled', async ({
    todoPage,
  }) => {
    await todoPage.addTodo('Toggle back');
    await todoPage.toggleTodo('Toggle back');
    await expect(todoPage.todoText('Toggle back')).toHaveClass(/line-through/);

    await todoPage.toggleTodo('Toggle back');
    await expect(todoPage.todoText('Toggle back')).not.toHaveClass(
      /line-through/
    );
  });

  test('should add a todo using only the keyboard', async ({ todoPage }) => {
    const input = todoPage.newTodoInput();
    await input.focus();
    await input.fill('Keyboard task');
    await input.press('Enter');

    await expect(todoPage.todoText('Keyboard task')).toBeVisible();
  });

  test('should not allow entering more than 100 characters', async ({
    todoPage,
  }) => {
    const input = todoPage.newTodoInput();
    const longText = 'a'.repeat(105);

    await input.fill(longText);

    await expect(input).toHaveValue('a'.repeat(100));
  });

  test('should show warning color when near character limit', async ({
    todoPage,
  }) => {
    const input = todoPage.newTodoInput();
    const charCounter = todoPage.charCounter();

    await input.fill('a'.repeat(90));

    await expect(charCounter).toHaveClass(/text-accent-yellow/);
  });

  test('should show error color when at character limit', async ({
    todoPage,
  }) => {
    const input = todoPage.newTodoInput();
    const charCounter = todoPage.charCounter();

    await input.fill('a'.repeat(100));

    await expect(charCounter).toHaveClass(/text-ultraviolet/);
  });

  test('should show separator between active and completed todos', async ({
    todoPage,
  }) => {
    await todoPage.addTodo('Active todo');
    await todoPage.addTodo('Completed todo');
    await todoPage.toggleTodo('Completed todo');

    const separator = todoPage.separator();
    await expect(separator).toBeVisible();
  });

  test('should delete all todos', async ({ todoPage }) => {
    await todoPage.addTodo('Task 1');
    await todoPage.addTodo('Task 2');
    await todoPage.addTodo('Task 3');

    await todoPage.deleteAll();

    await expect(todoPage.todoText('Task 1')).not.toBeVisible();
    await expect(todoPage.todoText('Task 2')).not.toBeVisible();
    await expect(todoPage.todoText('Task 3')).not.toBeVisible();
  });

  test('should hide Delete all when all todos are completed on the All filter', async ({
    todoPage,
  }) => {
    await todoPage.addTodo('Task');
    await todoPage.toggleTodo('Task');

    await expect(todoPage.deleteAllButton()).not.toBeVisible();
    await expect(todoPage.clearCompletedButton()).toBeVisible();
  });

  test('should display singular "item" for exactly one active todo', async ({
    todoPage,
  }) => {
    const itemsLeft = todoPage.itemsLeft();
    await todoPage.addTodo('Single task');

    await expect(itemsLeft).toHaveText('1 ITEM LEFT');
  });

  test('should display page title and subtitle', async ({ todoPage }) => {
    await expect(todoPage.heading()).toBeVisible();
    await expect(todoPage.subtitle()).toBeVisible();
  });

  test('should show check icon inside checkbox when todo is completed', async ({
    todoPage,
  }) => {
    await todoPage.addTodo('Completed task');
    await todoPage.toggleTodo('Completed task');

    const checkIcon = todoPage.checkIconLocator('Completed task');

    await expect(checkIcon).toBeVisible();
  });

  test('should highlight the active filter button', async ({ todoPage }) => {
    await todoPage.addTodo('Task');

    await todoPage.filterBy('active');
    await expect(todoPage.filterButton('active')).toHaveClass(/bg-mint/);
    await expect(todoPage.filterButton('all')).not.toHaveClass(/bg-mint/);

    await todoPage.filterBy('completed');
    await expect(todoPage.filterButton('completed')).toHaveClass(/bg-mint/);
  });

  test('should not add a duplicate active todo', async ({ todoPage }) => {
    await todoPage.addTodo('Buy milk');

    const input = todoPage.newTodoInput();
    await input.fill('Buy milk');

    const addButton = todoPage.addButton();
    await expect(addButton).toBeDisabled();

    await input.press('Enter');
    const todos = todoPage.todoItem('Buy milk');
    await expect(todos).toHaveCount(1);
  });

  test('should treat duplicates case-insensitively', async ({ todoPage }) => {
    await todoPage.addTodo('Buy milk');

    const input = todoPage.newTodoInput();
    await input.fill('buy MILK');

    const addButton = todoPage.addButton();
    await expect(addButton).toBeDisabled();
  });

  test('should treat trimmed duplicates as duplicates', async ({
    todoPage,
  }) => {
    await todoPage.addTodo('Buy milk');

    const input = todoPage.newTodoInput();
    await input.fill('  Buy milk  ');

    const addButton = todoPage.addButton();
    await expect(addButton).toBeDisabled();
  });

  test('should allow re-adding a completed todo', async ({ todoPage }) => {
    await todoPage.addTodo('Buy milk');
    await todoPage.toggleTodo('Buy milk');

    const input = todoPage.newTodoInput();
    await input.fill('Buy milk');

    const addButton = todoPage.addButton();
    await expect(addButton).toBeEnabled();
  });

  test('should allow re-adding a deleted todo', async ({ todoPage }) => {
    await todoPage.addTodo('Buy milk');
    await todoPage.deleteTodo('Buy milk');

    const input = todoPage.newTodoInput();
    await input.fill('Buy milk');

    const addButton = todoPage.addButton();
    await expect(addButton).toBeEnabled();
  });

  test('should re-enable button when duplicate is edited to unique text', async ({
    todoPage,
  }) => {
    await todoPage.addTodo('Buy milk');

    const input = todoPage.newTodoInput();
    await input.fill('Buy milk');

    const addButton = todoPage.addButton();
    await expect(addButton).toBeDisabled();

    await input.fill('Buy eggs');
    await expect(addButton).toBeEnabled();
  });

  test('should not add a duplicate via keyboard Enter', async ({
    todoPage,
  }) => {
    await todoPage.addTodo('Buy milk');

    const input = todoPage.newTodoInput();
    await input.fill('Buy milk');
    await input.press('Enter');

    const todos = todoPage.todoItem('Buy milk');
    await expect(todos).toHaveCount(1);
  });

  test('should clear input after successful submission', async ({
    todoPage,
  }) => {
    const input = todoPage.newTodoInput();

    await input.fill('Clear me');
    await todoPage.addButton().click();

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

    const todoTexts = await todoPage.getAllTodoTexts();
    expect(todoTexts).toEqual(['Task C', 'Task A', 'Task B']);
  });

  test('should persist reordered todos on reload', async ({
    page,
    todoPage,
  }) => {
    await todoPage.addTodo('Task A');
    await todoPage.addTodo('Task B');

    await todoPage.dragTodoAbove('Task B', 'Task A');

    let todoTexts = await todoPage.getAllTodoTexts();
    expect(todoTexts).toEqual(['Task B', 'Task A']);

    await page.reload();

    todoTexts = await todoPage.getAllTodoTexts();
    expect(todoTexts).toEqual(['Task B', 'Task A']);
  });

  test('should dismiss confirm dialog via close (X) button without acting', async ({
    todoPage,
  }) => {
    await todoPage.addTodo('Task');
    await todoPage.addTodo('Completed task');
    await todoPage.toggleTodo('Completed task');

    await todoPage.clearCompletedButton().click();
    await expect(todoPage.confirmDialog.dialog()).toBeVisible();
    await todoPage.confirmDialog.closeButton().click();

    await expect(todoPage.todoText('Completed task')).toBeVisible();
  });

  test('should be able to clear completed when filter is completed', async ({
    todoPage,
  }) => {
    await todoPage.addTodo('Active');
    await todoPage.addTodo('Done');
    await todoPage.toggleTodo('Done');

    await todoPage.filterBy('completed');
    await todoPage.clearCompleted();

    await expect(todoPage.todoText('Done')).not.toBeVisible();
    await todoPage.filterBy('all');
    await expect(todoPage.todoText('Active')).toBeVisible();
  });

  test('should add a todo with exactly 100 characters', async ({
    todoPage,
  }) => {
    const input = todoPage.newTodoInput();
    const hundredChars = 'a'.repeat(100);

    await input.fill(hundredChars);
    await todoPage.addButton().click();

    await expect(todoPage.todoText(hundredChars)).toBeVisible();
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

    const texts = await todoPage.getAllTodoTexts();
    expect(texts.slice(0, 2)).toEqual(['Active B', 'Active A']);
    expect(texts[2]).toBe('Done C');
  });

  test('should show confirm dialog with correct accessibility attributes', async ({
    todoPage,
  }) => {
    await todoPage.addTodo('Task');
    await todoPage.deleteAllButton().click();

    const dialog = todoPage.confirmDialog.dialog();
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAttribute('role', 'dialog');
    await expect(dialog).toHaveAttribute('aria-modal', 'true');
  });

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

    test('should show error counter at character limit', async ({
      todoPage,
    }) => {
      await todoPage.addTodo('Short');

      await todoPage.todoText('Short').dblclick();
      const input = todoPage.todoEditInput();
      await input.pressSequentially('a'.repeat(100));

      await expect(todoPage.todoEditCharCounter()).toHaveClass(
        /text-ultraviolet/
      );
    });
  });

  test.describe('Priority', () => {
    test('should add a todo without priority', async ({ todoPage }) => {
      await todoPage.addTodo('No priority');

      const link = todoPage.todoItem('No priority');
      await expect(link).toBeVisible();
      await expect(todoPage.priorityPillAdd('No priority')).toBeAttached();
    });

    test('should set priority on an item that has none', async ({
      todoPage,
    }) => {
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
      await expect(todoPage.priorityPill('Persist priority')).toHaveText(
        'high'
      );
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

  test('should reset filter to "all" after page reload', async ({
    todoPage,
    page,
  }) => {
    await todoPage.addTodo('Active task');
    await todoPage.addTodo('Done task');
    await todoPage.toggleTodo('Done task');

    await todoPage.filterBy('completed');
    await expect(todoPage.todoText('Active task')).not.toBeVisible();

    await page.reload();

    await expect(todoPage.filterButton('all')).toHaveClass(/bg-mint/);
    await expect(todoPage.todoText('Active task')).toBeVisible();
    await expect(todoPage.todoText('Done task')).toBeVisible();
  });

  test('should close confirm dialog without action on Escape', async ({
    todoPage,
    page,
  }) => {
    await todoPage.addTodo('Keep me');

    await todoPage.deleteAllButton().click();
    await expect(todoPage.confirmDialog.dialog()).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(todoPage.confirmDialog.dialog()).not.toBeVisible();

    await expect(todoPage.todoText('Keep me')).toBeVisible();
  });
});
