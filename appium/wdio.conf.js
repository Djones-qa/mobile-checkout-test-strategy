const path = require('path');

exports.config = {
  runner: 'local',
  port: 4723,

  specs: ['./appium/tests/**/*.test.ts'],
  exclude: [],

  maxInstances: 1,

  capabilities: [
    {
      platformName: 'iOS',
      'appium:deviceName': 'iPhone 15 Pro',
      'appium:platformVersion': '17.2',
      'appium:automationName': 'XCUITest',
      'appium:app': path.resolve(
        __dirname,
        'ios/build/Build/Products/Debug-iphonesimulator/MobileCheckout.app'
      ),
      'appium:noReset': false,
    },
    {
      platformName: 'Android',
      'appium:deviceName': 'Pixel_7_API_34',
      'appium:platformVersion': '14',
      'appium:automationName': 'UiAutomator2',
      'appium:app': path.resolve(
        __dirname,
        'android/app/build/outputs/apk/debug/app-debug.apk'
      ),
      'appium:noReset': false,
    },
  ],

  logLevel: 'info',
  bail: 0,
  waitforTimeout: 10000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,

  services: ['appium'],
  appium: {
    command: 'appium',
    args: {
      relaxedSecurity: true,
    },
  },

  framework: 'jasmine',
  jasmineOpts: {
    defaultTimeoutInterval: 60000,
  },

  reporters: [
    'spec',
    [
      'allure',
      {
        outputDir: 'appium/reports/allure-results',
        disableWebdriverStepsReporting: true,
        disableWebdriverScreenshotsReporting: false,
      },
    ],
  ],

  afterTest: async function (test, context, { error, result, duration, passed }) {
    if (!passed) {
      await browser.takeScreenshot();
    }
  },
};
