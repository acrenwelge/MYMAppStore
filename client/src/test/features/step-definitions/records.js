const { Given, When, Then, And, After, Before } = require("@cucumber/cucumber");
const { expect } = require("chai");
const { time, assert } = require("console");
const webdriver = require("selenium-webdriver");
var { setDefaultTimeout } = require("@cucumber/cucumber");
const exp = require("constants");
const driverInstance = require('./WebDriver');

When("login as user",  async () => {
    driver = driverInstance.driver
    
    await driver.get("http://localhost:3000/login");
    await driver.sleep(3 * 1000);

    driver.findElement(webdriver.By.id("email")).sendKeys("ncc@me.com");
    driver.findElement(webdriver.By.id("password")).sendKeys("ncc");
	await driver.sleep(3 * 1000);
    await driver.findElement(webdriver.By.xpath(`//*[@id="root"]/div/main/div/form/button`)).click();
 	await driver.sleep(6 * 1000);

	    await driver.get("http://localhost:3000/");
	    await driver.sleep(3 * 1000);

});

When("not login",  async () => { });


When("go to the record url",  async () => {
    driver = driverInstance.driver
    
    await driver.get("http://localhost:3000/subscriptions");
    await driver.sleep(3 * 1000);
        //When("the user enters their email and password", async () => {
        });
    
// Scenario 1: Successful Login with Valid Entries
Then("the user will see the record table.", async () => {
    driver = driverInstance.driver
    
    let curURL =  await driver.getCurrentUrl();
    expect(curURL).to.equal("http://localhost:3000/subscriptions");

 //console.log(curURL);
    //expect(curURL).to.equal("http://localhost:3000/");
});

//Scenario 2: Unsuccessful Login with Invalid Password
Then("the user will be redirect to main page.", async () => {
    driver = driverInstance.driver
    
    let curURL =  await driver.getCurrentUrl();
    expect(curURL).to.equal("http://localhost:3000/");
});

