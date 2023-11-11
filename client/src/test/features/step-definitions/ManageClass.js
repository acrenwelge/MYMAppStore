const { Given, When, Then, After, Before } = require('@cucumber/cucumber')
let { setDefaultTimeout } = require("@cucumber/cucumber")
const { expect } = require('chai')
const { isErrorResponse } = require("selenium-webdriver/lib/error")
const webdriver = require("selenium-webdriver")
const driverInstance = require('./WebDriver');

Given('user is logged in as instructor', async function () {
    driver = driverInstance.driver
    
    // log in using a premade instructor account
    // this instructor account has a class with at least one student
    await driver.get('http://localhost:3000/login')
 	await driver.sleep(1 * 1000)
    await driver.findElement(webdriver.By.id("email")).sendKeys('test@test.com')
    await driver.findElement(webdriver.By.id("password")).sendKeys('password')
    await driver.sleep(1 * 1000)
    await driver.findElement(webdriver.By.xpath(`//*[@id="root"]/div/main/div/form/button`)).click()
    await driver.sleep(1 * 1000)
})

When('not accessing an item', async function () {
    driver = driverInstance.driver
    
    // not accessing an item, so navigate to root
    await driver.get("http://localhost:3000/")
	await driver.sleep(3 * 1000)
})

When('go to the class management url', async function () {
    driver = driverInstance.driver
    
    await driver.get("http://localhost:3000/instructor/class")
	await driver.sleep(1 * 1000)
})

Then('the user should be at class management page with their class information displayed.', async function () {
    driver = driverInstance.driver
    
    expect(function() { driver.findElement(webdriver.By.name("valid-instructor")) }).to.not.throw()
    let msg = await driver.findElement(webdriver.By.name("valid-instructor"))
    expect(msg).to.not.be.null
})

// Scenario: Failed accessing class management page as non-instructor user
//         Given user is not logged in as instructor
//         When not accessing an item
//         And go to the class management url
//         Then the user will not see any class data.

Given('user is not logged in as instructor', async function () {
    driver = driverInstance.driver
    
    // log in using a premade user account
    await driver.get('http://localhost:3000/login')
 	await driver.sleep(1 * 1000)
    await driver.findElement(webdriver.By.id("email")).sendKeys('stutest@test.com')
    await driver.findElement(webdriver.By.id("password")).sendKeys('password')
    await driver.sleep(1 * 1000)
    await driver.findElement(webdriver.By.xpath(`//*[@id="root"]/div/main/div/form/button`)).click()
    await driver.sleep(1 * 1000)
})

Then('the user will not see any class data.', async function () {
    driver = driverInstance.driver
    
    expect(function() { driver.findElement(webdriver.By.name("not-instructor")) }).to.not.throw()
    let msg = await driver.findElement(webdriver.By.name("not-instructor"))
    expect(msg).to.not.be.null
})

// Background:
//         Given user is logged in as instructor
//         When user is at the class management page
let initialNumberOfRows = 0
When('user is at the class management page', async function () {
    driver = driverInstance.driver
    
    await driver.get("http://localhost:3000/instructor/class")
	await driver.sleep(1 * 1000)
    let array = await driver.findElements(webdriver.By.id('instructor-class-table-row'))
    initialNumberOfRows = array.length
})

// Scenario: Successfully adding a student with an existing account
//         And inputs student's email under 'Add Existing User as Student'
//         And clicks 'Add Student'
//         Then student is added to the class and shows in the student list.

When('inputs student\'s email under \'Add Existing User as Student\'', async function() {
    driver = driverInstance.driver
    
    await driver.findElement(webdriver.By.id("existing-email")).sendKeys('stutest@test.com')
    await driver.sleep(1 * 1000)
})

When('clicks \'Add Student\'', async function() {
    driver = driverInstance.driver
    
    await driver.findElement(webdriver.By.id('existing-add')).click()
    await driver.sleep(1 * 1000)
})

Then('student is added to the class and shows in the student list.', async function() {
    driver = driverInstance.driver
    
    let array = await driver.findElements(webdriver.By.id('instructor-class-table-row'))
    expect(array.length).to.equal(initialNumberOfRows+1)
})

