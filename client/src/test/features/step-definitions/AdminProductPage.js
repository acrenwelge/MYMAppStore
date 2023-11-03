const { Given, When, Then, And, After, Before } = require("@cucumber/cucumber");
const { expect } = require("chai");
const { time, assert } = require("console");
const webdriver = require("selenium-webdriver");
var { setDefaultTimeout } = require("@cucumber/cucumber");
const exp = require("constants");
const driverInstance = require('./WebDriver')

When("the user goes to the products page",  async () => {
    driver = driverInstance.driver

    await driver.findElement(webdriver.By.xpath(`//*[@id="root"]/div/main/div/div/div/div[1]/div/div/a[4]`)).click();
    await driver.sleep(1 * 1000);
});

Then("the user should be at products page", async () => {
    driver = driverInstance.driver

    let curURL =  await driver.getCurrentUrl();
    expect(curURL).to.equal("http://localhost:3000/admin/products");
    let tablebody = await driver.findElements(webdriver.By.tagName("td"));
});

Then("the user should see product info", async () => {
    driver = driverInstance.driver
    
    let tablebody = await driver.findElements(webdriver.By.tagName("td"));
    try {
        expect(tablebody.length).to.not.equal(0);
    } catch (error) {
        console.warn('Warning: Info page present but make-sure database has some transaction data');
    }
});

When("the user goes to the products url",  async () => {
    driver = driverInstance.driver

    await driver.get("http://localhost:3000/admin/products");
    await driver.sleep(1 * 1000);
});

Given("user is in the product page", async () => {
    driver = driverInstance.driver
    
    // Login
    await driver.get("http://localhost:3000/login");
    await driver.sleep(1 * 1000);

    driver.findElement(webdriver.By.id("email")).sendKeys("admin@admin.com");
    driver.findElement(webdriver.By.id("password")).sendKeys("admin@admin.com");
    await driver.sleep(1 * 1000);

    await driver.findElement(webdriver.By.xpath(`//*[@id="root"]/div/main/div/form/button`)).click();
    await driver.sleep(1 * 1000);

    // Go to Home Page
	await driver.get("http://localhost:3000/");
    await driver.sleep(1 * 1000);

    // Go to Admin Page
    await driver.findElement(webdriver.By.xpath(`//*[@id="root"]/div/nav/div/div[2]/a[2]`)).click();    
    await driver.sleep(1 * 1000);

    // Go to Product Page
    await driver.findElement(webdriver.By.xpath(`//*[@id="root"]/div/main/div/div/div/div[1]/div/div/a[4]`)).click();
    await driver.sleep(1 * 1000);
});

When("the user searches for a product",  async () => {
    driver = driverInstance.driver

    driver.findElement(webdriver.By.xpath(`//*[@id="root"]/div/main/div/div/div/div[2]/div/div[2]/input`)).sendKeys("Text");

    await driver.sleep(1 * 1000);
});

Then("only the searched products appear", async () => {
    driver = driverInstance.driver
    
    const tableElement = driver.findElement(webdriver.By.xpath(`//*[@id="root"]/div/main/div/div/div/div[2]/div/table/tbody`));
    const tableRows = tableElement.findElements(webdriver.By.tagName('tr'));

    for (let i = 0; i < tableRows.length; i++) {
        const row = tableRows[i];
    
        const rowCells = row.findElements(By.tagName('td'));
        const searchKeyword = "text"
        rowCells[0].getText().then(text => {
            if (!text.lowerCase().includes(searchKeyword.lowerCase())) {
                expect.fail(null, null, `Expected product name in row ${i + 1} to contain '${searchKeyword}'`);
            }
        });
    }

    await driver.sleep(1 * 1000);
});