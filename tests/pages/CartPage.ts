import { Page, Locator } from "@playwright/test";

export class CartPage {
	private readonly placeOrderButton: Locator;
	private readonly cartItems: Locator;
	private readonly firstDeleteButton: Locator;

	constructor(private readonly page: Page) {
		this.placeOrderButton = page.getByRole("button", { name: "Place Order" });
		this.cartItems = page.locator(".success");
		this.firstDeleteButton = page.getByRole("link", { name: "Delete" }).first();
	}

	async clickPlaceOrder(): Promise<void> {
		await this.placeOrderButton.click();
	}

	async getCartItemCount(): Promise<number> {
		return await this.cartItems.count();
	}

	async deleteFirstItem(): Promise<void> {
		await this.firstDeleteButton.click();
	}
}
