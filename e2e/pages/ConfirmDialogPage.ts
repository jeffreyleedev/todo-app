import { type Page, type Locator } from '@playwright/test';

export class ConfirmDialogPage {
  constructor(private readonly page: Page) {}

  dialog = (): Locator => this.page.getByTestId('confirm-dialog');

  confirmButton = (): Locator =>
    this.page.getByTestId('confirm-dialog-confirm');

  cancelButton = (): Locator =>
    this.page.getByTestId('confirm-dialog-cancel');

  closeButton = (): Locator => this.page.getByTestId('confirm-dialog-close');
}
