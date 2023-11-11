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
	await driver.sleep(3 * 1000);
	//setTimeout(myFunction, 10000);
});

When("login as admin",  async () => {
    driver = driverInstance.driver
    
    await driver.get("http://localhost:3000/login");
    await driver.sleep(3 * 1000);

    driver.findElement(webdriver.By.id("email")).sendKeys("ncc@me.com");
    driver.findElement(webdriver.By.id("password")).sendKeys("ncc");
	await driver.sleep(6 * 1000);

	await driver.get("http://localhost:3000/");
	await driver.sleep(3 * 1000);

});

When("not login as admin",  async () => { });


When("go to the admin url",  async () => {
    driver = driverInstance.driver
    
    await driver.get("http://localhost:3000/admin/user");
    await driver.sleep(3 * 1000);
});
    
// Scenario 1: Successful Login with Valid Entries
Then("the user should be at admin page and see info.", async () => {
    driver = driverInstance.driver
    
    let curURL =  await driver.getCurrentUrl();
    expect(curURL).to.equal("http://localhost:3000/admin/user");

 //console.log(curURL);
    //expect(curURL).to.equal("http://localhost:3000/");
});

//Scenario 2: Unsuccessful Login with Invalid Password
Then("the user will be redirect to the home page.", async () => {
    driver = driverInstance.driver
    
    let curURL =  await driver.getCurrentUrl();
    expect(curURL).to.equal("http://localhost:3000/");
});

