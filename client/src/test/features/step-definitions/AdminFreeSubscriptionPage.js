const { Given, When, Then, And, After, Before } = require("@cucumber/cucumber");
const { expect } = require("chai");
const { time, assert } = require("console");
const webdriver = require("selenium-webdriver");
var { setDefaultTimeout } = require("@cucumber/cucumber");
const exp = require("constants");
const driverInstance = require('./WebDriver')

When("the user goes to the free subscription page",  async () => {
    driver = driverInstance.driver

    await driver.findElement(webdriver.By.xpath(`//*[@id="root"]/div/main/div/div/div/div[1]/div/div/a[6]`)).click();
    await driver.sleep(1 * 1000);
});

Then("the user should be at free subscription page", async () => {
    driver = driverInstance.driver

    let curURL =  await driver.getCurrentUrl();
    expect(curURL).to.equal("http://localhost:3000/admin/free-subscription");
    let tablebody = await driver.findElements(webdriver.By.tagName("td"));
});

Then("the user should see suffix info", async () => {
    driver = driverInstance.driver
    
    let tablebody = await driver.findElements(webdriver.By.tagName("td"));
    try {
        expect(tablebody.length).to.not.equal(0);
    } catch (error) {
        console.warn('Warning: Info page present but make-sure database has some suffix data');
    }
});

When("the user goes to the free subscription url",  async () => {
    driver = driverInstance.driver

    await driver.get("http://localhost:3000/admin/free-subscription");
    await driver.sleep(1 * 1000);
});

Given("user is in the free subscription page", async () => {
    driver = driverInstance.driver
    
    // Login
    await driver.get("http://localhost:3000/login");
    await driver.sleep(1 * 1000);

    driver.findElement(webdriver.By.id("email")).sendKeys("admin@admin.com");
    driver.findElement(webdriver.By.id("password")).sendKeys("admin@admin.com");
    await driver.sleep(1 * 1000);

    await driver.findElement(webdriver.By.xpath(`//*[@id="root"]/div/main/div/form/button`)).click();
    await driver.sleep(1 * 1000);

    // Go to Home Page
	await driver.get("http://localhost:3000/");
    await driver.sleep(1 * 1000);

    // Go to Admin Page
    await driver.findElement(webdriver.By.id("adminButton")).click();    
    await driver.sleep(1 * 1000);

    // Go to Free subscription Page
    await driver.findElement(webdriver.By.xpath(`//*[@id="root"]/div/main/div/div/div/div[1]/div/div/a[6]`)).click();
    await driver.sleep(1 * 1000);
});

When("the user searches for a suffix",  async () => {
    driver = driverInstance.driver

    driver.findElement(webdriver.By.xpath(`//*[@id="root"]/div/main/div/div/div/div[2]/div[4]/div[3]/input`)).sendKeys("edu");

    await driver.sleep(1 * 1000);
});

Then("only the searched suffixs appear", async () => {
    driver = driverInstance.driver
    
    const table = await driver.findElement(webdriver.By.id("suffixTable"));
    const rows = await table.findElements(webdriver.By.id("suffixRow"));

    for (const row of rows) {
        const cells = await row.findElements(webdriver.By.xpath(".//td"));

        const searchKeyword = "edu"

        suffixName = await cells[0].getText();
        
        if (!suffixName.toLowerCase().includes(searchKeyword.toLowerCase())) {
            expect.fail(null, null, `Expected suffix name in row ${i + 1} to contain '${searchKeyword}'`);
        }
    }

    await driver.sleep(1 * 1000);
});

// Used to keep track of suffixed being added, edited, and deleted
suffixRowNumber = undefined

When("user presses the add suffix button",  async () => {
    driver = driverInstance.driver
    await driver.findElement(webdriver.By.id(`addNewButton`)).click();

    await driver.sleep(1 * 1000);
});

When("enters in the new suffix info",  async () => {
    driver = driverInstance.driver
    
    driver.findElement(webdriver.By.id("name")).sendKeys("test.com");
    await driver.sleep(1 * 1000);

    await driver.findElement(webdriver.By.id("addButton")).click();
    await driver.sleep(1 * 1000);
});

Then("the table will show the added suffix",  async () => {
    driver = driverInstance.driver

    const table = await driver.findElement(webdriver.By.id("suffixTable"));
    const rows = await table.findElements(webdriver.By.id("suffixRow"));

    suffixPresent = false;
    rowNumber = 0;
    for (const row of rows) {
      const cells = await row.findElements(webdriver.By.xpath(".//td"));

      suffixName = await cells[0].getText();

      if(suffixName == "test.com") {
        suffixPresent = true;
        suffixRowNumber = rowNumber;
        break;
      }

      rowNumber++;
    }

    if (!suffixPresent) {
        expect.fail(null, null, "Expected suffix in not in Table");
    }

    await driver.sleep(1 * 1000);
});

When("user presses the edit suffix button", async () => {
    driver = driverInstance.driver

    const table = await driver.findElement(webdriver.By.id("suffixTable"));
    const rows = await table.findElements(webdriver.By.id("suffixRow"));

    const cells = await rows[suffixRowNumber].findElements(webdriver.By.xpath(".//td"));

    const edit = await cells[1].findElement(webdriver.By.id("editButton"));
    await edit.click();

    await driver.sleep(1 * 1000);
});

When("enters in the edited suffix info",  async () => {
    driver = driverInstance.driver

    driver.findElement(webdriver.By.id("name")).sendKeys(webdriver.Key.BACK_SPACE);
    driver.findElement(webdriver.By.id("name")).sendKeys(webdriver.Key.BACK_SPACE);
    driver.findElement(webdriver.By.id("name")).sendKeys(webdriver.Key.BACK_SPACE);
    driver.findElement(webdriver.By.id("name")).sendKeys("net");
    await driver.sleep(1 * 1000);

    await driver.findElement(webdriver.By.id("saveButton")).click();
    await driver.sleep(1 * 1000);
});

Then("the table will show the edited suffix",  async () => {
    driver = driverInstance.driver
    
    const table = await driver.findElement(webdriver.By.id("suffixTable"));
    const rows = await table.findElements(webdriver.By.id("suffixRow"));

    const cells = await rows[suffixRowNumber].findElements(webdriver.By.xpath(".//td"));

    suffixName = await cells[0].getText();

    if(suffixName != "test.net") {
        expect.fail(null, null, "Expected suffix in not in Table");
    }

    await driver.sleep(1 * 1000);
});

When("user presses the delete suffix button",  async () => {
    driver = driverInstance.driver

    const table = await driver.findElement(webdriver.By.id("suffixTable"));
    const rows = await table.findElements(webdriver.By.id("suffixRow"));

    const cells = await rows[suffixRowNumber].findElements(webdriver.By.xpath(".//td"));

    const edit = await cells[1].findElement(webdriver.By.id("deleteButton"));
    await edit.click();

    await driver.sleep(1 * 1000);
});

Then("the table will not show the suffix",  async () => {
    driver = driverInstance.driver
    
    const table = await driver.findElement(webdriver.By.id("suffixTable"));
    const rows = await table.findElements(webdriver.By.id("suffixRow"));

    for (const row of rows) {
      const cells = await row.findElements(webdriver.By.xpath(".//td"));

      suffixName = await cells[0].getText();

      if(suffixName == "test.net") {
        expect.fail(null, null, "Did not expect suffix in Table");
      }
    }

    await driver.sleep(1 * 1000);
});

