Feature: The Internet Guinea Pig Website

  @demo
  Scenario Outline: As a user, I can log into the secure area

    Given I am on the login page
    Then Test step
      | name | age |
      | tttt | 55  |
    When I login with <username> and <password>
    Then I should see a flash message saying <message>
    

    Examples:
      | username | password             | message                        |
      | tomsmith | SuperSecretPassword! | You logged into a secure area! |
      | foobar   | barfoo               | Your username is invalid!      |
