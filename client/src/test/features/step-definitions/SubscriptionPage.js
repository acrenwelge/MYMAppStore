const { Given, When, Then, BeforeAll } = require("@cucumber/cucumber");
const { expect } = require("chai");
const fs = require('fs');
const webdriver = require("selenium-webdriver");
const driverInstance = require('./WebDriver');

let ele, dwn;

BeforeAll(async() => {
    driver = driverInstance.driver;

    await driver.get("http://localhost:3000/login");
    await driver.sleep(1 * 1000);

    await driver.findElement(webdriver.By.id("email")).sendKeys("arunimsamudra@gmail.com");
    await driver.findElement(webdriver.By.id("password")).sendKeys("arunimsamudra@gmail.com");
    await driver.sleep(1 * 1000);

    await driver.findElement(webdriver.By.xpath(`//*[@id="root"]/div/main/div/form/button`)).click();
    await driver.sleep(1 * 1000);
});

Given("I am on the subscription page", async() => {
    driver = driverInstance.driver;

    await driver.get("http://localhost:3000/subscriptions");
    await driver.sleep(3 * 1000);
});

When("I click on Read", async() => {
    driver = driverInstance.driver;

    await driver.findElement(webdriver.By.xpath(`//*[@id="root"]/div/main/div/div/div/div/div/table/tbody/tr[1]/td[3]/button`)).click();
    await driver.sleep(3 * 1000);
});

Then("I should be redirected to the Read page", async() => {
    driver = driverInstance.driver;
    let iframe = await driver.findElement(webdriver.By.xpath(`//*[@id="root"]/div/main/div/iframe`));
    expect(iframe).to.not.be.null;
});

When("There is a Finance with Maple Book Subscription", async() => {
    driver = driverInstance.driver;

    let table = driver.findElement(webdriver.By.xpath(`//*[@id="root"]/div/main/div/div/div/div/div/table`));
    let rows = await table.findElements(webdriver.By.tagName('tr'));
    for (let row of rows) {
        let tds = await row.findElements(webdriver.By.tagName('td'));
        for (let td of tds) {
            if("Finance with Maple" === await td.getText()) {
                ele = row;
                break;
            }
        }
    }
});

Then("The Download button should be present", async() => {
    let tds = await ele.findElements(webdriver.By.tagName('td'));
    for (let td of tds) {
        if("Download" === await td.getText()) {
            dwn = td;
            break;
        }
    }
    expect(dwn).to.not.be.null;
});

When("I click on the download button", async() => {
    driver = driverInstance.driver;
    await dwn.click();
    await driver.sleep(3 * 1000);
});

Then("The PDF book should be downloaded", async() => {
    let filePath = '/Users/arunimsamudra/Downloads/Finance with Maple.pdf';
    let fileExists = fs.existsSync(filePath);
    expect(fileExists).to.be.not.null;
});

When("There is a Book which is not Finance with Maple Subscription", async() => {
    driver = driverInstance.driver;

    ele = null;
    dwn = null;
    
    let table = driver.findElement(webdriver.By.xpath(`//*[@id="root"]/div/main/div/div/div/div/div/table`));
    let rows = await table.findElements(webdriver.By.tagName('tr'));
    for (let row of rows) {
        let tds = await row.findElements(webdriver.By.tagName('td'));
        for (let td of tds) {
            if("Finance with Maple" != await td.getText()) {
                console.log(await td.getText());
                ele = row;
                break;
            }
        }
        if (ele) {
            break;
        }
    }
});

Then("The download button should not be present", async() => {
    let tds = await ele.findElements(webdriver.By.tagName('td'));
    for (let td of tds) {
        console.log(await td.getText());
        if("Download" === await td.getText()) {
            dwn = td;
            break;
        }
    }
    expect(dwn).to.be.null;
});
