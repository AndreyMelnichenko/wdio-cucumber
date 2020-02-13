Feature: Test Custom World Storage
	
	@world
	Scenario Outline: WDIO version
		Given I am on the "https://github.com/webdriverio/webdriverio/releases" page
		When Save WDIO metadata at repo as "GIT"
		And I am on the "https://www.npmjs.com/package/webdriverio" page
		When Save WDIO metadata at npm as "NPM"
		Then Compare "%{GIT.<parameter>}" and "%{NPM.<parameter>}"
		
		Examples:
			| parameter |
			| releases  |
			| issues    |
			| pulls     |
