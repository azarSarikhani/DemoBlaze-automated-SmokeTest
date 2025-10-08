import { test, expect, Page } from '@playwright/test';
import dotenv from 'dotenv';
import { NavBar } from '../../pages/NavBar';
import { SignUpDialog } from '../../pages/SignUpDialog';
import { LoginDialog } from '../../pages/LoginDialog';
import { getTestCredentials } from '../../utils/testUser';

let page: Page;
let navBar: NavBar;
let signUpDialog: SignUpDialog;
let loginDialog: LoginDialog;
let testUsername: string;
let testPassword: string;

test.describe.serial('Valid Auth Flow', () => {
  test.beforeAll(async ({ browser }) => {
	const projectName = test.info().project.name;
	const creds = getTestCredentials(projectName);
    testUsername = creds.testUsername;
    testPassword = creds.testPassword;
    page = await browser.newPage();
    await page.goto('/');
    navBar = new NavBar(page);
    signUpDialog = new SignUpDialog(page);
    loginDialog = new LoginDialog(page);
  });

  test('Sign up with valid credentials', async () => {
	  await navBar.clickSignUp();
	  await signUpDialog.fillUsername(testUsername);
	  await signUpDialog.fillPassword(testPassword);
	  await signUpDialog.submit();
	  const dialogPromise = page.waitForEvent('dialog');
	  const dialog = await dialogPromise;

	  expect(dialog.message()).toBe('Sign up successful.');
	  await dialog.dismiss();	
	});
	
	test('Log in with newly created user', async () => {
		await navBar.clickLogin();
		await loginDialog.fillUsername(testUsername);
		await loginDialog.fillPassword(testPassword);
		await loginDialog.submit();
		page.once('dialog', dialog => { console.log(`Dialog message: ${dialog.message()}`); dialog.dismiss().catch(() => {}); });
		await expect(navBar.nameOfUserLocator).toContainText(`Welcome ${testUsername}`)
	});

	test.afterAll(async () => {
	  // TODO: Delete test user from database to prevent clutter
	  await page.close();
	});
});
