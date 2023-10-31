const { Given, When, Then, And, After, Before } = require("@cucumber/cucumber");
const { expect } = require("chai");
const { time, assert } = require("console");
const webdriver = require("selenium-webdriver");
var { setDefaultTimeout } = require("@cucumber/cucumber");
const exp = require("constants");
const driverInstance = require('./WebDriver');

Given("user navigates to the website to login", async () => {
    driver = driverInstance.driver
    
	await driver.get("http://localhost:3000/login");
	await driver.sleep(3 * 1000);
	//setTimeout(myFunction, 10000);
});

When("I type {string} and {string} as email and password",  async (email, password) => {
    driver = driverInstance.driver
    
//When("the user enters their email and password", async () => {
    driver.findElement(webdriver.By.id("email")).sendKeys(email);
    driver.findElement(webdriver.By.id("password")).sendKeys(password);
	await driver.sleep(6 * 1000);
});

When("I click on 'login'", async () => {
    driver = driverInstance.driver
    
    await driver.findElement(webdriver.By.xpath(`//*[@id="root"]/div/main/div/form/button`)).click();
    await driver.sleep(6 * 1000);
});

// Scenario 1: Successful Login with Valid Entries
Then("login must be successful.", async () => {
    driver = driverInstance.driver
    
    let curURL =  await driver.getCurrentUrl();
    expect(curURL).to.equal("http://localhost:3000/");

 //console.log(curURL);
    //expect(curURL).to.equal("http://localhost:3000/");
});

//Scenario 2: Unsuccessful Login with Invalid Password
Then("unsuccessful login due to an invalid password.", async () => {
    driver = driverInstance.driver
    
	let errorMsg = await driver.findElement(webdriver.By.className("ui error message")).getText();
	expect(errorMsg).to.equal("Incorrect email or password. Please ensure your email and password are correct and try again.");
});

//Scenario 3: Unsuccessful Login with Invalid email
//Pages -》 Login ——》 LocalLoginForm ---
//js Find element , 找到页面上面的元素
Then("unsuccessful login due to an invalid email.", async () => {
    driver = driverInstance.driver
    
	let errorMsg = await driver.findElement(webdriver.By.className("ui error message")).getText();
	expect(errorMsg).to.equal("Incorrect email or password. Please ensure your email and password are correct and try again.");
});





//-----user confirmation-----


/*Scenario4: Unsuccessful Login with unconfirmed email
Given user sign up and navigates to the website to login without confirming
When I type 'dddddddd@me.com' and 'yushuang' as email and password
And I click on 'login'
Then unsuccessful login due to an email address unconfirmed.*/

function generateRandomString(length) {
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

const randomName = generateRandomString(10); // generates a random string of length 10
const randomEmail = randomName + '@me.com'
Given("user sign up and navigates to the website to login without confirming", async () => {
    driver = driverInstance.driver
    
    //sign up:
    await driver.get("http://localhost:3000/sign-up");
    await driver.sleep(3 * 1000);

    driver.findElement(webdriver.By.id("name")).sendKeys(randomName);
    driver.findElement(webdriver.By.id("email")).sendKeys(randomEmail);
    driver.findElement(webdriver.By.id("confirmEmail")).sendKeys(randomEmail);
    driver.findElement(webdriver.By.id("password")).sendKeys("123");
    driver.findElement(webdriver.By.id("confirmPassword")).sendKeys("123");
    await driver.sleep(6 * 1000);

    await driver.findElement(webdriver.By.className("ui green active fluid button")).click();
    await driver.sleep(6 * 1000);

    await driver.get("http://localhost:3000/login");
    await driver.sleep(3 * 1000);
    //setTimeout(myFunction, 10000);
});

When("I type in email and password",  async () => {
    driver = driverInstance.driver
    
    driver.findElement(webdriver.By.id("email")).sendKeys(randomEmail);
    driver.findElement(webdriver.By.id("password")).sendKeys("123");
    await driver.sleep(6 * 1000);
});

Then("unsuccessful login due to an email address unconfirmed", async () => {
    driver = driverInstance.driver
    
    await driver.sleep(6 * 1000);
    let errorMsg = await driver.findElement(webdriver.By.className("ui error message")).getText();
    expect(errorMsg).to.equal("Account is not activated. Please check your email to confirm your account.");
});





//Scenario 5: Successful activation

//Scenario: Successful activation
//    Given user sign up
//    When user go to the activate url
//    Then account is activated in activate link

Given("user sign up", async () => {
    driver = driverInstance.driver
    
    //sign up:
    await driver.get("http://localhost:3000/sign-up");
    await driver.sleep(3 * 1000);

    driver.findElement(webdriver.By.id("name")).sendKeys(randomName);
    driver.findElement(webdriver.By.id("email")).sendKeys(randomEmail);
    driver.findElement(webdriver.By.id("confirmEmail")).sendKeys(randomEmail);
    driver.findElement(webdriver.By.id("password")).sendKeys("123");
    driver.findElement(webdriver.By.id("confirmPassword")).sendKeys("123");
    await driver.sleep(6 * 1000);

    await driver.findElement(webdriver.By.className("ui green active fluid button")).click();
    await driver.sleep(6 * 1000);

    //setTimeout(myFunction, 10000);
});
When("user go to the activate url from email",  async () => {
    driver = driverInstance.driver
    
    //confirm:
    await driver.get("http://localhost:3000/activate?activationCode=naomi2049"+randomName+"114514");
    await driver.sleep(6 * 1000);
});
Then("account is activated in activate link", async () => {
    driver = driverInstance.driver
    
    let successMsg = await driver.findElement(webdriver.By.className("ui segment")).getText();
    expect(successMsg).to.equal("Your account has been activated. Please login with the email and password of your account.");
});



/*
Scenario 6: Unsuccessful activation due to wrong url
    Given user sign up
    When user go to wrong activate url
    Then account is not activated in activate link
*/
When("user go to wrong activate url",  async () => {
    driver = driverInstance.driver
    
    //confirm:
    await driver.get("http://localhost:3000/activate?activationCode=h234234");
    await driver.sleep(6 * 1000);
});
Then("account is not activated in activate link", async () => {
    driver = driverInstance.driver
    
    let Msg = await driver.findElement(webdriver.By.className("ui segment")).getText();
    expect(Msg).to.equal("This activation code is not associated with any account. Please sign up.");
});

