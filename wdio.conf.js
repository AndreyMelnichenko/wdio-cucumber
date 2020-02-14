const { addArgument } = require('@wdio/allure-reporter').default;
const TagExpressionParser = require('cucumber-tag-expressions').TagExpressionParser;
const tagParser = new TagExpressionParser();
const glob = require('glob');
const moment = require('moment');
const fs = require('fs');

const env = process.env.BASE_URL;
const env_domain = process.env.BASE_DOMAIN;
const env_ssl = process.env.SSl || 'https';
const comment = process.env.COMMIT_TITLE || 'Debug run ' + process.env.CUCUMBER_TAGS ;
const author = process.env.COMMIT_AUTHOR;
const revision = process.env.COMMIT_REV;
const deployedAt = process.env.DEPLOY_TIME || `${new moment(new Date()).format('HH:mm:ss DD-MM-YYYY')}`;

const testRailsOptions = {
    domain: process.env.TR_DOMAIN,
    username: process.env.TR_USERNAME,
    password: process.env.TR_APIKEY,
    projectId: process.env.TR_PROJECT_ID || '1',
    suiteId: process.env.TR_SUIT_ID,
    updatePlan: process.env.TR_UPD_PLAN,
    runName: process.env.TR_RUN_NAME,
    includeAll: process.env.TR_ALL || true,
    customStatuses: { "Passed": 1, "Failed": 6 },
    customDescription: `${process.env.TR_CUSTOM_DESCR}` || 'TR_CUSTOM_DESCR'
};

const cucumberTags = process.env.CUCUMBER_TAGS != null ? process.env.CUCUMBER_TAGS : '@world or @test3';
const expressionNode = tagParser.parse(cucumberTags);
const filesWithTags = glob.sync('./src/features/**/*.feature').map((file) => {
    const content = fs.readFileSync(file, 'utf8');
    if (content.length > 0) {
        const tagsInFile = content.match(/(@\w+)/g) || [];
        if (expressionNode.evaluate(tagsInFile)) {
            return file;
        }
    }
    return null;
}).filter(x => x != null);

