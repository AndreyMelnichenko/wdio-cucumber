import { Then } from "cucumber";

Then(/^my test step$/,function() {
    browser.url(browser.options.baseUrl);
    console.log("!!!!!! ");
    // browser.url("http://google.com");
    $('.SignUp-loginForm-form').waitForDisplayed(5000);
    console.log('!!! old cucumber running!!!!');
    console.log($('.SignUp-loginForm-form').isDisplayed());
});
