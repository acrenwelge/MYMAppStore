const { Given, When, Then, And, AfterAll, Before } = require("@cucumber/cucumber");
const { expect } = require("chai");
const { time, assert } = require("console");
const webdriver = require("selenium-webdriver");
var { setDefaultTimeout } = require("@cucumber/cucumber");
const exp = require("constants");
const driverInstance = require('./WebDriver');

// Background:
//     Given user is logged in
//     And has an item in the cart
//     And is on the checkout page

Given("user is logged in", async function () {
	driver = driverInstance.driver
    
    // log in using a premade instructor account
    // this instructor account has a class with at least one student
    await driver.get('http://localhost:3000/login')
    await driver.findElement(webdriver.By.id("email")).sendKeys('test@test.com')
    await driver.findElement(webdriver.By.id("password")).sendKeys('password')
    await driver.findElement(webdriver.By.xpath(`//*[@id="root"]/div/main/div/form/button`)).click()
    await driver.sleep(500)
})

Given("has an item in the cart", async function () {
	driver = driverInstance.driver
    await driver.get('http://localhost:3000/products')
	const addBtn = await driver.wait(
		webdriver.until.elementLocated(webdriver.By.id('add-to-cart-1')),
		2000
	)
	await addBtn.click()
	
})

Given("is on the checkout page", async () => {
	driver = driverInstance.driver
	const toCheckoutBtn = await driver.wait(
		webdriver.until.elementLocated(webdriver.By.xpath("//a[@class='ui green button']")),
		2000
	)
	await toCheckoutBtn.click()
});


When("I enter a valid purchase code",  async () => {
	driver = driverInstance.driver
	const pcField = await driver.wait(
		webdriver.until.elementLocated(webdriver.By.id("purchasecode")),
		2000
	)
	await pcField.sendKeys("free");
});


When("I click the apply button", async () => {
	driver = driverInstance.driver
    
	const applyBtn = await driver.wait(
		webdriver.until.elementLocated(webdriver.By.className(`ui small positive button`)),
		2000
	)
	await applyBtn.click()
});


// Scenario 1 Checkout:  Checking out with a valid purchase code succussfully
// Then the purchase code should be applied and the discount should be reflected in the total amount to be paid
Then("the purchase code should be applied", async () => {
	driver = driverInstance.driver
    const successToast = await driver.wait(
		webdriver.until.elementLocated(webdriver.By.className("ui success message")),
		2000
	)
	const successMsg = await successToast.getText();
	expect(successMsg).to.contains("SUCCESS");
});


// Scenario 2: Checking out with an invalid purchase code
// Then an error message should be displayed, indicating that the purchase code is invalid
When("I enter an invalid purchase code",  async () => {
	driver = driverInstance.driver
	await driver.findElement(webdriver.By.id("purchasecode")).sendKeys("duyun");
});


Then("an error message should be displayed", async () => {
    driver = driverInstance.driver
    const successToast = await driver.wait(
		webdriver.until.elementLocated(webdriver.By.className("ui error message")),
		2000
	)
	const successMsg = await successToast.getText();
	expect(successMsg).to.contains("ERROR");
});


