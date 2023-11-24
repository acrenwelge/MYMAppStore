Feature: Check out Purchase Code
As a customer
So that I can redeem a purchase code
I want to be able to check out using a purchase code

Background:
    Given user is logged in
    And has an item in the cart
    And is on the checkout page

Scenario: Checking out with a valid purchase code
    When I enter a valid purchase code
    When I click the apply button
    Then the purchase code should be applied

Scenario: Checking out with an invalid purchase code
    When I enter an invalid purchase code
    When I click the apply button
    Then an error message should be displayed