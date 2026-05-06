import { type Page, type Locator } from '@playwright/test';
import { ConfirmDialogPage } from './ConfirmDialogPage';

export class TodoPage {
  public readonly confirmDialog: ConfirmDialogPage;

  constructor(private readonly page: Page) {
    this.confirmDialog = new ConfirmDialogPage(page);
  }

  /* Locators */

  getNewTodoInput = (): Locator =>
    this.page.getByPlaceholder('Add a new task...');

  getAddButton = (): Locator => this.page.getByTestId('add-todo-button');

  getTodoItem = (text: string): Locator =>
    this.page.getByTestId('todo-item').filter({ hasText: text });

  getTodoCheckbox = (text: string): Locator =>
    this.getTodoItem(text).getByTestId('todo-checkbox');

  getTodoText = (text: string): Locator =>
    this.getTodoItem(text).getByTestId('todo-text');

  getDeleteButton = (text: string): Locator =>
    this.getTodoItem(text).getByTestId('delete-todo');

  getFilterButton = (filter: 'all' | 'active' | 'completed'): Locator => {
    const label = filter.toUpperCase();
    return this.page.getByRole('button', { name: label, exact: true });
  };

  getClearCompletedButton = (): Locator =>
    this.page.getByRole('button', { name: 'CLEAR COMPLETED' });

  getDeleteAllButton = (): Locator =>
    this.page.getByRole('button', { name: 'DELETE ALL' });

  getItemsLeft = (): Locator => this.page.getByTestId('items-left');

  getMessageByText = (text: string): Locator => this.page.getByText(text);

  getCharCounter = (): Locator => this.page.getByTestId('char-counter');

  getSeparator = (): Locator => this.page.getByTestId('todo-separator');

  getHeading = (): Locator =>
    this.page.getByRole('heading', { name: 'My Tasks' });

  getSubtitle = (): Locator =>
    this.page.getByText('Stay focused and organized.');

  getCheckIconLocator = (text: string): Locator =>
    this.page
      .locator('[data-testid="todo-item"]')
      .filter({ hasText: text })
      .locator('[data-testid="todo-check-icon"]');

  getDragHandle = (text: string): Locator =>
    this.getTodoItem(text).getByTestId('drag-handle');

  /* Edit Locators */

  getTodoEditInput = (): Locator => this.page.getByTestId('todo-edit-input');

  getTodoEditCharCounter = (): Locator =>
    this.page.getByTestId('todo-edit-char-counter');

  /* Priority Locators */

  getPriorityPill = (todoText: string): Locator =>
    this.getTodoItem(todoText).getByTestId('priority-pill');

  getPriorityPillAdd = (todoText: string): Locator =>
    this.getTodoItem(todoText).getByTestId('priority-pill-add');

  getPriorityPillAddMobile = (todoText: string): Locator =>
    this.getTodoItem(todoText).getByTestId('priority-pill-add-mobile');

  /* Actions */

  goto = async (): Promise<void> => {
    const response = await this.page.goto('/');
    if (!response) {
      throw new Error('Failed to navigate to the todo page');
    }
  };

  fillNewTodo = async (text: string): Promise<void> =>
    this.getNewTodoInput().fill(text);

  pressEnter = async (): Promise<void> => this.getNewTodoInput().press('Enter');

  addTodo = async (text: string): Promise<void> => {
    await this.fillNewTodo(text);
    await this.pressEnter();
  };

  toggleTodo = async (text: string): Promise<void> =>
    this.getTodoCheckbox(text).click();

  deleteTodo = async (text: string): Promise<void> => {
    const item = this.getTodoItem(text);
    await item.hover();
    await this.getDeleteButton(text).click();
  };

  getAllTodoTexts = async (): Promise<string[]> =>
    this.page.getByTestId('todo-text').allTextContents();

  filterBy = async (filter: 'all' | 'active' | 'completed'): Promise<void> =>
    this.getFilterButton(filter).click();

  clearCompleted = async (): Promise<void> => {
    await this.getClearCompletedButton().click();
    await this.confirmDialog.getConfirmButton().click();
  };

  deleteAll = async (): Promise<void> => {
    await this.getDeleteAllButton().click();
    await this.confirmDialog.getConfirmButton().click();
  };

  dragTodoAbove = async (
    sourceText: string,
    targetText: string
  ): Promise<void> => {
    const sourceHandle = this.getDragHandle(sourceText);
    const targetItem = this.getTodoItem(targetText);

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
    await this.getTodoItem(todoText).hover();
    if (await this.getPriorityPillAdd(todoText).isVisible()) {
      await this.getPriorityPillAdd(todoText).click();
    } else {
      await this.getPriorityPillAddMobile(todoText).click();
    }
  };

  /* Edit Actions */

  editTodo = async (oldText: string, newText: string): Promise<void> => {
    await this.getTodoText(oldText).dblclick();
    await this.getTodoEditInput().fill(newText);
    await this.getTodoEditInput().press('Enter');
  };

  cancelEdit = async (todoText: string, newText: string): Promise<void> => {
    await this.getTodoText(todoText).dblclick();
    await this.getTodoEditInput().fill(newText);
    await this.getTodoEditInput().press('Escape');
  };
}
