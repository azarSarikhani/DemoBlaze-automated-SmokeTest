/**
 * @fileoverview
 * This test suite verifies the full purchase flow of an e-commerce application:
 * - Adding multiple items (phone, laptop, monitor) to the cart
 * - Checking out and placing an order
 * - Filling out the purchase form and validating required fields
 * - Confirming successful purchase and verifying cart is emptied
 *
 * Tests are run serially to preserve shared state across steps.
 * Each test builds on the previous one, simulating a complete user journey.
 */

import { test, expect, Page } from "@playwright/test";
import { NavBar } from "../../pages/NavBar";
import { FrontPage } from "../../pages/FrontPage";
import { ProductPage } from "../../pages/ProductPage";
import { CartPage } from "../../pages/CartPage";
import { PlaceOrderDialog } from "../../pages/PlaceOrderDialog";
import { ThankYouDialog } from "../../pages/ThankYouDialog";

// Page object instances shared across tests
let page: Page;
let navBar: NavBar;
let frontPage: FrontPage;
let productPage: ProductPage;
let cartPage: CartPage;
let placeOrderDialog: PlaceOrderDialog;
let thankYouDialog: ThankYouDialog;

test.describe.serial("Purchase Flow", () => {
	/**
	 * Initializes browser and page objects before all tests.
	 * Navigates to the front page and sets up page object models.
	 */
	test.beforeAll(async ({ browser }) => {
		page = await browser.newPage();
		await page.goto("/");
    await page.addStyleTag({ content: '.modal.fade { transition: none !important; }' });

		navBar = new NavBar(page);
		frontPage = new FrontPage(page);
		productPage = new ProductPage(page);
		cartPage = new CartPage(page);
		placeOrderDialog = new PlaceOrderDialog(page);
		thankYouDialog = new ThankYouDialog(page);
	});

	/**
	 * Adds a phone to the cart by navigating to the Phones category,
	 * selecting the third item, and confirming the "Product added" dialog.
	 */
	test("Add a phone to cart", async () => {
		await test.step("Navigate to Phones category", async () => {
			await frontPage.clickPhones();
		});

		await test.step("Click on the third phone item", async () => {
			await frontPage.clickThirdItemLink();
		});

		await test.step("Add product to cart and verify dialog message", async () => {
			await productPage.clickAddToCart();
			const dialog = await page.waitForEvent("dialog");
			expect(dialog.message()).toBe("Product added");
			await dialog.dismiss();
		});
	});

	/**
	 * Adds a laptop to the cart by navigating to the Laptops category,
	 * selecting the second item, and confirming the "Product added" dialog.
	 */
	test("Add a laptop to cart", async () => {
		await test.step("Navigate to Laptops category", async () => {
			await navBar.clickHome();
			await frontPage.clickLaptops();
		});

		await test.step("Click on the second laptop item", async () => {
			await frontPage.clickSecondItemLink();
		});

		await test.step("Add product to cart and verify dialog message", async () => {
			await productPage.clickAddToCart();
			const dialog = await page.waitForEvent("dialog");
			expect(dialog.message()).toBe("Product added");
			await dialog.dismiss();
		});
	});

	/**
	 * Adds a monitor to the cart by navigating to the Monitors category,
	 * selecting the first item, and confirming the "Product added" dialog.
	 */
	test("Add a monitor to cart", async () => {
		await test.step("Navigate to Monitors category", async () => {
			await navBar.clickProductStore();
			await frontPage.clickMonitors();
		});

		await test.step("Click on the first monitor item", async () => {
			await page.waitForTimeout(1000); // wait for monitors to load
			await frontPage.clickFirstItemLink();
		});

		await test.step("Add product to cart and verify dialog message", async () => {
			await productPage.clickAddToCart();
			const dialog = await page.waitForEvent("dialog");
			expect(dialog.message()).toBe("Product added");
			await dialog.dismiss();
		});
	});

	/**
	 * Verifies the cart contains 3 items, deletes one,
	 * confirms the updated count, and opens the Place Order dialog.
	 */
	test("Check out cart", async () => {
		await test.step("Navigate to Cart from navbar", async () => {
			await navBar.clickCart();
			await page.waitForTimeout(3000); // wait for cart to load
		});

		await test.step("Verify cart has 3 items", async () => {
			const itemCount = await cartPage.getCartItemCount();
			expect(itemCount).toBe(3);
		});

		await test.step("Delete first item from cart", async () => {
			await cartPage.deleteFirstItem();
		});

		await test.step("Verify cart has 2 items after deletion", async () => {
			await page.waitForTimeout(3000); // wait for cart to update
			const updatedCount = await cartPage.getCartItemCount();
			expect(updatedCount).toBe(2);
		});

		await test.step("Click Place Order and verify dialog is visible", async () => {
			await cartPage.clickPlaceOrder();
			await page.waitForTimeout(3000); // wait for purchase dialog to load
			const isVisible = await placeOrderDialog.dialogIsVisible();
			expect(isVisible).toBe(true);
		});
	});

	/**
	 * Fills out the purchase form step-by-step, validating required fields,
	 * submits the order, verifies the thank-you dialog, and confirms the cart is emptied.
	 */
	test("Fill out and submit purchase form", async () => {
		await test.step("Expect that name and credit card is required", async () => {
			placeOrderDialog.submit();
			const dialog = await page.waitForEvent("dialog");
			expect(dialog.message()).toBe("Please fill out Name and Creditcard.");
			await dialog.dismiss();
		});

		await test.step("Fill in buyer name", async () => {
			await placeOrderDialog.fillName("buyer");
		});

		await test.step("Expect that credit card is required", async () => {
			placeOrderDialog.submit();
			const dialog = await page.waitForEvent("dialog");
			expect(dialog.message()).toBe("Please fill out Name and Creditcard.");
			await dialog.dismiss();
		});

		await test.step("Fill in country", async () => {
			await placeOrderDialog.fillCountry("Finland");
		});

		await test.step("Fill in city", async () => {
			await placeOrderDialog.fillCity("Helsinki");
		});

		await test.step("Fill in credit card", async () => {
			await placeOrderDialog.fillCreditCard("1234567890");
		});

		await test.step("Fill in month", async () => {
			await placeOrderDialog.fillMonth("1");
		});

		await test.step("Fill in year", async () => {
			await placeOrderDialog.fillYear("2000");
		});

		await test.step("Click Purchase button", async () => {
			placeOrderDialog.submit();
		});

		await test.step("Expect purchase successful message", async () => {
			await page.waitForTimeout(1000);
			const graphicIsVisible = await thankYouDialog.isSuccessGraphic();
			expect(graphicIsVisible).toBe(true);
			const thankYouMessageIsVisible = await thankYouDialog.isThankYouVisible();
			expect(thankYouMessageIsVisible).toBe(true);
			expect(
				await thankYouDialog.isTextVisible("Card Number: 1234567890")
			).toBe(true);
			expect(await thankYouDialog.isTextVisible("Name: buyer")).toBe(true);
			thankYouDialog.clickOk();
		});

		await test.step("Navigate to Cart from navbar", async () => {
			await navBar.clickCart();
			await page.waitForTimeout(3000); // wait for cart to load
		});

		await test.step("Verify cart is empty", async () => {
			const itemCount = await cartPage.getCartItemCount();
			expect(itemCount).toBe(0);
		});
	});

	/**
	 * Closes the browser after all tests are complete.
	 */
	test.afterAll(async () => {
		await page.close();
	});
});
