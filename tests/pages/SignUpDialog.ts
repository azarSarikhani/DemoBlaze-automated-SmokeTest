import { Page, Locator } from '@playwright/test';

export class SignUpDialog {
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly signupButton: Locator;
  private readonly closeButton: Locator;

  constructor(private readonly page: Page) {
    this.usernameInput = page.getByRole('textbox', { name: 'Username:' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password:' });
	this.signupButton = page.getByRole('button', { name: 'Sign up' });
    this.closeButton = page.getByRole('dialog', { name: 'Sign up' }).getByLabel('Close');
  }

  async fillUsername(username: string): Promise<void> {
    await this.usernameInput.fill(username);
  }

  async fillPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  async submit(): Promise<void> {
    await this.signupButton.click();
  }

  async close(): Promise<void> {
    await this.closeButton.click();
  }
}
