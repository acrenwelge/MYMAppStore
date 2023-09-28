Feature: Edit User first and last name
As the customer
I want to manage my first and last name
So that I keep my infomration up to date

Background:
    Given user is logged in
    When user is at profile management page

Scenario: Successfully changing first and last name
    And changes their 'First name' and 'Last name' field
    And clicks 'Save Information'
    Then the first and last name of the user is changed