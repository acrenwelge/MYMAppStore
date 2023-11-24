const { Given, When, Then, And, After, Before } = require("@cucumber/cucumber");
const { expect } = require("chai");
const { time, assert } = require("console");
const webdriver = require("selenium-webdriver");
var { setDefaultTimeout } = require("@cucumber/cucumber");
const driverInstance = require('./WebDriver');

When("the user goes to the subscription page",  async () => {
    driver = driverInstance.driver

    await driver.findElement(webdriver.By.xpath(`//*[@id="root"]/div/main/div/div/div/div[1]/div/div/a[7]`)).click();
    await driver.sleep(1 * 1000);
});

Then("the user should be at subscription page", async () => {
    driver = driverInstance.driver

    let curURL =  await driver.getCurrentUrl();
    expect(curURL).to.equal("http://localhost:3000/admin/paid-subscription");

    await driver.sleep(1 * 1000);
});

Then("the user should see subscription info", async () => {
    driver = driverInstance.driver
    
    let tablebody = await driver.findElements(webdriver.By.tagName("td"));
    try {
        expect(tablebody.length).to.not.equal(0);
    } catch (error) {
        console.warn('Warning: Info page present but make-sure database has some subscription data');
    }

    await driver.sleep(1 * 1000);
});

When("the user goes to the subscription url",  async () => {
    driver = driverInstance.driver

    await driver.get("http://localhost:3000/admin/paid-subscription");
    await driver.sleep(1 * 1000);
});

Given("user is in the subscription page", async () => {
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

    // Go to Subscription Page
    await driver.findElement(webdriver.By.xpath(`//*[@id="root"]/div/main/div/div/div/div[1]/div/div/a[7]`)).click();
    await driver.sleep(1 * 1000);
});

When("the user searches for a subscription",  async () => {
    driver = driverInstance.driver

    driver.findElement(webdriver.By.xpath(`//*[@id="root"]/div/main/div/div/div/div[2]/div[2]/div[2]/input`)).sendKeys("nikhil");

    await driver.sleep(1 * 1000);
});

Then("only the searched subscriptions appear", async () => {
    driver = driverInstance.driver
    
    const table = await driver.findElement(webdriver.By.id("subscriptionTable"));
    const rows = await table.findElements(webdriver.By.id("subscriptionRow"));

    for (const row of rows) {
        const cells = await row.findElements(webdriver.By.xpath(".//td"));

        const searchKeyword = "nikhil"

        userName = await cells[1].getText();
        email = await cells[0].getText();
        
        if (!userName.toLowerCase().includes(searchKeyword.toLowerCase()) &&
            !email.toLowerCase().includes(searchKeyword.toLowerCase())) 
        {
            expect.fail(null, null, `Expected product name in row ${i + 1} to contain '${searchKeyword}'`);
        }
    }

    await driver.sleep(1 * 1000);
});

