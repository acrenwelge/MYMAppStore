Feature: Access Product Page
As the seller
So that I can access all available purchase codes in my admin page 
I want to manage the purchase codes info

Scenario: Successful accessing purchase codes page as admin user with data
    Given user is in home page
    When the user is logged in in as admin
    And the user clicks on admin button
    And the user goes to the purchase codes page
    Then the user should be at purchase codes page
    And the user should see purchase code info

Scenario: Successful seaching purchase codes in purchase code page
    Given user is in the purchase code page
    When the user searches for a purchase code
    Then only the searched purchase codes appear

Scenario: Successful sorting purchase codes in purchase code page
    Given user is in the purchase code page
    When the user selects the category "Code" to sort
    Then the table will be sorted by "string" in "ascending" order
    When the user selects the category "Code" to sort
    Then the table will be sorted by "string" in "descending" order

Scenario: Successful sorting prices in purchase code page
    Given user is in the purchase code page
    When the user selects the category "Product" to sort
    Then the table will be sorted by "string" in "ascending" order
    When the user selects the category "Product" to sort
    Then the table will be sorted by "string" in "descending" order

Scenario: Successful sorting subscription length in purchase code page
    Given user is in the purchase code page
    When the user selects the category "Percent Off" to sort
    Then the table will be sorted by "integer" in "ascending" order
    When the user selects the category "Percent Off" to sort
    Then the table will be sorted by "integer" in "descending" order

Scenario: Successful creating, editing, and deleting of purchase codes
    Given user is in the purchase code page
    When user presses the add purchase code button
    And enters in the new purchase code info
    Then the table will show the added purchase code
    When user presses the edit purchase code button
    And enters in the edited purchase code info
    Then the table will show the edited purchase code
    When user presses the delete purchase code button
    Then the table will not show the purchase code

Scenario: Failed accessing purchase codes page as general user
    Given user is in home page
    When the user is not logged in in as admin 
    And the user goes to the purchase codes url
    Then the user will be redirected to the home page