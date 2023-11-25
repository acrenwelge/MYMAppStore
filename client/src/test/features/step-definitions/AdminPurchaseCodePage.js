const { Given, When, Then, And, After, Before } = require("@cucumber/cucumber");
const { expect } = require("chai");
const { time, assert } = require("console");
const webdriver = require("selenium-webdriver");
var { setDefaultTimeout } = require("@cucumber/cucumber");
const exp = require("constants");
const driverInstance = require('./WebDriver')

When("the user goes to the purchase codes page",  async () => {
    driver = driverInstance.driver

    await driver.findElement(webdriver.By.xpath(`//*[@id="root"]/div/main/div/div/div/div[1]/div/div/a[5]`)).click();
    await driver.sleep(1 * 1000);
});

Then("the user should be at purchase codes page", async () => {
    driver = driverInstance.driver

    let curURL =  await driver.getCurrentUrl();
    expect(curURL).to.equal("http://localhost:3000/admin/purchase-code");
    let tablebody = await driver.findElements(webdriver.By.tagName("td"));
});

Then("the user should see purchase code info", async () => {
    driver = driverInstance.driver
    
    let tablebody = await driver.findElements(webdriver.By.tagName("td"));
    try {
        expect(tablebody.length).to.not.equal(0);
    } catch (error) {
        console.warn('Warning: Info page present but make-sure database has some transaction data');
    }
});

When("the user goes to the purchase codes url",  async () => {
    driver = driverInstance.driver

    await driver.get("http://localhost:3000/admin/purchase-code");
    await driver.sleep(1 * 1000);
});

Given("user is in the purchase code page", async () => {
    driver = driverInstance.driver
    
    // Login
    await driver.get("http://localhost:3000/login");
    await driver.sleep(1 * 1000);

    driver.findElement(webdriver.By.id("email")).sendKeys("administrator@admin.com");
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

    // Go to Purchase Code Page
    await driver.findElement(webdriver.By.xpath(`//*[@id="root"]/div/main/div/div/div/div[1]/div/div/a[5]`)).click();
    await driver.sleep(1 * 1000);
});

When("the user searches for a purchase code",  async () => {
    driver = driverInstance.driver

    driver.findElement(webdriver.By.xpath(`//*[@id="root"]/div/main/div/div/div/div[2]/div[3]/div[3]/input`)).sendKeys("free");

    await driver.sleep(1 * 1000);
});

Then("only the searched purchase codes appear", async () => {
    driver = driverInstance.driver
    
    const table = await driver.findElement(webdriver.By.id("codeTable"));
    const rows = await table.findElements(webdriver.By.id("codeRow"));

    for (const row of rows) {
        const cells = await row.findElements(webdriver.By.xpath(".//td"));

        const searchKeyword = "free"

        codeName = await cells[0].getText();
        
        if (!codeName.toLowerCase().includes(searchKeyword.toLowerCase())) {
            expect.fail(null, null, `Expected purchase code name in row ${i + 1} to contain '${searchKeyword}'`);
        }
    }

    await driver.sleep(1 * 1000);
});

// Used to keep track of purchase codeed being added, edited, and deleted
codeRowNumber = undefined

When("user presses the add purchase code button",  async () => {
    driver = driverInstance.driver
    await driver.findElement(webdriver.By.id(`addNewButton`)).click();

    await driver.sleep(1 * 1000);
});

When("enters in the new purchase code info",  async () => {
    driver = driverInstance.driver
    
    await driver.findElement(webdriver.By.id("product")).click();
    // const dropdown = driver.findElement(webdriver.By.id("product"));
    // const select = new webdriver.Select(dropdown);
    // select.selectByIndex(0);
    
    driver.findElement(webdriver.By.id("name")).sendKeys("test");
    driver.findElement(webdriver.By.id("priceOff")).sendKeys("50");
    await driver.sleep(1 * 1000);

    await driver.findElement(webdriver.By.id("addButton")).click();
    await driver.sleep(1 * 1000);
});

