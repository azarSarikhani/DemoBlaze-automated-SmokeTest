import { Page, Locator } from "@playwright/test";

export class NavBar {
	private readonly signUpLink: Locator;
	private readonly loginLink: Locator;
	private readonly cartLink: Locator;
	private readonly homeLink: Locator;
	private readonly contactLink: Locator;
	private readonly productStoreLink: Locator;
	private readonly nameOfUser: Locator;

	constructor(private readonly page: Page) {
		this.signUpLink = page.getByRole("link", { name: "Sign up" });
		this.loginLink = page.getByRole("link", { name: "Log in" });
		this.cartLink = page.getByRole("link", { name: "Cart" , exact: true });
		this.contactLink = page.getByRole("link", { name: "Contact" , exact: true });
		this.homeLink = page.getByRole("link", { name: "Home (current)" });
		this.productStoreLink = page.getByRole("link", { name: "PRODUCT STORE" });
		this.nameOfUser = page.locator("#nameofuser");
	}

	async clickSignUp(): Promise<void> {
		await this.signUpLink.click();
	}

	async clickLogin(): Promise<void> {
		await this.loginLink.click();
	}

	async clickCart(): Promise<void> {
		await this.cartLink.click();
	}

	async clickHome(): Promise<void> {
		await this.homeLink.click();
	}

	async clickContact(): Promise<void> {
		await this.contactLink.click();
	}

	async clickProductStore(): Promise<void> {
		await this.productStoreLink.click();
	}

	get nameOfUserLocator(): Locator {
		return this.nameOfUser;
	}
}
