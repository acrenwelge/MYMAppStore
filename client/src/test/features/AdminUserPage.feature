Feature: Access Admin Transaction Page
As the seller
So that I can access the user in my admin page 
I want to manage the customer info

Scenario: Successful accessing user page as admin user with data
    Given user is in home page
    When the user is logged in in as admin
    And the user clicks on admin button
    And the user goes to the user page
    Then the user should be at user page
    And the user should see user info

Scenario: Successful seaching user in user page
    Given user is in the user page
    When the user searches for a user
    Then only the searched users appear

Scenario: Successful sorting in user page
    Given user is in the user page
    When the user selects the category "Email" to sort
    Then the table will be sorted by "string" in "ascending" order
    When the user selects the category "Email" to sort
    Then the table will be sorted by "string" in "descending" order
    When the user selects the category "First Name" to sort
    Then the table will be sorted by "string" in "ascending" order
    When the user selects the category "First Name" to sort
    Then the table will be sorted by "string" in "descending" order
    When the user selects the category "Last Name" to sort
    Then the table will be sorted by "string" in "ascending" order
    When the user selects the category "Last Name" to sort
    Then the table will be sorted by "string" in "descending" order
    When the user selects the category "Register Time" to sort
    Then the table will be sorted by "string" in "ascending" order
    When the user selects the category "Register Time" to sort
    Then the table will be sorted by "string" in "descending" order
    When the user selects the category "Admin" to sort
    Then the table will only have rows where column number 4 is true
    When the user selects the category "Admin" to sort
    Then the table will only have rows where column number 4 is false
    When the user selects the category "Activated" to sort
    Then the table will only have rows where column number 5 is true
    When the user selects the category "Activated" to sort
    Then the table will only have rows where column number 5 is false

Scenario: Failed accessing user page as general user
    Given user is in home page
    When the user is not logged in in as admin 
    And the user goes to the user url
    Then the user will be redirected to the home page