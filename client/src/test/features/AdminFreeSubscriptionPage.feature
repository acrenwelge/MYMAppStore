Feature: Access Product Page
As the seller
So that I can access all available suffixs in my admin page 
I want to manage the suffixs info

Scenario: Successful accessing free subscription page as admin user with data
    Given user is in home page
    When the user is logged in in as admin
    And the user clicks on admin button
    And the user goes to the free subscription page
    Then the user should be at free subscription page
    And the user should see suffix info

Scenario: Successful seaching suffixs in free subscription page
    Given user is in the free subscription page
    When the user searches for a suffix
    Then only the searched suffixs appear

Scenario: Successful sorting suffixs in free subscription page
    Given user is in the free subscription page
    When the user selects the category "Email Suffix" to sort
    Then the table will be sorted by "string" in "ascending" order
    When the user selects the category "Email Suffix" to sort
    Then the table will be sorted by "string" in "descending" order

Scenario: Successful creating, editing, and deleting of suffixs
    Given user is in the free subscription page
    When user presses the add suffix button
    And enters in the new suffix info
    Then the table will show the added suffix
    When user presses the edit suffix button
    And enters in the edited suffix info
    Then the table will show the edited suffix
    When user presses the delete suffix button
    Then the table will not show the suffix

Scenario: Failed accessing free subscription page as general user
    Given user is in home page
    When the user is not logged in in as admin 
    And the user goes to the free subscription url
    Then the user will be redirected to the home page