/**
 * @fileoverview
 * This test suite verifies the full purchase flow:
 * - Adding multiple items (phone, laptop, monitor) to the cart
 * - Checking out and placing an order
 *
 * Tests are run serially to preserve state across steps.
 * Each test navigates to the front page before execution.
 */

import { test, expect, Page } from "@playwright/test";
import { NavBar } from '../../pages/NavBar';
import { FrontPage } from "../../pages/FrontPage";
import { ProductPage } from "../../pages/ProductPage";
import { CartPage } from "../../pages/CartPage";
import { PlaceOrderDialog } from "../../pages/PlaceOrderDialog";

let page: Page;
let navBar: NavBar;
let frontPage: FrontPage;
let productPage: ProductPage;
let cartPage: CartPage;
let placeOrderDialog: PlaceOrderDialog;

test.describe.serial("Purchase Flow", () => {
	test.beforeAll(async ({ browser }) => {
		page = await browser.newPage();
    await page.goto("/");
    navBar = new NavBar(page);
		frontPage = new FrontPage(page);
		productPage = new ProductPage(page);
		cartPage = new CartPage(page);
		placeOrderDialog = new PlaceOrderDialog(page);
	});

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

	test("Add a monitor to cart", async () => {
		await test.step("Navigate to Monitors category", async () => {
			await navBar.clickProductStore();
      await frontPage.clickMonitors();
		});

		await test.step("Click on the first monitor item", async () => {
			await frontPage.clickFirstItemLink();
		});

		await test.step("Add product to cart and verify dialog message", async () => {
			await productPage.clickAddToCart();
			const dialog = await page.waitForEvent("dialog");
			expect(dialog.message()).toBe("Product added");
			await dialog.dismiss();
		});
	});

	test("Check out and place order", async () => {
		await test.step("Navigate to Cart from navbar", async () => {
			await navBar.clickCart();
      await page.waitForTimeout(5000); // wait for cart to load
		});

		await test.step("Verify cart has 3 items", async () => {
			const itemCount = await cartPage.getCartItemCount();
			expect(itemCount).toBe(3);
		});

		await test.step("Delete first item from cart", async () => {
			await cartPage.deleteFirstItem();
		});

		await test.step("Verify cart has 2 items after deletion", async () => {
			await page.waitForTimeout(5000); // wait for cart to update
			const updatedCount = await cartPage.getCartItemCount();
			expect(updatedCount).toBe(2);
		});

		await test.step("Click Place Order and verify dialog is visible", async () => {
			await cartPage.clickPlaceOrder();
      await page.waitForTimeout(5000); // wait for purchase dialog to load
			const isVisible = await placeOrderDialog.dialogIsVisible();
			expect(isVisible).toBe(true);
		});
	});

	test.afterAll(async () => {
		await page.close();
	});
});
