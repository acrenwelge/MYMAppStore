const { Before, After } = require("@cucumber/cucumber");
const webdriver = require("selenium-webdriver");
const { setDefaultTimeout } = require("@cucumber/cucumber");

class WebDriver {
  constructor() {
    // Set default timeout to 60 seconds
    setDefaultTimeout(60 * 1000);
    
    // Declare driver variable
    this.driver = null;
  }

  async initializeDriver() {
    this.driver = new webdriver.Builder().forBrowser("chrome").build();
  }

  async quitDriver() {
    if (this.driver) {
      // Clear browser storage (local storage, session storage, etc.)
      await this.driver.executeScript('window.localStorage.clear();');
      await this.driver.executeScript('window.sessionStorage.clear();');

      // Delete cookies
      await this.driver.manage().deleteAllCookies();

      // Close all open browser windows
      const windowHandles = await this.driver.getAllWindowHandles();
      for (let handle of windowHandles) {
        await this.driver.switchTo().window(handle);
        await this.driver.close();
      }
      await this.driver.quit();
    }
  }
}

const driverInstance = new WebDriver();

Before(function () {
  return driverInstance.initializeDriver();
});

After(function () {
  return driverInstance.quitDriver();
});

module.exports = driverInstance;