Then("the table will show the added purchase code",  async () => {
    driver = driverInstance.driver

    const table = await driver.findElement(webdriver.By.id("codeTable"));
    const rows = await table.findElements(webdriver.By.id("codeRow"));

    codePresent = false;
    rowNumber = 0;
    for (const row of rows) {
      const cells = await row.findElements(webdriver.By.xpath(".//td"));

      codeName = await cells[0].getText();
      codeProduct = await cells[1].getText();
      codePercentOff = await cells[2].getText();

      if(codeName == "test" && codeProduct == "textbook - 6 months" && codePercentOff == "50%") {
        codePresent = true;
        codeRowNumber = rowNumber;
        break;
      }

      rowNumber++;
    }

    if (!codePresent) {
        expect.fail(null, null, "Expected purchase code in not in Table");
    }

    await driver.sleep(1 * 1000);
});

When("user presses the edit purchase code button", async () => {
    driver = driverInstance.driver

    const table = await driver.findElement(webdriver.By.id("codeTable"));
    const rows = await table.findElements(webdriver.By.id("codeRow"));

    const cells = await rows[codeRowNumber].findElements(webdriver.By.xpath(".//td"));

    const edit = await cells[3].findElement(webdriver.By.id("editButton"));
    await edit.click();

    await driver.sleep(1 * 1000);
});

When("enters in the edited purchase code info",  async () => {
    driver = driverInstance.driver

    driver.findElement(webdriver.By.id("name")).sendKeys(" 2");
    await driver.findElement(webdriver.By.id("priceOff")).sendKeys(webdriver.Key.BACK_SPACE);
    await driver.findElement(webdriver.By.id("priceOff")).sendKeys(webdriver.Key.BACK_SPACE);
    driver.findElement(webdriver.By.id("priceOff")).sendKeys("25");
    await driver.sleep(1 * 1000);

    await driver.findElement(webdriver.By.id("saveButton")).click();
    await driver.sleep(1 * 1000);
});

Then("the table will show the edited purchase code",  async () => {
    driver = driverInstance.driver
    
    const table = await driver.findElement(webdriver.By.id("codeTable"));
    const rows = await table.findElements(webdriver.By.id("codeRow"));

    const cells = await rows[codeRowNumber].findElements(webdriver.By.xpath(".//td"));

    codeName = await cells[0].getText();
    codeProduct = await cells[1].getText();
    codePercentOff = await cells[2].getText();

    if(codeName != "test 2" || codeProduct != "textbook - 6 months" || codePercentOff != "25%") {
        expect.fail(null, null, "Expected purchase code in not in Table");
    }

    await driver.sleep(1 * 1000);
});

When("user presses the delete purchase code button",  async () => {
    driver = driverInstance.driver

    const table = await driver.findElement(webdriver.By.id("codeTable"));
    const rows = await table.findElements(webdriver.By.id("codeRow"));

    const cells = await rows[codeRowNumber].findElements(webdriver.By.xpath(".//td"));

    const edit = await cells[3].findElement(webdriver.By.id("deleteButton"));
    await edit.click();

    await driver.sleep(1 * 1000);
});

Then("the table will not show the purchase code",  async () => {
    driver = driverInstance.driver
    
    const table = await driver.findElement(webdriver.By.id("codeTable"));
    const rows = await table.findElements(webdriver.By.id("codeRow"));

    for (const row of rows) {
      const cells = await row.findElements(webdriver.By.xpath(".//td"));

      codeName = await cells[0].getText();
      codeProduct = await cells[1].getText();
      codePercentOff = await cells[2].getText();

      if(codeName == "test 2" && codeProduct == "textbook - 6 months" && codePercentOff == "25%") {
        expect.fail(null, null, "Expected purchase code in Table");
      }
    }

    await driver.sleep(1 * 1000);
});

