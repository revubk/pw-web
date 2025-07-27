const { test } = require('@playwright/test');
const resources = require('../../src/LoadResources.js');
const {
    validateElementVisible,
    elementToHaveText,
    visibleInstances
} = require('../../src/TestUtils/ValidationHelper.js')
const { CountOf } = require('../../src/TestUtils/CaptureHelper.js')
const { clickOn, enterTextInto, waitForPageLoad } = require('../../src/TestUtils/ActionsHelper.js')
const { navigateTo } = require('../../src/DriverControls.js')

test.describe.configure({ mode: 'serial' });

test.beforeEach('Login to Product page', async () => {
    await navigateTo('sauceDemo');
    await resources.setPage('saucedemo-login');

    const testData = require('../../resources/SauceDemo_TestData.json');
    await enterTextInto('LoginElements.UserName', testData[0].username);
    await enterTextInto('LoginElements.PassWord', testData[0].password);
    await clickOn('LoginElements.LoginButton');

    await waitForPageLoad();
    await resources.setPage('saucedemo-product-page');
});

test.describe('@runTest', () => {

    test('Validate the Product Page', async () => {

        await elementToHaveText('MainContainer.Title', "Products");
        await validateElementVisible('MainContainer.FilterButton');
        await validateElementVisible('MainContainer.CartIcon');
        await validateElementVisible('MainContainer.InventoryList');


        //validate 6 products and their elements
        await visibleInstances('MainContainer.InventoryItem', 6);
        await visibleInstances('MainContainer.ProductImage', 6);
        await visibleInstances('MainContainer.ProductName', 6);
        await visibleInstances('MainContainer.ProductDescription', 6);
        await visibleInstances('MainContainer.AddToCart', 6);
        await visibleInstances('MainContainer.ProductPrice', 6);



        //validate all products have the elements
        const productsCount = await CountOf('MainContainer.InventoryItem');
        await visibleInstances('MainContainer.ProductImage', productsCount);
        await visibleInstances('MainContainer.ProductName', productsCount);
        await visibleInstances('MainContainer.ProductDescription', productsCount);
        await visibleInstances('MainContainer.AddToCart', productsCount);
        await visibleInstances('MainContainer.ProductPrice', productsCount);

    });
});
