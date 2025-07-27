const { test } = require('@playwright/test');
const resources = require('../../src/LoadResources.js');
const { validateElementVisible, validateElementNotVisible, elementToHaveText } = require('../../src/TestUtils/ValidationHelper.js')
const { clickOn, enterTextInto, waitForPageLoad } = require('../../src/TestUtils/ActionsHelper.js')
const { navigateTo } = require('../../src/DriverControls.js')

test.describe.configure({ mode: 'serial' });

test.beforeEach(async () => {
    await navigateTo('sauceDemo');
});

test.describe('@runTest', () => {

    test('Login Page Validations', async () => {

        await resources.setPage('saucedemo-login');
        await validateElementVisible('PageElements.Heading');
        await validateElementVisible('PageElements.LoginDescriptionBox');
        await validateElementVisible('PageElements.LoginUsernameColumn');
        await validateElementVisible('PageElements.LoginPasswordColumn');

    });

    test('Login Error Validations', async () => {

        await resources.setPage('saucedemo-login');
        await clickOn('LoginElements.LoginButton');
        await validateElementVisible('Errors.errorIconUsername');
        await validateElementVisible('Errors.errorIconPassword');
        await elementToHaveText('Errors.errorMessageText', "Epic sadface: Username is required");

        //close error
        await clickOn('Errors.errorMessageClose');
        await validateElementNotVisible('Errors.errorMessageText');
        await validateElementNotVisible('Errors.errorIconUsername');
        await validateElementNotVisible('Errors.errorIconPassword');

        //invalid username & password
        await enterTextInto('LoginElements.UserName', "standard_user1");
        await enterTextInto('LoginElements.PassWord', "secret_sauce1");
        await clickOn('LoginElements.LoginButton');
        await validateElementVisible('Errors.errorIconUsername');
        await validateElementVisible('Errors.errorIconPassword');
        await elementToHaveText('Errors.errorMessageText', "Epic sadface: Username and password do not match any user in this service");

        //close error
        await clickOn('Errors.errorMessageClose');
        await validateElementNotVisible('Errors.errorIconUsername');
        await validateElementNotVisible('Errors.errorIconPassword');
    });


    test('Login Test data validations', async () => {

        const testData = require('../../resources/SauceDemo_TestData.json');
        
        for (const { username, password } of testData) {

            await resources.setPage('saucedemo-login');
            await enterTextInto('LoginElements.UserName', username);
            await enterTextInto('LoginElements.PassWord', password);
            await clickOn('LoginElements.LoginButton');

            await waitForPageLoad();
            await resources.setPage('saucedemo-product-page');
            await elementToHaveText('Header.Title', "Swag Labs");
            await clickOn('Header.HamburgerIcon');
            await clickOn('Hamburger.Logout');


        }
    });
});
