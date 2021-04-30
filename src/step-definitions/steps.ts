import { Given, Then, When, DataTable } from '@cucumber/cucumber';
import { LoginPage } from '../pages/login.page';
import SecurePage from '../pages/secure.page';

const loginPage:LoginPage = new LoginPage();

Given(/^I am on the (\w+) page$/, async function (page: string) {
    console.log("I'll open "+page);
    await loginPage.open();
});

When(/^I login with (\w+) and (.+)$/, async function (username:string, password:string) {
    await loginPage.login(username, password)
});

Then(/^I should see a flash message saying (.*)$/, async function (message:string) {
    await expect(SecurePage.flashAlert).toBeExisting();
    await expect(SecurePage.flashAlert).toHaveTextContaining(message);
    console.log("!!!!!!!!!!");
    // await new Promise(resolve => setTimeout(resolve, 5 * 1000));
});

Then(/^Test step$/, async function (table: DataTable) {
    // const world: CustomWorld<any> = new CustomWorld<any>();
    const a: any = table.hashes()[0]
    this.keepValue("Test", a);
    browser.pause(5000);
});

