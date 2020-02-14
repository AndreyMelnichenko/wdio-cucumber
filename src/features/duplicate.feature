Feature: Duplicate Google Search
	
	As a user on the Google search page
	I want to search for Selenium-Webdriver
	Because I want to learn more about it
	
	Background:
		Given I am on the "https://google.com" page
	
	@test3
	Scenario: Performing a search operation
		When I enter "Selenium Webdriver" into the search box
		And save object to world
		And  I click the search button
		Then I should see a list of search results
