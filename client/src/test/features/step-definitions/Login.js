const { Given, When, Then, And, After, Before } = require("@cucumber/cucumber");
const { expect } = require("chai");
const { time, assert } = require("console");
const webdriver = require("selenium-webdriver");
var { setDefaultTimeout } = require("@cucumber/cucumber");
const exp = require("constants");

//const options = new Chrome.Options();

// Set default timeout to 60 seconds
setDefaultTimeout(60 * 1000);

// Declare driver variable
let driver;

// Set up Before and After hooks
Before(function (env) {
 driver = new webdriver.Builder().forBrowser("chrome").build();
});

After(function () {
 driver.quit();
});

//场景
Given("user navigates to the website to login", async () => {
	await driver.get("http://localhost:3000/login");
	await driver.sleep(3 * 1000);
	//setTimeout(myFunction, 10000);
});



When("I type {string} and {string} as email and password",  async (email, password) => {
//When("the user enters their email and password", async () => {
    driver.findElement(webdriver.By.id("email")).sendKeys(email);
    driver.findElement(webdriver.By.id("password")).sendKeys(password);
	await driver.sleep(6 * 1000);
});

When("I click on 'login'", async () => {
    await driver.findElement(webdriver.By.xpath(`//*[@id="root"]/div/main/div/form/button`)).click();
 await driver.sleep(6 * 1000);
});

// Scenario 1: Successful Login with Valid Entries
Then("login must be successful.", async () => {
 let curURL =  await driver.getCurrentUrl();
    expect(curURL).to.equal("http://localhost:3000/");

 //console.log(curURL);
    //expect(curURL).to.equal("http://localhost:3000/");
});

//Scenario 2: Unsuccessful Login with Invalid Password
Then("unsuccessful login due to an invalid password.", async () => {
	let errorMsg = await driver.findElement(webdriver.By.className("ui error message")).getText();
	expect(errorMsg).to.equal("Incorrect email or password. Please ensure your email and password are correct and try again.");
});

//Scenario 3: Unsuccessful Login with Invalid email
//Pages -》 Login ——》 LocalLoginForm ---
//js Find element , 找到页面上面的元素
Then("unsuccessful login due to an invalid email.", async () => {
	let errorMsg = await driver.findElement(webdriver.By.className("ui error message")).getText();
	expect(errorMsg).to.equal("Incorrect email or password. Please ensure your email and password are correct and try again.");
});

/*Scenario4: Unsuccessful Login with unconfirmed email
Given user navigates to the website to login
When I type 'dddddddd@me.com' and 'yushuang' as email and password
And I click on 'login'
Then unsuccessful login due to an email address unconfirmed.*/

Then("unsuccessful login due to an email address unconfirmed.", async () => {
    let errorMsg = await driver.findElement(webdriver.By.className("ui error message")).getText();
    expect(errorMsg).to.equal("Account is not activated. Please check your email to confirm your account.");
});
