import { Page, Locator } from '@playwright/test';

export class FrontPage {
  private readonly phonesLink: Locator;
  private readonly laptopsLink: Locator;
  private readonly monitorsLink: Locator;
  private readonly firstCardContainer: Locator;
  private readonly firstCardImageLink: Locator;
  private readonly secondCardContainer: Locator;
  private readonly secondCardImageLink: Locator;
  private readonly thirdCardContainer: Locator;
  private readonly thirdCardImageLink: Locator;

  constructor(private readonly page: Page) {
    this.phonesLink = page.getByRole('link', { name: 'Phones' });
    this.laptopsLink = page.getByRole('link', { name: 'Laptops' });
    this.monitorsLink = page.getByRole('link', { name: 'Monitors' });

	//Card containers and card links resolve to both card image and item name,
	// they are both clickable, we choose to click on the image here.
	this.firstCardContainer = page.locator('div.card.h-100').nth(0).first();
    this.firstCardImageLink = this.firstCardContainer.locator('a').first();

	this.secondCardContainer = page.locator('div.card.h-100').nth(0).first();
    this.secondCardImageLink = this.secondCardContainer.locator('a').first();

	this.thirdCardContainer = page.locator('div.card.h-100').nth(0).first();
    this.thirdCardImageLink = this.thirdCardContainer.locator('a').first();

  }

  async clickPhones(): Promise<void> {
    await this.phonesLink.click();
  }

  async clickLaptops(): Promise<void> {
    await this.laptopsLink.click();
  }

  async clickMonitors(): Promise<void> {
    await this.monitorsLink.click();
  }

  async clickFirstItemLink(): Promise<void> {
    await this.firstCardImageLink.click();
  }

  async clickSecondItemLink(): Promise<void> {
    await this.secondCardImageLink.click();
  }

  async clickThirdItemLink(): Promise<void> {
    await this.thirdCardImageLink.click();
  }
}
