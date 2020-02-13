import Page from 'src/pages/Page';
import { IProjectMetadata } from 'src/pages/webdriverGitPage';

class NpmWebdriverPage extends Page{
    private pageElement:string = "//h1[text()='WebdriverIO']";
    private npmVersion:string = "//h3[text()='Version']/following-sibling::p";
    private npmIssues:string = "//h3[text()='Issues']/following-sibling::p/a";
    private npmPulls:string = "//h3[text()='Pull Requests']/following-sibling::p/a";


    public open (url:string) {
        super.open(url);
        browser.pause(1000);
    }

    public waitForNpmLoaded():NpmWebdriverPage{
        $(this.pageElement).waitForDisplayed(5000);
        return this;
    }

    private getNpmVersion():string{
        return $(this.npmVersion).getText().trim();
    }

    private getNpmIssues():string{
        return $(this.npmIssues).getText().trim();
    }

    private getNpmPulls():string{
        return $(this.npmPulls).getText().trim();
    }

    public getNpmMetaData():IProjectMetadata{
        const metadata = {} as IProjectMetadata;
        metadata.releases = this.getNpmVersion();
        metadata.issues = this.getNpmIssues();
        metadata.pulls = this.getNpmPulls();
        return metadata;
    }
}

export default new NpmWebdriverPage();
