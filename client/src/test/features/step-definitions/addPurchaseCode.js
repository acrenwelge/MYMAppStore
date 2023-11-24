const { Given, When, Then, And, After, Before } = require("@cucumber/cucumber");
const { expect } = require("chai");
const { time, assert } = require("console");
const webdriver = require("selenium-webdriver");
var { setDefaultTimeout } = require("@cucumber/cucumber");
const exp = require("constants");
const driverInstance = require('./WebDriver');

Given("user is logged in as admin", async () => {
	driver = driverInstance.driver
    
	//log in: 
	await driver.get("http://localhost:3000/login");
 	await driver.sleep(3 * 1000);

	driver.findElement(webdriver.By.id("email")).sendKeys('ncc@me.com');
	driver.findElement(webdriver.By.id("password")).sendKeys('password');
	await driver.sleep(1 * 1000);
	
	await driver.findElement(webdriver.By.xpath(`//*[@id="root"]/div/main/div/form/button`)).click();
 	await driver.sleep(3 * 1000);
});

When("go to purchase code page url", async () => {
	driver = driverInstance.driver
	const adminBtn = await driver.wait(
		webdriver.until.elementLocated(webdriver.By.id(`admin-link`)),
		2000
	)
	await adminBtn.click()
	const pcBtn = await driver.wait(
		webdriver.until.elementLocated(webdriver.By.id(`admin-pc`)),
		2000
	)
	await pcBtn.click()
    await driver.sleep(2 * 1000)
});


When("type in valid purchase code", async () => {
	driver = driverInstance.driver

	const button = await driver.findElement(webdriver.By.id("addNewButton"))
	button.click()
    
	const nameField = await driver.wait(
        webdriver.until.elementLocated(webdriver.By.id("name")), 
        2000
    )
	await nameField.sendKeys("20percentoff")
	const offField = await driver.wait(
        webdriver.until.elementLocated(webdriver.By.id("priceOff")), 
        2000
    )
	await offField.sendKeys("20")

    // driver.findElement(webdriver.By.id("name")).sendKeys("20percentoff");
	// driver.findElement(webdriver.By.id("priceOff")).sendKeys("20");
	// await driver.sleep(1 * 1000);
	
});

When("click the add button", async () => {
	driver = driverInstance.driver
    
    //driver.findElement(webdriver.By.id("name")).sendKeys(randomName);
    //await driver.sleep(3 * 1000);
	const addBtn = await driver.wait(
        webdriver.until.elementLocated(webdriver.By.id("addButton")), 
        2000
    )
	addBtn.click()
	// await driver.findElement(webdriver.By.id('addButton')).click();
 	// await driver.sleep(6 * 1000);
});

Then("the purchase code should be added in", async () => {
	driver = driverInstance.driver
	const successToast = await driver.wait(
        webdriver.until.elementLocated(webdriver.By.className("ui success message")), 
        2000
    )
	let successMsg = await successToast.getText();
    expect(successMsg).to.contains("SUCCESS");

	/*
	//refresh: 
	await driver.get("http://localhost:3000/admin/purchase-code");

	let table = await driver.findElement(webdriver.By.className("ui table"));
	let rows = await table.findElements(webdriver.By.tagName("tr"));
	let cols = await (rows[rows.length-1]).findElements(webdriver.By.tagName("td"));
	let item = await cols[1].getText();
	let num = await cols[2].getText();

	//let rows = await table.findElements(webdriver.By.tagName("tr"));
	//let cols = await rows.findElements(webdriver.By.tagName("td")).getText();
	//let item = await driver.findElement(By.xpath(`//*[@id="root"]/div/main/div/div/div/div[2]/table/tbody/tr[6]/td[2]`)).getText();
	expect(item).to.contains("20percentoff");
	expect(num).to.contains("20");
	*/

	//delete: 
	//const row = getByRole('cell', {name: 'Jane'}).closest('tr')
	//fireEvent.click(
	//within(row).getByText('Delete')
	//)
	//console.log(curURL);
    //expect(curURL).to.equal("http://localhost:3000/");
});


/*
Scenario: Adding purchase code correctly
    Given user is logged in as admin 
    When go to purchase code page url
	When click the delete button at the end of row
    Then the purchase code should be deleted
*/


//*[@id="root"]/div/main/div/div/div/div[2]/table/tbody/tr[6]/td[4]/button

When("click the delete button at the end of row", async () => {
	driver = driverInstance.driver

	//should be working... but not
	//let table = await driver.findElement(webdriver.By.className("ui table"));
	//let rows = await table.findElements(webdriver.By.tagName("tr"));
	//let cols = await (rows[rows.length-1]).findElements(webdriver.By.tagName("td"));
	//let item = await (cols[4]).findElements(webdriver.By.className("ui red button"));
	//await item.click();

	await driver.findElement(webdriver.By.xpath(`//*[@id="root"]/div/main/div/div/div/div[2]/table/tbody/tr[6]/td[4]/button`)).click();
 	await driver.sleep(6 * 1000);
});

Then("the purchase code should be deleted", async () => {
	driver = driverInstance.driver
    
	//await driver.get("http://localhost:3000/admin/purchase-code");

	let table = await driver.findElement(webdriver.By.className("ui table"));
	let rows = await table.findElements(webdriver.By.tagName("tr"));
	let cols = await (rows[rows.length-1]).findElements(webdriver.By.tagName("td"));
	let item = await cols[1].getText();
	//let rows = await table.findElements(webdriver.By.tagName("tr"));
	//let cols = await rows.findElements(webdriver.By.tagName("td")).getText();
	//let item = await driver.findElement(By.xpath(`//*[@id="root"]/div/main/div/div/div/div[2]/table/tbody/tr[6]/td[2]`)).getText();
	expect(item).to.not.contains("20percentoff");

	//delete: 
	//const row = getByRole('cell', {name: 'Jane'}).closest('tr')
	//fireEvent.click(
	//within(row).getByText('Delete')
	//)
	//console.log(curURL);
    //expect(curURL).to.equal("http://localhost:3000/");
});
