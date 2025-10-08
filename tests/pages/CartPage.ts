import { Page, Locator } from '@playwright/test';

export class CartPage {
  private readonly placeOrderButton: Locator;

  constructor(private readonly page: Page) {
    this.placeOrderButton = page.getByRole('button', { name: 'Place Order' });
  }

  async clickPlaceOrder(): Promise<void> {
    await this.placeOrderButton.click();
  }
}
