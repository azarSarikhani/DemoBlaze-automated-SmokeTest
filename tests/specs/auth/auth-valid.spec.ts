/**
 * @fileoverview
 * This test suite verifies the valid authentication flow using Playwright.
 * It includes:
 * - Signing up with a unique test user
 * - Logging in with the newly created user
 *
 * The test user is generated dynamically using the current project name and a random suffix
 * to ensure uniqueness across parallel browser runs (e.g., Chrome, Firefox, Safari).
 *
 * The tests run sequentially using `test.describe.serial()` to ensure the login test
 * only executes after a successful sign-up.
 */

import { test, expect, Page } from "@playwright/test";
import dotenv from "dotenv";
import { NavBar } from "../../pages/NavBar";
import { SignUpDialog } from "../../pages/SignUpDialog";
import { LoginDialog } from "../../pages/LoginDialog";
import { getTestCredentials } from "../../utils/testUser";

// Load environment variables
dotenv.config();

// Page object instances shared across tests
let page: Page;
let navBar: NavBar;
let signUpDialog: SignUpDialog;
let loginDialog: LoginDialog;
let testUsername: string;
let testPassword: string;

test.describe.serial("Valid Auth Flow", () => {
	test.beforeAll(async ({ browser }) => {
		const projectName = test.info().project.name;
		const creds = getTestCredentials(projectName);
		testUsername = creds.testUsername;
		testPassword = creds.testPassword;

		page = await browser.newPage();
		await page.goto("/");
		navBar = new NavBar(page);
		signUpDialog = new SignUpDialog(page);
		loginDialog = new LoginDialog(page);
	});

	test("Sign up with valid credentials", async () => {
		await test.step("Open sign-up dialog", async () => {
			await navBar.clickSignUp();
		});

		await test.step("Fill in username and password", async () => {
			await signUpDialog.fillUsername(testUsername);
			await signUpDialog.fillPassword(testPassword);
		});

		await test.step("Submit sign-up form and verify dialog message", async () => {
			await signUpDialog.submit();
			const dialog = await page.waitForEvent("dialog");
			expect(dialog.message()).toBe("Sign up successful.");
			await dialog.dismiss();
		});
	});

	test("Log in with newly created user", async () => {
		await test.step("Open login dialog", async () => {
			await navBar.clickLogin();
		});

		await test.step("Fill in username and password", async () => {
			await loginDialog.fillUsername(testUsername);
			await loginDialog.fillPassword(testPassword);
		});

		await test.step("Submit login form and verify welcome message", async () => {
			await loginDialog.submit();
			await expect(navBar.nameOfUserLocator).toContainText(
				`Welcome ${testUsername}`
			);
		});
	});

	test.afterAll(async () => {
		// TODO: Delete test user from database to prevent clutter
		await page.close();
	});
});
