import { Page, Locator } from '@playwright/test';

export class LoginDialog {
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly closeButton: Locator;

  constructor(private readonly page: Page) {
    this.usernameInput = page.locator('#loginusername');
    this.passwordInput = page.locator('#loginpassword');
    this.loginButton = page.getByRole('button', { name: 'Log in' });
    this.closeButton = page.getByRole('dialog', { name: 'Log in' }).getByLabel('Close');
  }

  async fillUsername(username: string): Promise<void> {
    await this.usernameInput.fill(username);
  }

  async fillPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  async submit(): Promise<void> {
    await this.loginButton.click();
  }

  async close(): Promise<void> {
    await this.closeButton.click();
  }
}
