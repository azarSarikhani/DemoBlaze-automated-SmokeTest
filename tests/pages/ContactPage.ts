import { Page, Locator, expect } from "@playwright/test";

export class ContactPage {
	private readonly emailInput: Locator;
	private readonly nameInput: Locator;
	private readonly messageInput: Locator;

	constructor(private readonly page: Page) {
		this.emailInput = page.locator("#recipient-email");
		this.nameInput = page.getByRole("textbox", { name: "Contact Email: Contact Name:",});
		this.messageInput = page.getByRole("textbox", { name: "Message:" });
	}

	async fillEmail(email: string): Promise<void> {
		await this.emailInput.fill(email);
	}

	async fillName(name: string): Promise<void> {
		await this.nameInput.fill(name);
	}

	async fillMessage(message: string): Promise<void> {
		await this.messageInput.fill(message);
	}

	async clickSend(): Promise<void> {
		const modalContainer = this.page.locator('#exampleModal');
  		const button = modalContainer.locator('button.btn.btn-primary', { hasText: 'Send message' });
		//const button = this.page.locator('button[onclick="send()"]');
		await expect(this.page.locator("#exampleModal")).toBeVisible();
		await expect(button).toBeVisible();
		await button.scrollIntoViewIfNeeded();
		await button.focus();
		await expect(button).toBeEnabled();
		await button.click();
	}
}
