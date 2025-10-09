/**
 * @fileoverview
 * This test verifies the contact form functionality:
 * - Navigates to the Contact page via navbar
 * - Fills out the contact form
 * - Submits the form
 * - Confirms success dialog appears with expected message
 */

import { test, expect, Page } from "@playwright/test";
import { NavBar } from "../../pages/NavBar";
import { ContactPage } from "../../pages/ContactPage";

// Page object instances shared across tests
let page: Page;
let navBar: NavBar;
let contactPage: ContactPage;

test.describe("Contact Form", () => {
	test.beforeAll(async ({ browser }) => {
		page = await browser.newPage();
		await page.goto("/");
		navBar = new NavBar(page);
		contactPage = new ContactPage(page);
	});

	test("Submit contact form and verify success dialog", async () => {
		await test.step("Navigate to Contact page", async () => {
			await navBar.clickContact();
		});

		await test.step("Fill out contact form", async () => {
			await page.waitForTimeout(1000); //wait for contact to be loaded
			await contactPage.fillEmail("example@example.com");
			await contactPage.fillName("Real Person");
			await contactPage.fillMessage("Real message from real person");
		});

		await test.step("Submit form and verify success dialog", async () => {
			await contactPage.clickSend();
			page.once("dialog", (dialog) => {
				expect(dialog.message()).toBe("Thanks for the message!!");
				dialog.dismiss().catch(() => {});
			});
		});
	});

	test.afterAll(async () => {
		await page.close();
	});
});
