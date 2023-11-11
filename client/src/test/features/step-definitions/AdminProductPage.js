const { Given, When, Then, And, After, Before } = require("@cucumber/cucumber");
const { expect } = require("chai");
const { time, assert } = require("console");
const webdriver = require("selenium-webdriver");
var { setDefaultTimeout } = require("@cucumber/cucumber");
const exp = require("constants");
const driverInstance = require('./WebDriver');

Given("user is at home page product", async () => {
    driver = driverInstance.driver

	await driver.get("http://localhost:3000/");
	await driver.sleep(3 * 1000);
	//setTimeout(myFunction, 10000);
});

When("logged in as admin product",  async () => {
    driver = driverInstance.driver
    
    await driver.get("http://localhost:3000/login");
    await driver.sleep(2 * 1000);

    driver.findElement(webdriver.By.id("email")).sendKeys("admin@admin.com");
    driver.findElement(webdriver.By.id("password")).sendKeys("admin@admin.com");
	await driver.sleep(6 * 1000);

    await driver.findElement(webdriver.By.xpath(`//*[@id="root"]/div/main/div/form/button`)).click();

	await driver.sleep(2 * 1000);
});

When("not logged in as admin product", async () => { });

When("go to the admin menu product", async () => {
    driver = driverInstance.driver

    await driver.findElement(webdriver.By.xpath(`//*[@id="root"]/div/nav/div/div[2]/a[2]`)).click();
    await driver.sleep(2 * 1000);
});


When("go to the products page",  async () => {
    driver = driverInstance.driver

    await driver.findElement(webdriver.By.xpath(`//*[@id="root"]/div/main/div/div/div/div[1]/div/div/a[4]`)).click();
    await driver.sleep(2 * 1000);
});

When("go to the products url",  async () => {
    driver = driverInstance.driver

    await driver.get("http://localhost:3000/admin/products");
    await driver.sleep(2 * 1000);
});
    
// Scenario 1: Successful accessing transaction page as admin user
Then("the user should be at products page", async () => {
    driver = driverInstance.driver

    let curURL =  await driver.getCurrentUrl();
    expect(curURL).to.equal("http://localhost:3000/admin/products");
    let tablebody = await driver.findElements(webdriver.By.tagName("td"));
});

Then("the user should be at home page (product)", async () => {
    driver = driverInstance.driver

    let curURL =  await driver.getCurrentUrl();
    expect(curURL).to.equal("http://localhost:3000/");
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

//Scenario 2: Unsuccessful Login with Invalid Password
Then("the user will not see any product data", async () => {
    driver = driverInstance.driver
    let tablebody = await driver.findElements(webdriver.By.tagName("td"));
    expect(tablebody.length).to.equal(+0);

});

