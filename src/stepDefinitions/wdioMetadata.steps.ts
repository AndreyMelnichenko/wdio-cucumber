import { Helper } from 'src/utils/helper';
import { Then } from "cucumber";
import webdriverGitPage, { IProjectMetadata } from 'src/pages/webdriverGitPage';

Then(/^Click to result$/,function() {
    browser.url("http://www.google.com");
    const a = {name:'Andrii', age:'22'};
    Helper.addWorldValue(this,'Person',a);
    this.keepValue('test',a);

    const b = Helper.getWorldValue('%{Person.name}',this);
    console.log(b)
});

Then(/^Save WDIO metadata at repo as "(.*)"$/,function (varName:string) {
    webdriverGitPage.waitForReleases();
    const gitMetaData:IProjectMetadata = webdriverGitPage.getMetaData();
    this.keepValue(varName,gitMetaData);
    console.log(gitMetaData);
});
