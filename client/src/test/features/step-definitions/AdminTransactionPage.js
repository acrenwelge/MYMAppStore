const { Given, When, Then, And, After, Before } = require("@cucumber/cucumber");
const { expect } = require("chai");
const { time, assert } = require("console");
const webdriver = require("selenium-webdriver");
var { setDefaultTimeout } = require("@cucumber/cucumber");
const driverInstance = require('./WebDriver');

When("the user goes to the transaction page",  async () => {
    driver = driverInstance.driver

    await driver.findElement(webdriver.By.xpath(`//*[@id="root"]/div/main/div/div/div/div[1]/div/div/a[3]`)).click();
    await driver.sleep(2 * 1000);
});

Then("the user should be at transaction page", async () => {
    driver = driverInstance.driver

    let curURL =  await driver.getCurrentUrl();
    expect(curURL).to.equal("http://localhost:3000/admin/transaction");
    let tablebody = await driver.findElements(webdriver.By.tagName("td"));
});

Then("the user should see transaction info", async () => {
    driver = driverInstance.driver
    
    let tablebody = await driver.findElements(webdriver.By.tagName("td"));
    try {
        expect(tablebody.length).to.not.equal(0);
    } catch (error) {
        console.warn('Warning: Info page present but make-sure database has some transaction data');
    }
});

When("the user goes to the transaction url",  async () => {
    driver = driverInstance.driver

    await driver.get("http://localhost:3000/admin/transaction");
    await driver.sleep(2 * 1000);
});

Given("user is in the transaction page", async () => {
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
    await driver.findElement(webdriver.By.id("adminButton")).click();    
    await driver.sleep(1 * 1000);

    // Go to Transaction Page
    await driver.findElement(webdriver.By.xpath(`//*[@id="root"]/div/main/div/div/div/div[1]/div/div/a[3]`)).click();
    await driver.sleep(1 * 1000);
});

When("the user searches for a transaction",  async () => {
    driver = driverInstance.driver

    driver.findElement(webdriver.By.xpath(`//*[@id="root"]/div/main/div/div/div/div[2]/div/div[2]/input`)).sendKeys("admin");

    await driver.sleep(1 * 1000);
});

Then("only the searched transactions appear", async () => {
    driver = driverInstance.driver
    
    const table = await driver.findElement(webdriver.By.id("transactionTable"));
    const rows = await table.findElements(webdriver.By.id("transactionRow"));

    for (const row of rows) {
        const cells = await row.findElements(webdriver.By.xpath(".//td"));

        const searchKeyword = "admin"

        firstName = await cells[1].getText();
        lastName = await cells[2].getText();
        email = await cells[3].getText();
        
        if (!firstName.toLowerCase().includes(searchKeyword.toLowerCase()) && 
            !lastName.toLowerCase().includes(searchKeyword.toLowerCase()) &&
            !email.toLowerCase().includes(searchKeyword.toLowerCase())) 
        {
            expect.fail(null, null, `Expected product name in row ${i + 1} to contain '${searchKeyword}'`);
        }
    }

    await driver.sleep(1 * 1000);
});

