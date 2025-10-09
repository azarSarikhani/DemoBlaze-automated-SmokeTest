/**
 * @fileoverview
 * This test suite verifies invalid login scenarios using Playwright.
 * It includes:
 * - Attempting to log in with a non-existent user
 * - Attempting to log in with a valid user but incorrect password
 *
 * These tests run in parallel and validate that the application
 * displays the correct dialog messages for each failure case.
 */

import { test, expect, Page } from "@playwright/test";
import dotenv from "dotenv";
import { NavBar } from "../../pages/NavBar";
import { LoginDialog } from "../../pages/LoginDialog";

// Load environment variables
dotenv.config();

const invalidUsername = process.env.INVALID_USER_USERNAME || "invalidUserX9K3T7";
const invalidPassword = process.env.INVALID_USER_PASSWORD || "wrongpass123";
const validUsername = process.env.VALID_USER_USERNAME || "testuser";
const wrongPassword = process.env.VALID_USER_WRONG_PASSWORD || "incorrectPass456";

// Page object instances shared across tests
let page: Page;
let navBar: NavBar;
let loginDialog: LoginDialog;

test.describe("Invalid Login Attempts", () => {
	test.beforeAll(async ({ browser }) => {
		page = await browser.newPage();
		await page.goto("/");
		navBar = new NavBar(page);
		loginDialog = new LoginDialog(page);
	});

	test.afterAll(async () => {
		await page.close();
	});

	test('Login with non-existent user should show "User does not exist."', async () => {
		await test.step("Open login dialog", async () => {
			await navBar.clickLogin();
		});

		await test.step("Fill in invalid username and password", async () => {
			await loginDialog.fillUsername(invalidUsername);
			await loginDialog.fillPassword(invalidPassword);
		});

		await test.step("Submit login form and verify dialog message", async () => {
			await loginDialog.submit();
			const dialog = await page.waitForEvent("dialog");
			expect(dialog.message()).toBe("User does not exist.");
			await dialog.dismiss();
		});
	});

	test('Login with valid user and wrong password should show "Wrong password."', async () => {
		await test.step("Open login dialog", async () => {
			await navBar.clickLogin();
		});

		await test.step("Fill in valid username and incorrect password", async () => {
			await loginDialog.fillUsername(validUsername);
			await loginDialog.fillPassword(wrongPassword);
		});

		await test.step("Submit login form and verify dialog message", async () => {
			await loginDialog.submit();
			const dialog = await page.waitForEvent("dialog");
			expect(dialog.message()).toBe("Wrong password.");
			await dialog.dismiss();
		});
	});
});
