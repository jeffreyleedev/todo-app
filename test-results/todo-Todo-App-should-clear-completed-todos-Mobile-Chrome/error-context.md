# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: todo.spec.ts >> Todo App >> should clear completed todos
- Location: e2e/todo.spec.ts:54:3

# Error details

```
Test timeout of 30000ms exceeded while setting up "todoPage".
```

```
Error: page.goto: Test timeout of 30000ms exceeded.
Call log:
  - navigating to "http://localhost:5173/", waiting until "load"

```

# Test source

```ts
  1   | import { type Page, type Locator } from '@playwright/test';
  2   | import { ConfirmDialogPage } from './ConfirmDialogPage';
  3   | 
  4   | export class TodoPage {
  5   |   public readonly confirmDialog: ConfirmDialogPage;
  6   | 
  7   |   constructor(private readonly page: Page) {
  8   |     this.confirmDialog = new ConfirmDialogPage(page);
  9   |   }
  10  | 
  11  |   /* Locators */
  12  | 
  13  |   getNewTodoInput = (): Locator =>
  14  |     this.page.getByPlaceholder('Add a new task...');
  15  | 
  16  |   getAddButton = (): Locator => this.page.getByTestId('add-todo-button');
  17  | 
  18  |   getTodoItem = (text: string): Locator =>
  19  |     this.page.getByTestId('todo-item').filter({ hasText: text });
  20  | 
  21  |   getTodoCheckbox = (text: string): Locator =>
  22  |     this.getTodoItem(text).getByTestId('todo-checkbox');
  23  | 
  24  |   getTodoText = (text: string): Locator =>
  25  |     this.getTodoItem(text).getByTestId('todo-text');
  26  | 
  27  |   getDeleteButton = (text: string): Locator =>
  28  |     this.getTodoItem(text).getByTestId('delete-todo');
  29  | 
  30  |   getFilterButton = (filter: 'all' | 'active' | 'completed'): Locator => {
  31  |     const label = filter.charAt(0).toUpperCase() + filter.slice(1);
  32  |     return this.page.getByRole('button', { name: label, exact: true });
  33  |   };
  34  | 
  35  |   getClearCompletedButton = (): Locator =>
  36  |     this.page.getByRole('button', { name: 'Clear completed' });
  37  | 
  38  |   getDeleteAllButton = (): Locator =>
  39  |     this.page.getByRole('button', { name: 'Delete all' });
  40  | 
  41  |   getItemsLeft = (): Locator => this.page.getByTestId('items-left');
  42  | 
  43  |   getMessageByText = (text: string): Locator => this.page.getByText(text);
  44  | 
  45  |   getCharCounter = (): Locator => this.page.getByTestId('char-counter');
  46  | 
  47  |   getSeparator = (): Locator => this.page.getByTestId('todo-separator');
  48  | 
  49  |   getHeading = (): Locator =>
  50  |     this.page.getByRole('heading', { name: 'My Tasks' });
  51  | 
  52  |   getSubtitle = (): Locator =>
  53  |     this.page.getByText('Stay focused and organized.');
  54  | 
  55  |   getCheckIconLocator = (text: string): Locator =>
  56  |     this.page
  57  |       .locator('[data-testid="todo-item"]')
  58  |       .filter({ hasText: text })
  59  |       .locator('[data-testid="todo-check-icon"]');
  60  | 
  61  |   getThemeToggle = (): Locator =>
  62  |     this.page.getByRole('button', { name: /^Switch to (dark|light) mode$/ });
  63  | 
  64  |   getDragHandle = (text: string): Locator =>
  65  |     this.getTodoItem(text).getByTestId('drag-handle');
  66  | 
  67  |   /* Priority Locators */
  68  | 
  69  |   getPriorityPill = (todoText: string): Locator =>
  70  |     this.getTodoItem(todoText).getByTestId('priority-pill');
  71  | 
  72  |   getPriorityPillAdd = (todoText: string): Locator =>
  73  |     this.getTodoItem(todoText).getByTestId('priority-pill-add');
  74  | 
  75  |   /* Actions */
  76  | 
  77  |   goto = async (): Promise<void> => {
> 78  |     const response = await this.page.goto('/');
      |                                      ^ Error: page.goto: Test timeout of 30000ms exceeded.
  79  |     if (!response) {
  80  |       throw new Error('Failed to navigate to the todo page');
  81  |     }
  82  |   };
  83  | 
  84  |   fillNewTodo = async (text: string): Promise<void> =>
  85  |     this.getNewTodoInput().fill(text);
  86  | 
  87  |   pressEnter = async (): Promise<void> => this.getNewTodoInput().press('Enter');
  88  | 
  89  |   addTodo = async (text: string): Promise<void> => {
  90  |     await this.fillNewTodo(text);
  91  |     await this.pressEnter();
  92  |   };
  93  | 
  94  |   toggleTodo = async (text: string): Promise<void> =>
  95  |     this.getTodoCheckbox(text).click();
  96  | 
  97  |   deleteTodo = async (text: string): Promise<void> => {
  98  |     const item = this.getTodoItem(text);
  99  |     await item.hover();
  100 |     await this.getDeleteButton(text).click();
  101 |   };
  102 | 
  103 |   filterBy = async (filter: 'all' | 'active' | 'completed'): Promise<void> =>
  104 |     this.getFilterButton(filter).click();
  105 | 
  106 |   clearCompleted = async (): Promise<void> => {
  107 |     await this.getClearCompletedButton().click();
  108 |     await this.confirmDialog.getConfirmButton().click();
  109 |   };
  110 | 
  111 |   deleteAll = async (): Promise<void> => {
  112 |     await this.getDeleteAllButton().click();
  113 |     await this.confirmDialog.getConfirmButton().click();
  114 |   };
  115 | 
  116 |   dragTodoAbove = async (
  117 |     sourceText: string,
  118 |     targetText: string
  119 |   ): Promise<void> => {
  120 |     const sourceHandle = this.getDragHandle(sourceText);
  121 |     const targetItem = this.getTodoItem(targetText);
  122 | 
  123 |     const sourceBox = await sourceHandle.boundingBox();
  124 |     const targetBox = await targetItem.boundingBox();
  125 | 
  126 |     if (!sourceBox || !targetBox) {
  127 |       throw new Error('Could not find elements for drag and drop');
  128 |     }
  129 | 
  130 |     // Use manual mouse movements for cross-browser compatibility with dnd-kit
  131 |     await this.page.mouse.move(
  132 |       sourceBox.x + sourceBox.width / 2,
  133 |       sourceBox.y + sourceBox.height / 2
  134 |     );
  135 |     await this.page.mouse.down();
  136 |     await this.page.mouse.move(
  137 |       targetBox.x + targetBox.width / 2,
  138 |       targetBox.y + targetBox.height / 2,
  139 |       { steps: 10 }
  140 |     );
  141 |     await this.page.mouse.up();
  142 |   };
  143 | }
  144 | 
```