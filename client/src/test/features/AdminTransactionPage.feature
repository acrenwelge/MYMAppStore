Feature: Access Admin Transaction Page
As the seller
So that I can access all available transactions in my admin page 
I want to manage the customer info

Scenario: Successful accessing transaction page as admin user with data
    Given user is in home page
    When the user is logged in in as admin
    And the user clicks on admin button
    And the user goes to the transaction page
    Then the user should be at transaction page
    And the user should see transaction info

Scenario: Successful seaching transaction in product page
    Given user is in the transaction page
    When the user searches for a transaction
    Then only the searched transactions appear

Scenario: Successful sorting txid in transaction page
    Given user is in the transaction page
    When the user selects the category "TxID" to sort
    Then the table will be sorted by "integer" in "ascending" order
    When the user selects the category "TxID" to sort
    Then the table will be sorted by "integer" in "descending" order

Scenario: Successful sorting user first name in transaction page
    Given user is in the transaction page
    When the user selects the category "User First Name" to sort
    Then the table will be sorted by "string" in "ascending" order
    When the user selects the category "User First Name" to sort
    Then the table will be sorted by "string" in "descending" order

Scenario: Successful sorting user last name in transaction page
    Given user is in the transaction page
    When the user selects the category "User Last Name" to sort
    Then the table will be sorted by "string" in "ascending" order
    When the user selects the category "User Last Name" to sort
    Then the table will be sorted by "string" in "descending" order

Scenario: Successful sorting user email in transaction page
    Given user is in the transaction page
    When the user selects the category "User Email" to sort
    Then the table will be sorted by "string" in "ascending" order
    When the user selects the category "User Email" to sort
    Then the table will be sorted by "string" in "descending" order

Scenario: Successful sorting user total amount in transaction page
    Given user is in the transaction page
    When the user selects the category "Total Amount" to sort
    Then the table will be sorted by "integer" in "ascending" order
    When the user selects the category "Total Amount" to sort
    Then the table will be sorted by "integer" in "descending" order

Scenario: Successful sorting purchase date amount in transaction page
    Given user is in the transaction page
    When the user selects the category "Purchase Date" to sort
    Then the table will be sorted by "date" in "ascending" order
    When the user selects the category "Purchase Date" to sort
    Then the table will be sorted by "date" in "descending" order

Scenario: Failed accessing transaction page as general user
    Given user is in home page
    When the user is not logged in in as admin 
    And the user goes to the transaction url
    Then the user will be redirected to the home page