import Page from 'src/pages/Page';

class WebdriverGitPage extends Page{
    private projectReleases:string = "//a[@aria-current='page' and text()='Releases']";
    private releasesList:string = "div.release-main-section h4>a[href]";
    private issuesList:string = "//a[contains(@data-selected-links,'repo_issues')]/span[@class='Counter']";
    private pullsList:string = "//a[contains(@data-selected-links,'repo_pulls')]/span[@class='Counter']";

    public open (url:string) {
        super.open(url);
        browser.pause(1000);
    }

    public waitForReleases():WebdriverGitPage{
        $(this.projectReleases).waitForDisplayed(3000,false,'Page dod not load');
        return this;
    }

    private getLastVersionRelease():string{
        return $$(this.releasesList)[0].getText().trim().replace("v","");
    }

    private getIssues():string{
        return $(this.issuesList).getText().trim();
    }

    private getPulls():string{
        return $(this.pullsList).getText().trim();
    }

    public getMetaData():IProjectMetadata{
        let metadata = {} as IProjectMetadata;
        metadata.releases = this.getLastVersionRelease();
        metadata.issues = this.getIssues();
        metadata.pulls = this.getPulls();
        return metadata;
    }

}

interface IProjectMetadata {
    releases:string;
    issues:string;
    pulls:string;

}

export { IProjectMetadata }
export default new WebdriverGitPage();
