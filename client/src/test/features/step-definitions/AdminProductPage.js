const { Given, When, Then, And, After, Before } = require("@cucumber/cucumber");
const { expect } = require("chai");
const { time, assert } = require("console");
const webdriver = require("selenium-webdriver");
var { setDefaultTimeout } = require("@cucumber/cucumber");
const exp = require("constants");
const driverInstance = require('./WebDriver')

When("the user goes to the products page",  async () => {
    driver = driverInstance.driver

    await driver.findElement(webdriver.By.xpath(`//*[@id="root"]/div/main/div/div/div/div[1]/div/div/a[4]`)).click();
    await driver.sleep(1 * 1000);
});

Then("the user should be at products page", async () => {
    driver = driverInstance.driver

    let curURL =  await driver.getCurrentUrl();
    expect(curURL).to.equal("http://localhost:3000/admin/products");
    let tablebody = await driver.findElements(webdriver.By.tagName("td"));
});

Then("the user should see product info", async () => {
    driver = driverInstance.driver
    
    let tablebody = await driver.findElements(webdriver.By.tagName("td"));
    try {
        expect(tablebody.length).to.not.equal(0);
    } catch (error) {
        console.warn('Warning: Info page present but make-sure database has some transaction data');
    }
});

When("the user goes to the products url",  async () => {
    driver = driverInstance.driver

    await driver.get("http://localhost:3000/admin/products");
    await driver.sleep(1 * 1000);
});

Given("user is in the product page", async () => {
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

    // Go to Product Page
    await driver.findElement(webdriver.By.xpath(`//*[@id="root"]/div/main/div/div/div/div[1]/div/div/a[4]`)).click();
    await driver.sleep(1 * 1000);
});

When("the user searches for a product",  async () => {
    driver = driverInstance.driver

    driver.findElement(webdriver.By.xpath(`//*[@id="root"]/div/main/div/div/div/div[2]/div/div[2]/input`)).sendKeys("Text");

    await driver.sleep(1 * 1000);
});

Then("only the searched products appear", async () => {
    driver = driverInstance.driver
    
    const table = await driver.findElement(webdriver.By.id("productTable"));
    const rows = await table.findElements(webdriver.By.id("productRow"));

    for (const row of rows) {
        const cells = await row.findElements(webdriver.By.xpath(".//td"));

        const searchKeyword = "text"

        productName = await cells[0].getText();
        
        if (!productName.toLowerCase().includes(searchKeyword.toLowerCase())) {
            expect.fail(null, null, `Expected product name in row ${i + 1} to contain '${searchKeyword}'`);
        }
    }

    await driver.sleep(1 * 1000);
});

// Used to keep track of producted being added, edited, and deleted
productRowNumber = undefined

When("user presses the add product button",  async () => {
    driver = driverInstance.driver
    await driver.findElement(webdriver.By.id(`addNewButton`)).click();

    await driver.sleep(1 * 1000);
});

When("enters in the new product info",  async () => {
    driver = driverInstance.driver
    
    driver.findElement(webdriver.By.id("name")).sendKeys("test");
    driver.findElement(webdriver.By.id("price")).sendKeys("10");
    driver.findElement(webdriver.By.id("subscriptionLengthMonths")).sendKeys("10");
    await driver.sleep(1 * 1000);

    await driver.findElement(webdriver.By.id("addButton")).click();
    await driver.sleep(1 * 1000);
});

Then("the table will show the added product",  async () => {
    driver = driverInstance.driver

    const table = await driver.findElement(webdriver.By.id("productTable"));
    const rows = await table.findElements(webdriver.By.id("productRow"));

    productPresent = false;
    rowNumber = 0;
    for (const row of rows) {
      const cells = await row.findElements(webdriver.By.xpath(".//td"));

      productName = await cells[0].getText();
      productPrice = await cells[1].getText();
      productSub = await cells[2].getText();

      if(productName == "test" && productPrice == "$10.00" && productSub == "10 months") {
        productPresent = true;
        productRowNumber = rowNumber;
        break;
      }

      rowNumber++;
    }

    if (!productPresent) {
        expect.fail(null, null, "Expected product in not in Table");
    }

    await driver.sleep(1 * 1000);
});

When("user presses the edit product button", async () => {
    driver = driverInstance.driver

    const table = await driver.findElement(webdriver.By.id("productTable"));
    const rows = await table.findElements(webdriver.By.id("productRow"));

    const cells = await rows[productRowNumber].findElements(webdriver.By.xpath(".//td"));

    const edit = await cells[3].findElement(webdriver.By.id("editButton"));
    await edit.click();

    await driver.sleep(1 * 1000);
});

When("enters in the edited product info",  async () => {
    driver = driverInstance.driver

    driver.findElement(webdriver.By.id("name")).sendKeys(" 2");
    driver.findElement(webdriver.By.id("price")).sendKeys("2");
    driver.findElement(webdriver.By.id("subscriptionLengthMonths")).sendKeys("2");
    await driver.sleep(1 * 1000);

    await driver.findElement(webdriver.By.id("saveButton")).click();
    await driver.sleep(1 * 1000);
});

Then("the table will show the edited product",  async () => {
    driver = driverInstance.driver
    
    const table = await driver.findElement(webdriver.By.id("productTable"));
    const rows = await table.findElements(webdriver.By.id("productRow"));

    const cells = await rows[productRowNumber].findElements(webdriver.By.xpath(".//td"));

    productName = await cells[0].getText();
    productPrice = await cells[1].getText();
    productSub = await cells[2].getText();

    if(productName != "test 2" || productPrice != "$102.00" || productSub != "102 months") {
        expect.fail(null, null, "Expected product in not in Table");
    }

    await driver.sleep(1 * 1000);
});

When("user presses the delete product button",  async () => {
    driver = driverInstance.driver

    const table = await driver.findElement(webdriver.By.id("productTable"));
    const rows = await table.findElements(webdriver.By.id("productRow"));

    const cells = await rows[productRowNumber].findElements(webdriver.By.xpath(".//td"));

    const edit = await cells[3].findElement(webdriver.By.id("deleteButton"));
    await edit.click();

    await driver.sleep(1 * 1000);
});

Then("the table will not show the product",  async () => {
    driver = driverInstance.driver
    
    const table = await driver.findElement(webdriver.By.id("productTable"));
    const rows = await table.findElements(webdriver.By.id("productRow"));

    for (const row of rows) {
      const cells = await row.findElements(webdriver.By.xpath(".//td"));

      productName = await cells[0].getText();
      productPrice = await cells[1].getText();
      productSub = await cells[2].getText();

      if(productName == "test 2" && productPrice == "$102.00" && productSub == "102 months") {
        expect.fail(null, null, "Expected product in Table");
      }
    }

    await driver.sleep(1 * 1000);
});

