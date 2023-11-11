const { Given, When, Then, And, After, Before } = require("@cucumber/cucumber");
const { expect } = require("chai");
const { time, assert } = require("console");
const webdriver = require("selenium-webdriver");
var { setDefaultTimeout } = require("@cucumber/cucumber");
const exp = require("constants");
const driverInstance = require('./WebDriver');

Given("user is in home page", async () => {
    driver = driverInstance.driver

	await driver.get("http://localhost:3000/");
	await driver.sleep(1 * 1000);
});

When("the user is logged in in as admin",  async () => {
    driver = driverInstance.driver
    
    await driver.get("http://localhost:3000/login");
    await driver.sleep(1 * 1000);

    driver.findElement(webdriver.By.id("email")).sendKeys("admin@admin.com");
    driver.findElement(webdriver.By.id("password")).sendKeys("admin@admin.com");
    await driver.sleep(1 * 1000);

    await driver.findElement(webdriver.By.xpath(`//*[@id="root"]/div/main/div/form/button`)).click();
	await driver.sleep(1 * 1000);

    await driver.get("http://localhost:3000/");
    await driver.sleep(1 * 1000);
});

When("the user is not logged in in as admin",  async () => { });

When("the user clicks on admin button",  async () => {
    driver = driverInstance.driver

    await driver.findElement(webdriver.By.xpath(`//*[@id="root"]/div/nav/div/div[2]/a[2]`)).click();    
    await driver.sleep(1 * 1000);
});

When("the user goes to the admin url",  async () => {
    driver = driverInstance.driver
    
    await driver.get("http://localhost:3000/admin/user");
    await driver.sleep(1 * 1000);
});
    
Then("the user should be in admin page", async () => {
    driver = driverInstance.driver
    
    let curURL =  await driver.getCurrentUrl();
    expect(curURL).to.equal("http://localhost:3000/admin/user");
});

Then("the user will be redirected to the home page", async () => {
    driver = driverInstance.driver
    
    let curURL =  await driver.getCurrentUrl();
    expect(curURL).to.equal("http://localhost:3000/");
});

When("the user selects the category {string} to sort", async (category) => {
    driver = driverInstance.driver

    const buttonSelector = webdriver.By.xpath(`//*[text()='${category}']`);
    await driver.findElement(buttonSelector).click();
    await driver.sleep(1 * 1000);
});

Then("the table will be sorted by {string} in {string} order", async (dataType, orderType) => {
    driver = driverInstance.driver

    const tableElement = driver.findElement(webdriver.By.xpath(`//*[@id="root"]/div/main/div/div/div/div[2]/div/table/tbody`));
    const tableRows = tableElement.findElements(webdriver.By.tagName('tr'));

    let a = undefined;
    for (let i = 0; i < tableRows.length; i++) {
        const row = tableRows[i];
    
        const rowCells = row.findElements(By.tagName('td'));

        switch(dataType)
        {
            case "string":
                rowCells[0].getText().then(b => {
                    const compareVal = orderType === "ascending" ? 1 : -1;
                    if (a !== undefined && a.localeCompare(b) === compareVal) {
                        expect.fail(null, null, `Expected '${a}' to come before '${b}'`);
                    }
                    a = b
                });
                break;
            case "integer":
                rowCells[0].getText().then(b => {
                    b = parseInt(b, 10);

                    const compareVal = orderType === "ascending" ? 1 : -1;
                    result = a < b ? -1 : a > b ? 1 : 0;
                    if (a !== undefined && result === compareVal) {
                        expect.fail(null, null, `Expected '${a}' to come before '${b}'`);
                    }
                    a = b
                });
                break;
            case "date":
                rowCells[0].getText().then(b => {
                    b = new Date(b);

                    const compareVal = orderType === "ascending" ? 1 : -1;
                    result = a < b ? -1 : a > b ? 1 : 0;
                    if (a !== undefined && result === compareVal) {
                        expect.fail(null, null, `Expected '${a}' to come before '${b}'`);
                    }
                    a = b
                });
                break;
        }
    }
    await driver.sleep(1 * 1000);
});

Then("the table will only have rows where column number {int} is true", async (columnNumber) => {
    driver = driverInstance.driver

    const tableElement = driver.findElement(webdriver.By.xpath(`//*[@id="root"]/div/main/div/div/div/div[2]/div/table/tbody`));
    const tableRows = tableElement.findElements(webdriver.By.tagName('tr'));

    for (let i = 0; i < tableRows.length; i++) {
        const row = tableRows[i];
    
        const rowCells = row.findElements(By.tagName('td'));

        const cellnumber = rowCells[columnNumber];

        const hasBlueCheck = await cellnumber.getAttribute('class').includes('checkmark');

        assert.strictEqual(hasBlueCheck, true);
    }

    await driver.sleep(1 * 1000);
});

Then("the table will only have rows where column number {int} is false", async (columnNumber) => {
    driver = driverInstance.driver

    const tableElement = driver.findElement(webdriver.By.xpath(`//*[@id="root"]/div/main/div/div/div/div[2]/div/table/tbody`));
    const tableRows = tableElement.findElements(webdriver.By.tagName('tr'));

    for (let i = 0; i < tableRows.length; i++) {
        const row = tableRows[i];
    
        const rowCells = row.findElements(By.tagName('td'));

        const cellnumber = rowCells[columnNumber];

        const hasBlueCheck = await cellnumber.getAttribute('class').includes('checkmark');

        assert.strictEqual(hasBlueCheck, false);
    }

    await driver.sleep(1 * 1000);
});

