Feature: Read or Download Book from Subscriptions page

Scenario: Read Book
    Given I am on the subscription page
    When I click on Read
    Then I should be redirected to the Read page