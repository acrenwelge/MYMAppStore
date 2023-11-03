Feature: Access Subscriptions Page
As the user
So that I can check my subscriptions and expiration date in record page 
I want to manage the customer info

Scenario: Failed accessing subscription page as not login
    Given user is in home page
    When not login  
    And go to the record url
    Then the user will be redirect to main page.

Scenario: Successfully accessing subscription page as a user
    Given user is in home page
    When login as user
    And go to the record url
    Then the user will see the record table.

