import { type Page, type Locator } from '@playwright/test';

export class ConfirmDialogPage {
  constructor(private readonly page: Page) {}

  getDialog = (): Locator => this.page.getByTestId('confirm-dialog');

  getConfirmButton = (): Locator =>
    this.page.getByTestId('confirm-dialog-confirm');

  getCancelButton = (): Locator =>
    this.page.getByTestId('confirm-dialog-cancel');

  getCloseButton = (): Locator =>
    this.page.getByTestId('confirm-dialog-close');
}
