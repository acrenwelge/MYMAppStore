Feature: Access Admin Transaction Page
As the seller
So that I can access the user in my admin page 
I want to manage the customer info

Scenario: Successful accessing subscription page as admin user with data
    Given user is in home page
    When the user is logged in in as admin
    And the user clicks on admin button
    And the user goes to the subscription page
    Then the user should be at subscription page
    And the user should see subscription info

Scenario: Successful seaching user in subscription page
    Given user is in the subscription page
    When the user searches for a subscription
    Then only the searched subscriptions appear

Scenario: Successful sorting subscription email in subscription page
    Given user is in the subscription page  
    When the user selects the category "Email" to sort
    Then the table will be sorted by "string" in "ascending" order
    When the user selects the category "Email" to sort
    Then the table will be sorted by "string" in "descending" order

Scenario: Successful sorting subscription user in subscription page
    Given user is in the subscription page  
    When the user selects the category "User (Owner)" to sort
    Then the table will be sorted by "string" in "ascending" order
    When the user selects the category "User (Owner)" to sort
    Then the table will be sorted by "string" in "descending" order

Scenario: Successful sorting subscription user in subscription page
    Given user is in the subscription page  
    When the user selects the category "Product" to sort
    Then the table will be sorted by "string" in "ascending" order
    When the user selects the category "Product" to sort
    Then the table will be sorted by "string" in "descending" order

Scenario: Successful sorting subscription user in subscription page
    Given user is in the subscription page  
    When the user selects the category "End Date" to sort
    Then the table will be sorted by "string" in "ascending" order
    When the user selects the category "End Date" to sort
    Then the table will be sorted by "string" in "descending" order

Scenario: Failed accessing subscription page as general user
    Given user is in home page
    When the user is not logged in in as admin 
    And the user goes to the subscription url
    Then the user will be redirected to the home page