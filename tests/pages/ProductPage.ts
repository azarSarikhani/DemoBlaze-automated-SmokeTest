import { Page, Locator } from "@playwright/test";

export class ProductPage {
	private readonly addToCartButton: Locator;

	constructor(private readonly page: Page) {
		this.addToCartButton = page.getByRole("link", { name: "Add to cart" });
	}

	async clickAddToCart(): Promise<void> {
		await this.addToCartButton.click();
	}
}
