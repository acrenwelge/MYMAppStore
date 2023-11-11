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