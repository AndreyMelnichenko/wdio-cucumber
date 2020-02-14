import { Then } from "cucumber";
import webdriverGitPage, { IProjectMetadata } from 'src/pages/webdriverGitPage';

Then(/^save object to world$/,function() {
    const a = {name:'Andrii', age:'22'};
    this.keepValue('test',a);
    // console.log(a)
});

Then(/^Save WDIO metadata at repo as "(.*)"$/,function (varName:string) {
    webdriverGitPage.waitForReleases();
    const gitMetaData:IProjectMetadata = webdriverGitPage.getMetaData();
    this.keepValue(varName,gitMetaData);
    // console.log(gitMetaData);
});
