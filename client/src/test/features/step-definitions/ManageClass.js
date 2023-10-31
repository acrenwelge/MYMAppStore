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
    await driver.findElement(webdriver.By.id("email")).sendKeys('test1@test.com')
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
    
    await driver.findElement(webdriver.By.id("existing-email")).sendKeys('test1@test.com')
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
    await driver.findElement(webdriver.By.id("new-email")).sendKeys('test1@test.com')
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

// Scenario: Successfully purchase a textbook for a student from the class
//         And clicks 'Purchase Items' for a student listed
//         Then the instructor is redirected to the product page.