import { Then } from "cucumber";
import { expect } from "chai";
import npmWebdriverPage from '../pages/npmWebdriverPage';
import { IProjectMetadata } from '../pages/webdriverGitPage';
import { Helper } from '../utils/helper';

Then(/^Save WDIO metadata at npm as "(.*)"$/,function(npmDate:string) {
    npmWebdriverPage.waitForNpmLoaded();
    const npmMetaData:IProjectMetadata = npmWebdriverPage.getNpmMetaData();
    this.keepValue(npmDate,npmMetaData);
    console.log(npmMetaData);
});

Then(/^Compare "(.*)" and "(.*)"$/,function(firsCompareValue:string, secondCompareValue:string) {
    const a = Helper.getWorldValue(firsCompareValue,this);
    const b = Helper.getWorldValue(secondCompareValue,this);
    expect(a).to.equal(b);
});
