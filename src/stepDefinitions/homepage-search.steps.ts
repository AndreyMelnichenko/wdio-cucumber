import { assert } from 'chai';
import { Given, When, Then } from 'cucumber';
import homepage from '../pages/Homepage';


Given(/^I am on the "(.*)" page$/, function(siteUrl:string) {
    homepage.open(siteUrl);
    if(siteUrl.includes('google')){
        const title = browser.getTitle();
        assert.equal(title, 'Google');
    }
});

When(/^I enter "([^"]*)" into the search box$/, function(arg1: string) {
    homepage.enterText(arg1);
});

When(/^I click the search button$/, function() {
    homepage.search();
});


Then(/^I should see a list of search results$/, function() {
    assert.isTrue(homepage.isSearched());
});
