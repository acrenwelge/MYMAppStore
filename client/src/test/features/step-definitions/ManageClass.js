const { Given, When, Then, After, Before } = require('@cucumber/cucumber')
let { setDefaultTimeout } = require("@cucumber/cucumber")
const { expect } = require('chai')
const { isErrorResponse } = require("selenium-webdriver/lib/error")
const webdriver = require("selenium-webdriver")

setDefaultTimeout(60*1000)
let driver

Before(function () {
	driver = new webdriver.Builder().forBrowser("chrome").build()
})

After(function () {
	driver.quit()
})

// Scenario: Successfully accessing class management page as an instructor
//        Given user is logged in as instructor
//        When not accessing an item
//        And go to the class management url
//        Then the user should be at class management page with their class 
//             information displayed and able to remove/add students and pay for 
//             students' textbooks.

Given('user is logged in as instructor', async function () {
    // log in using a premade instructor account
    // this instructor account has a class with at least one student
    await driver.get('http://localhost:3000/login')
 	await driver.sleep(2 * 1000)
    await driver.findElement(webdriver.By.id("email")).sendKeys('test@test.com')
    await driver.findElement(webdriver.By.id("password")).sendKeys('password')
    await driver.sleep(2 * 1000)
    await driver.findElement(webdriver.By.xpath(`//*[@id="root"]/div/main/div/form/button`)).click()
    await driver.sleep(2 * 1000)
})

When('not accessing an item', async function () {
    // not accessing an item, so navigate to root
    await driver.get("http://localhost:3000/")
	await driver.sleep(3 * 1000)
})

When('go to the class management url', async function () {
    await driver.get("http://localhost:3000/instructor/class")
	await driver.sleep(3 * 1000)
})

Then('the user should be at class management page with their class information displayed.', async function () {
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
    // log in using a premade user account
    await driver.get('http://localhost:3000/login')
 	await driver.sleep(3 * 1000)
    await driver.findElement(webdriver.By.id("email")).sendKeys('test1@test.com')
    await driver.findElement(webdriver.By.id("password")).sendKeys('password')
    await driver.sleep(6 * 1000)
    await driver.findElement(webdriver.By.xpath(`//*[@id="root"]/div/main/div/form/button`)).click()
    await driver.sleep(6 * 1000)
})

Then('the user will not see any class data.', async function () {
    expect(function() { driver.findElement(webdriver.By.name("not-instructor")) }).to.not.throw()
    let msg = await driver.findElement(webdriver.By.name("not-instructor"))
    expect(msg).to.not.be.null
})

// Background:
//         Given user is logged in as instructor
//         When user is at the class management page

When('user is at the class management page', async function () {
    await driver.get("http://localhost:3000/instructor/class")
	await driver.sleep(3 * 1000)
})

// Scenario: Successfully adding a student with an existing account
//         And inputs student's email under 'Add Existing User as Student'
//         And clicks 'Add Student'
//         Then student is added to the class and shows in the student list.

// Scenario: Failed adding a student from an existing email
//         And inputs student's email under 'Add Existing User as Student'
//         And clicks 'Add Student'
//         And email does not exist in the database
//         Then student is not added to the class and doesn't show in the student list.

// Scenario: Successfully adding a student without an existing account
//         And under 'Add New User as Student' section
//         And inputs student's firstname, lastname, and email
//         And email given is not in the database already
//         Then student is added to the class and shows in the student list.

// Scenario: Failed adding a student without an existing account
//         And under 'Add New User as Student' section
//         And inputs student's firstname, lastname, and email
//         And email given is in the database already
//         Then student is not added to the class.

// Scenario: Successfully removing a student from the class
//         And clicks 'Remove Student' for a student listed
//         Then the student is removed from the class and doesn't show on the page.

// Scenario: Successfully purchase a textbook for a student from the class
//         And clicks 'Purchase Items' for a student listed
//         Then the student is removed from the class and doesn't show on the page.