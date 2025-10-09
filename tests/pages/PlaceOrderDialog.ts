import { Page, expect, Locator } from "@playwright/test";

export class PlaceOrderDialog {
	private readonly nameInput: Locator;
	private readonly countryInput: Locator;
	private readonly cityInput: Locator;
	private readonly creditCardInput: Locator;
	private readonly monthInput: Locator;
	private readonly yearInput: Locator;
	private readonly closeButton: Locator;

	constructor(private readonly page: Page) {
		this.nameInput = page.locator("#name");
		this.countryInput = page.locator("#country");
		this.cityInput = page.locator("#city");
		this.creditCardInput = page.locator("#card");
		this.monthInput = page.locator("#month");
		this.yearInput = page.locator("#year");
		this.closeButton = page.getByRole("button", { name: "Close" });
	}

	async fillName(name: string): Promise<void> {
		await this.nameInput.fill(name);
	}

	async fillCountry(country: string): Promise<void> {
		await this.countryInput.fill(country);
	}

	async fillCity(city: string): Promise<void> {
		await this.cityInput.fill(city);
	}

	async fillCreditCard(cardNumber: string): Promise<void> {
		await this.creditCardInput.fill(cardNumber);
	}

	async fillMonth(month: string): Promise<void> {
		await this.monthInput.fill(month);
	}

	async fillYear(year: string): Promise<void> {
		await this.yearInput.fill(year);
	}

	async submit(): Promise<void> {
		const purchaseButton = this.page.locator('button[onclick="purchaseOrder()"]');
		await expect(this.page.locator("#orderModal")).toBeVisible();
		await expect(purchaseButton).toBeVisible();
		await purchaseButton.scrollIntoViewIfNeeded();
		await purchaseButton.focus();
		await expect(purchaseButton).toBeEnabled();
		await purchaseButton.click();
	}

	async close(): Promise<void> {
		await this.closeButton.click();
	}

	async dialogIsVisible(): Promise<boolean> {
		return (
			(await this.creditCardInput.isVisible()) &&
			(await this.cityInput.isVisible()) &&
			(await this.monthInput.isVisible())
		);
	}
}
