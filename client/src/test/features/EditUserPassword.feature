Feature: Edit User password
As the customer
I want to manage my password
So that I keep my account secure

Background:
    Given user is logged in
    When user is at profile management page

Scenario: Successfully changing password
    And clicks the 'Change password' button
    And fills in the 'Enter password' and 'Confirm password' fields
    And clicks 'Save password'
    And the password is at least 12 characters long with no more than 3 characters repeating
    Then the password is changed

Scenario: Failed to change password
    And clicks the 'Change password' button
    And fills in the 'Enter password' and 'Confirm password' fields
    And clicks 'Save password'
    And the password is either not at least 12 characters long or has 4 or more characters repeating 
    Then user is prompted to input a valid password