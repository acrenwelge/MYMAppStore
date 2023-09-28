Feature: Edit User first and last name
As the customer
I want to manage my first and last name
So that I keep my infomration up to date

Background:
    Given user is logged in
    When user is at profile management page

Scenario: Successfully changing first and last name
    And changes their 'First name' and 'Last name' field
    And the names only have alphabetical characters
    And clicks 'Save Information'
    Then the first and last name of the user is changed


Scenario: Failed to change first and last name
    And changes their 'First name' and 'last name' field
    And the names do not only have alphabetical characters
    And clicks 'Save Information'
    Then the user is prompted to input a valid name