const clearCookie = () => {
    try {
        browser.deleteCookie();
    } catch (error) {
        console.warn(`Unable to clear browser cache: \n${error}`);
    }
};
let scenarioCounter=0;
exports.config = {
    //
    // ====================
    // Runner Configuration
    // ====================
    //
    // WebdriverIO allows it to run your tests in arbitrary locations (e.g. locally or
    // on a remote machine).
    // runner: 'local',
    //
    // Override default path ('/wd/hub') for chromedriver service.
    hostname: 'aerokube.bll-i.co.uk',
    path: '/wd/hub',
    port: 4444,
    //
    // ==================
    // Specify Test Files
    // ==================
    // Define which test specs should run. The pattern is relative to the directory
    // from which `wdio` was called. Notice that, if you are calling `wdio` from an
    // NPM script (see https://docs.npmjs.com/cli/run-script) then the current working
    // directory is where your package.json resides, so `wdio` will be called from there.
    //
    specs: ['./src/features/**/*.feature'],
    // Patterns to exclude.
    exclude: [
        // 'path/to/excluded/files'
    ],
    //
    // ============
    // Capabilities
    // ============
    // Define your capabilities here. WebdriverIO can run multiple capabilities at the same
    // time. Depending on the number of capabilities, WebdriverIO launches several test
    // sessions. Within your capabilities you can overwrite the spec and exclude options in
    // order to group specific specs to a specific capability.
    //
    // First, you can define how many instances should be started at the same time. Let's
    // say you have 3 different capabilities (Chrome, Firefox, and Safari) and you have
    // set maxInstances to 1; wdio will spawn 3 processes. Therefore, if you have 10 spec
    // files and you set maxInstances to 10, all spec files will get tested at the same time
    // and 30 processes will get spawned. The property handles how many capabilities
    // from the same test should run tests.
    //
    maxInstances: 5,
    //
    // If you have trouble getting all important capabilities together, check out the
    // Sauce Labs platform configurator - a great tool to configure your capabilities:
    // https://docs.saucelabs.com/reference/platforms-configurator
    //
    capabilities: [
        {
            // maxInstances can get overwritten per capability. So if you have an in-house Selenium
            // grid with only 5 firefox instances available you can make sure that not more than
            // 5 instances get started at a time.
            maxInstances: 5,
            browserName: 'chrome',
            // If outputDir is provided WebdriverIO can capture driver session logs
            // it is possible to configure which logTypes to include/exclude.
            // excludeDriverLogs: ['*'], // pass '*' to exclude all driver session logs
            // excludeDriverLogs: ['bugreport', 'server'],
            'goog:chromeOptions': {
                // to run chrome headless the following flags are required
                // (see https://developers.google.com/web/updates/2017/04/headless-chrome)
                args: [
                    // '--headless',
                    '--disable-gpu',
                    '--disable-software-rasterizer',
                    '--start-maximized',
                ],
            },
            'selenoid:options': {
                enableVNC: true,
                sessionTimeout: '5m',
            }
        },
    ],
    //
    // ===================
    // Test Configurations
    // ===================
    // Define all options that are relevant for the WebdriverIO instance here
    //
    // Level of logging verbosity: trace | debug | info | warn | error | silent
    logLevel: 'error',

    // in debug mode passes --inspect
    execArgv: [
        // '--inspect'
    ],
    //
    // Set specific log levels per logger
    // loggers:
    // - webdriver, webdriverio
    // - @wdio/applitools-service, @wdio/browserstack-service, @wdio/devtools-service, @wdio/sauce-service
    // - @wdio/mocha-framework, @wdio/jasmine-framework
    // - @wdio/local-runner, @wdio/lambda-runner
    // - @wdio/sumologic-reporter
    // - @wdio/cli, @wdio/config, @wdio/sync, @wdio/utils
    // Level of logging verbosity: trace | debug | info | warn | error | silent
    // logLevels: {
    //     webdriver: 'info',
    //     '@wdio/applitools-service': 'info'
    // },
    //
    // If you only want to run your tests until a specific amount of tests have failed use
    // bail (default is 0 - don't bail, run all tests).
    bail: 0,
    //
    // Set a base URL in order to shorten url command calls. If your `url` parameter starts
    // with `/`, the base url gets prepended, not including the path portion of your baseUrl.
    // If your `url` parameter starts without a scheme or `/` (like `some/path`), the base url
    // gets prepended directly.
    baseUrl: 'http://localhost:3112',
    //
    // Default timeout for all waitFor* commands.
    waitforTimeout: 10000,
    //
    // Default timeout in milliseconds for request
    // if Selenium Grid doesn't send response
    connectionRetryTimeout: 90000,
    //
    // Default request retries count
    connectionRetryCount: 3,
    //
    // Test runner services
    // Services take over a specific job you don't want to take care of. They enhance
    // your test setup with almost no effort. Unlike plugins, they don't add new
    // commands. Instead, they hook themselves up into the test process.
    services: ['selenium-standalone'],

    // Framework you want to run your specs with.
    // The following are supported: Mocha, Jasmine, and Cucumber
    // see also: https://webdriver.io/docs/frameworks.html
    //
    // Make sure you have the wdio adapter package for the specific framework installed
    // before running any tests.
    framework: 'cucumber',
    //
    // The number of times to retry the entire specfile when it fails as a whole
    // specFileRetries: 1,
    //
    // Test reporter for stdout.
    // The only one supported by default is 'dot'
    // see also: https://webdriver.io/docs/dot-reporter.html
    reporters: [
        'spec',
        [
            'allure',
            {
                outputDir: 'allure-results',
                disableWebdriverStepsReporting: true,
                disableWebdriverScreenshotsReporting: false,
                useCucumberStepReporter: true,
            },
        ],
    ],

    // If you are using Cucumber you need to specify the location of your step definitions.
    cucumberOpts: {
        backtrace: false, // <boolean> show full backtrace for errors
        dryRun: false, // <boolean> invoke formatters without executing steps
        failFast: false, // <boolean> abort the run on first failure
        format: ['pretty'], // <string[]> (type[:path]) specify the output format, optionally supply PATH to redirect formatter output (repeatable)
        colors: true, // <boolean> disable colors in formatter output
        snippets: true, // <boolean> hide step definition snippets for pending steps
        source: true, // <boolean> hide source uris
        profile: [], // <string[]> (name) specify the profile to use
        strict: false, // <boolean> fail if there are any undefined or pending steps
        tagExpression: cucumberTags, // <string> (expression) only execute the features or scenarios with tags matching the expression
        timeout: 24 * 60 * 60 * 1000, // <number> timeout for step definitions
        ignoreUndefinedDefinitions: false, // <boolean> Enable this config to treat undefined definitions as warnings
        requireModule: [
            // <string[]> ("extension:module") require files with the given EXTENSION after requiring MODULE (repeatable)
            'tsconfig-paths/register',
            () => {
                require('ts-node').register(
                    {
                        files: true,
                    });
            },
            '@babel/register',
        ],
        require: [
            './src/utils/hooks.ts', // override default World constructor
            './src/stepDefinitions/*.steps.ts',
            './babel.config.js',
        ], // <string[]> (file/dir) require files before executing features
    },

    //
    // =====
    // Hooks
    // =====
    // WebdriverIO provides several hooks you can use to interfere with the test process in order to enhance
    // it and to build services around it. You can either apply a single function or an array of
    // methods to it. If one of them returns with a promise, WebdriverIO will wait until that promise got
    // resolved to continue.
    /**
     * Gets executed once before all workers get launched.
     * @param {Object} config wdio configuration object
     * @param {Array.<Object>} capabilities list of capabilities details
     */
    onPrepare: function (config, capabilities) {
        if (filesWithTags.length > 0) {
            console.log(`Files with tags:  ${filesWithTags}`);
        }
    },
    /**
     * Gets executed just before initialising the webdriver session and test framework. It allows you
     * to manipulate configurations depending on the capability or spec.
     * @param {Object} config wdio configuration object
     * @param {Array.<Object>} capabilities list of capabilities details
     * @param {Array.<String>} specs List of spec file paths that are to be run
     */
    // beforeSession: function (config, capabilities, specs) {
    // },
    /**
     * Gets executed before test execution begins. At this point you can access to all global
     * variables like `browser`. It is the perfect place to define custom commands.
     * @param {Array.<Object>} capabilities list of capabilities details
     * @param {Array.<String>} specs List of spec file paths that are to be run
     */
    before: () => {
        // result[1].uri;
        // browser.options.baseUrl;
        // browser.options.specs;
        // this.config.cucumberOpts.tagExpression;
        // filesWithTags;
        console.log(`
        +===========================================================
        | TEST-PACK START RUNNING: ${result[1].uri}
        +===========================================================
        | URL:            ${this.config.baseUrl}
        | SPECS:          ${filesWithTags}
        | TagExpression   ${this.config.cucumberOpts.tagExpression}
        +===========================================================
        `);
    },
    /**
     * Runs before a WebdriverIO command gets executed.
     * @param {String} commandName hook command name
     * @param {Array} args arguments that command would receive
     */
    // beforeCommand: function (commandName, args) {
    // },
    /**
     * Runs before a Cucumber feature
     */
    // beforeFeature: function(uri, feature, scenarios) {
    // },
    /**
     * Runs before a Cucumber scenario
     */
    // beforeScenario: function (uri, feature, scenario, sourceLocation) {
    // },
    /**
     * Runs before a Cucumber step
     */
    // beforeStep: function (uri, feature, stepData, context) {
    // },
    /**
     * Runs after a Cucumber step
     */
    // afterStep: function (uri, feature, { error, result, duration, passed }, stepData, context) {
    // },
    afterStep: function(uri, feature, { error }) {
        if (error !== undefined) {
            browser.takeScreenshot();
        }
    },
    /**
     * Runs after a Cucumber scenario
     */
    afterScenario: function(uri, feature, scenario, result, sourceLocation) {
        scenarioCounter += 1;
        console.log("add argument: "+scenarioCounter);
        addArgument('Scenario #', scenarioCounter);
        console.log("feature: "+feature.document.feature.name
            +" TC: "+scenario.tags[0].name
            +" "+ scenario.name
            +" result:"+result.status);
    },
    /**
     * Runs after a Cucumber feature
     */
    // afterFeature: function (uri, feature, scenarios) {
    // },
    // afterTest: function(test) {
    //     if (test.error !== undefined) {
    //     browser.takeScreenshot();
    //     }
    // }
    /**
     * Runs after a WebdriverIO command gets executed
     * @param {String} commandName hook command name
     * @param {Array} args arguments that command would receive
     * @param {Number} result 0 - command success, 1 - command error
     * @param {Object} error error object if any
     */
    // afterCommand: function (commandName, args, result, error) {
    // },
    /**
     * Gets executed after all tests are done. You still have access to all global variables from
     * the test.
     * @param {Number} result 0 - test pass, 1 - test fail
     * @param {Array.<Object>} capabilities list of capabilities details
     * @param {Array.<String>} specs List of spec file paths that ran
     */
    // after: function (result, capabilities, specs) {
    // },
    /**
     * Gets executed right after terminating the webdriver session.
     * @param {Object} config wdio configuration object
     * @param {Array.<Object>} capabilities list of capabilities details
     * @param {Array.<String>} specs List of spec file paths that ran
     */
    // afterSession: function (config, capabilities, specs) {
    // },
    /**
     * Gets executed after all workers got shut down and the process is about to exit. An error
     * thrown in the onComplete hook will result in the test run failing.
     * @param {Object} exitCode 0 - success, 1 - fail
     * @param {Object} config wdio configuration object
     * @param {Array.<Object>} capabilities list of capabilities details
     * @param {<Object>} results object containing test results
     */
    // onComplete: function(exitCode, config, capabilities, results) {
    // },
    /**
     * Gets executed when a refresh happens.
     * @param {String} oldSessionId session ID of the old session
     * @param {String} newSessionId session ID of the new session
     */
    //onReload: function(oldSessionId, newSessionId) {
    //}
};
