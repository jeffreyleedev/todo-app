import { type Page, type Locator } from '@playwright/test';
import { ConfirmDialogPage } from './ConfirmDialogPage';

export class TodoPage {
  public readonly confirmDialog: ConfirmDialogPage;

  constructor(private readonly page: Page) {
    this.confirmDialog = new ConfirmDialogPage(page);
  }

  /* Locators */

  newTodoInput = (): Locator =>
    this.page.getByPlaceholder('Add a new task...');

  addButton = (): Locator => this.page.getByTestId('add-todo-button');

  todoItem = (text: string): Locator =>
    this.page.getByTestId('todo-item').filter({ hasText: text });

  todoCheckbox = (text: string): Locator =>
    this.todoItem(text).getByTestId('todo-checkbox');

  todoText = (text: string): Locator =>
    this.todoItem(text).getByTestId('todo-text');

  deleteButton = (text: string): Locator =>
    this.todoItem(text).getByTestId('delete-todo');

  filterButton = (filter: 'all' | 'active' | 'completed'): Locator => {
    const label = filter.toUpperCase();
    return this.page.getByRole('button', { name: label, exact: true });
  };

  clearCompletedButton = (): Locator =>
    this.page.getByRole('button', { name: 'CLEAR COMPLETED' });

  deleteAllButton = (): Locator =>
    this.page.getByRole('button', { name: 'DELETE ALL' });

  itemsLeft = (): Locator => this.page.getByTestId('items-left');

  messageByText = (text: string): Locator => this.page.getByText(text);

  charCounter = (): Locator => this.page.getByTestId('char-counter');

  separator = (): Locator => this.page.getByTestId('todo-separator');

  heading = (): Locator =>
    this.page.getByRole('heading', { name: 'My Tasks' });

  subtitle = (): Locator =>
    this.page.getByText('Stay focused and organized.');

  checkIconLocator = (text: string): Locator =>
    this.page
      .locator('[data-testid="todo-item"]')
      .filter({ hasText: text })
      .locator('[data-testid="todo-check-icon"]');

  dragHandle = (text: string): Locator =>
    this.todoItem(text).getByTestId('drag-handle');

  /* Edit Locators */

  todoEditInput = (): Locator => this.page.getByTestId('todo-edit-input');

  todoEditCharCounter = (): Locator =>
    this.page.getByTestId('todo-edit-char-counter');

  /* Priority Locators */

  priorityPill = (todoText: string): Locator =>
    this.todoItem(todoText).getByTestId('priority-pill');

  priorityPillAdd = (todoText: string): Locator =>
    this.todoItem(todoText).getByTestId('priority-pill-add');

  priorityPillAddMobile = (todoText: string): Locator =>
    this.todoItem(todoText).getByTestId('priority-pill-add-mobile');

  /* Actions */

  goto = async (): Promise<void> => {
    const response = await this.page.goto('/');
    if (!response) {
      throw new Error('Failed to navigate to the todo page');
    }
  };

  fillNewTodo = async (text: string): Promise<void> =>
    this.newTodoInput().fill(text);

  pressEnter = async (): Promise<void> => this.newTodoInput().press('Enter');

  addTodo = async (text: string): Promise<void> => {
    await this.fillNewTodo(text);
    await this.pressEnter();
  };

  toggleTodo = async (text: string): Promise<void> =>
    this.todoCheckbox(text).click();

  deleteTodo = async (text: string): Promise<void> => {
    const item = this.todoItem(text);
    await item.hover();
    await this.deleteButton(text).click();
  };

  getAllTodoTexts = async (): Promise<string[]> =>
    this.page.getByTestId('todo-text').allTextContents();

  filterBy = async (filter: 'all' | 'active' | 'completed'): Promise<void> =>
    this.filterButton(filter).click();

  clearCompleted = async (): Promise<void> => {
    await this.clearCompletedButton().click();
    await this.confirmDialog.confirmButton().click();
  };

  deleteAll = async (): Promise<void> => {
    await this.deleteAllButton().click();
    await this.confirmDialog.confirmButton().click();
  };

  dragTodoAbove = async (
    sourceText: string,
    targetText: string
  ): Promise<void> => {
    const sourceHandle = this.dragHandle(sourceText);
    const targetItem = this.todoItem(targetText);

    const sourceBox = await sourceHandle.boundingBox();
    const targetBox = await targetItem.boundingBox();

    if (!sourceBox || !targetBox) {
      throw new Error('Could not find elements for drag and drop');
    }

    // Use manual mouse movements for cross-browser compatibility with dnd-kit
    await this.page.mouse.move(
      sourceBox.x + sourceBox.width / 2,
      sourceBox.y + sourceBox.height / 2
    );
    await this.page.mouse.down();
    await this.page.mouse.move(
      targetBox.x + targetBox.width / 2,
      targetBox.y + targetBox.height / 2,
      { steps: 10 }
    );
    await this.page.mouse.up();
  };

  /* Priority Actions */

  addPriorityToItem = async (todoText: string): Promise<void> => {
    await this.todoItem(todoText).hover();
    if (await this.priorityPillAdd(todoText).isVisible()) {
      await this.priorityPillAdd(todoText).click();
    } else {
      await this.priorityPillAddMobile(todoText).click();
    }
  };

  /* Edit Actions */

  editTodo = async (oldText: string, newText: string): Promise<void> => {
    await this.todoText(oldText).dblclick();
    await this.todoEditInput().fill(newText);
    await this.todoEditInput().press('Enter');
  };

  cancelEdit = async (todoText: string, newText: string): Promise<void> => {
    await this.todoText(todoText).dblclick();
    await this.todoEditInput().fill(newText);
    await this.todoEditInput().press('Escape');
  };
}
