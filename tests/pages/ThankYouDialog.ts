import { Page, Locator } from '@playwright/test';

export class ThankYouDialog {
  private readonly thankYouHeading: Locator;
  private readonly successGraphic: Locator;
  private readonly okButton: Locator;

  constructor(private readonly page: Page) {
    this.thankYouHeading = page.getByRole('heading', { name: 'Thank you for your purchase!' });
    this.successGraphic = page.locator('.sa-placeholder');
    this.okButton = page.getByRole('button', { name: 'OK' });
  }

  async clickOk(): Promise<void> {
    await this.okButton.click();
  }

  async isThankYouVisible(): Promise<boolean> {
    return await this.thankYouHeading.isVisible();
  }

  async isSuccessGraphic(): Promise<boolean> {
    return await this.successGraphic.isVisible();
  }

  async isTextVisible(text: string): Promise<boolean> {
    return await this.page.getByText(text, { exact: false }).isVisible();
  }
}