// Scenario: Failed adding a student from an existing email since they don't have an account
//         And inputs student's email under 'Add Existing User as Student' with nonexisting
//         And clicks 'Add Student'
//         Then student is not added to the class.
When('inputs student\'s email under \'Add Existing User as Student\' with nonexisting', async function() {
    driver = driverInstance.driver
    
    await driver.findElement(webdriver.By.id("existing-email")).sendKeys('doesnt@exist.com')
    await driver.sleep(1 * 1000)
})

Then('student is not added to the class.', async function() {
    driver = driverInstance.driver
    
    let array = await driver.findElements(webdriver.By.id('instructor-class-table-row'))
    expect(array.length).to.equal(initialNumberOfRows)
})

// *THIS SCENARIO REQUIRES YOU TO DELETE THE ACCOUNT FROM THE DATABASE*
// Scenario: Successfully adding a student without an existing account
//         And inputs student's firstname, lastname, and email under 'Add New User as Student' section
//         Then student is added to the class and shows in the student list.
When('inputs student\'s firstname, lastname, and email without existing', async function() {
    driver = driverInstance.driver
    
    await driver.findElement(webdriver.By.id("new-first-name")).sendKeys('new')
    await driver.findElement(webdriver.By.id("new-last-name")).sendKeys('student')
    await driver.findElement(webdriver.By.id("new-email")).sendKeys('new@test.com')
    await driver.sleep(1 * 1000)
    // click button to submit
    await driver.findElement(webdriver.By.id('new-add')).click()
    await driver.sleep(1 * 1000)
})

// Scenario: Failed adding a student without an existing account since account exists
//         And inputs student's firstname, lastname, and email under 'Add New User as Student' section
//         Then student is not added to the class.

When('inputs student\'s firstname, lastname, and email with existing', async function() {
    driver = driverInstance.driver
    
    await driver.findElement(webdriver.By.id("new-first-name")).sendKeys('stu')
    await driver.findElement(webdriver.By.id("new-last-name")).sendKeys('test1')
    await driver.findElement(webdriver.By.id("new-email")).sendKeys('stutest@test.com')
    await driver.sleep(1 * 1000)
    // click button to submit
    await driver.findElement(webdriver.By.id('new-add')).click()
    await driver.sleep(1 * 1000)
})

// Scenario: Successfully removing a student from the class
//         And clicks 'Remove Student' for a student listed
//         Then the student is removed from the class.
When('clicks \'Remove Student\' for a student listed', async function() {
    driver = driverInstance.driver
    
    let array = await driver.findElements(webdriver.By.id('instructor-class-table-row'))
    let test1_idx = 0
    for (let i = 0; i < array.length; i++) {
        if ( array[i].findElement(webdriver.By.id("instructor-class-table-cell-email")).getText() === "test1@test.com" ) {
            test1_idx = i
        }
    }
    array[test1_idx].findElement(webdriver.By.id("remove-student")).click()
    await driver.sleep(1 * 1000)
})

Then('the student is removed from the class.', async function() {
    driver = driverInstance.driver
    
    let array = await driver.findElements(webdriver.By.id('instructor-class-table-row'))
    expect(array.length).to.equal(initialNumberOfRows-1)
})

// Feature: Manage Student Subscriptions On Class Management Page
// I want to manage my class' subscriptions
// As an instructor
// So that I can pay for their textbook subscription

//     Background:
//         Given user is logged in as instructor with 5 students in their class
//         When user is at the class management page

Given('user is logged in as instructor with 5 students in their class', async function () {
    driver = driverInstance.driver
    
    // log in using a premade instructor account
    await driver.get('http://localhost:3000/login')
 	await driver.sleep(1 * 1000)
    await driver.findElement(webdriver.By.id("email")).sendKeys('instrtest_2@test.com')
    await driver.findElement(webdriver.By.id("password")).sendKeys('password')
    await driver.sleep(1 * 1000)
    await driver.findElement(webdriver.By.xpath(`//*[@id="root"]/div/main/div/form/button`)).click()
    await driver.sleep(1 * 1000)
})

// Scenario: Successfully Toggle Checkbox On 
//         And toggles checkbox for a student listed without a subscription on
//         Then the student is on purchase list.

Given('toggles checkbox for a student listed without a subscription on', async function () {
    driver = driverInstance.driver
    // driver.findElements(By.css("input[type=\'checkbox\']"))
    let box = await driver.findElement(webdriver.By.id('toggle-buy-18'))
    box = await box.findElement(webdriver.By.xpath('..'))
    console.log(box)
    await box.click()
})

Then('the student is on purchase list.', async function () {
    driver = driverInstance.driver
    const localStorage = await driver.executeScript('return window.localStorage;');
    console.log(localStorage)
    let sel_student_array = JSON.parse(localStorage['sel_student_array'])
    expect(sel_student_array[0]).to.equal(18)
})

// Scenario: Successfully Toggle Checkbox Off
//         And toggles checkbox for a student listed without a subscription on
//         And toggles checkbox for a student listed without a subscription off
//         Then the student is not on purchase list.

Given('toggles checkbox for a student listed without a subscription off', async function () {
    driver = driverInstance.driver
    // driver.findElements(By.css("input[type=\'checkbox\']"))
    let box = await driver.findElement(webdriver.By.id('toggle-buy-18'))
    box = await box.findElement(webdriver.By.xpath('..'))
    console.log(box)
    await box.click()
})

Then('the student is not on purchase list.', async function () {
    driver = driverInstance.driver
    const localStorage = await driver.executeScript('return window.localStorage;');
    console.log(localStorage)
    let sel_student_array = JSON.parse(localStorage['sel_student_array'])
    expect(sel_student_array.length).to.equal(0)
})

// Scenario: Successfully Purchase Subscription for Students
//         And toggles checkbox for a student listed without a subscription on
//         And goes to Product Pricing Page
//         And adds the subscription item to cart
//         And goes to checkout page
//         And buys the subscription
//         And goes to Manage Class page
//         Then the instructor now owns the student's subscription

Given('goes to Product Pricing Page', async function () {
    driver = driverInstance.driver
    await driver.get('http://localhost:3000/products')
})

Given('adds the subscription item to cart', async function () {
    driver = driverInstance.driver
    await driver.findElement(webdriver.By.id('add-to-cart-1')).click()
    await driver.sleep(3000)
})

Given('goes to checkout page', async function () {
    driver = driverInstance.driver
    await driver.findElement(webdriver.By.xpath("//a[@class='ui green button']")).click()
    await driver.sleep(2000)
})

Given('buys the subscription', async function () {
    driver = driverInstance.driver
    const container = await driver.wait(
        webdriver.until.elementLocated(webdriver.By.id("buttons-container")), 
        2000
    );
    // let container = await driver.findElement(webdriver.By.xpath("div[@class='buttons-container']"))
    await container.findElement(webdriver.By.xpath("//div[@role='link']")).click()
    // const paypalButton = await driver.findElement(webdriver.By.id('paypal-button'));
    // await paypalButton.click();
    // Wait for the new window to appear or handle the redirect
    const handles = await driver.getAllWindowHandles();
    const newWindowHandle = handles[1]; // Assuming PayPal opens in a new window
    await driver.switchTo().window(newWindowHandle);

    // Find and fill in the email field
    const emailField = await driver.findElement(By.id('email'));
    await emailField.sendKeys('sb-gyqyi27742548@personal.example.com');

    // Find and fill in the password field
    const passwordField = await driver.findElement(By.id('password'));
    await passwordField.sendKeys('eCDsju2<');

    // Submit the login form
    const loginButton = await driver.findElement(By.id('btnLogin'));
    await loginButton.click();

    const purchaseButton = await driver.findElement(By.id('payment-submit-btn'))
    await purchaseButton.click()

    // Switch back to the original window
    await driver.switchTo().window(handles[0]);
})

Given('goes to Manage Class page', async function () {
    driver = driverInstance.driver
    await driver.get("http://localhost:3000/instructor/class")
})

Then('the instructor now owns the student\'s subscription', async function () {
    driver = driverInstance.driver
    let element = await driver.findElement(webdriver.By.id('instructor-class-table-cell-instr_owns-18'))
    expect(element.getText()).to.equal("TRUE")
})