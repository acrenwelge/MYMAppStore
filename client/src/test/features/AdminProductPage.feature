Feature: Access Product Page
As the seller
So that I can access all available products in my admin page 
I want to manage the products info

Scenario: Successful accessing products page as admin user with data
    Given user is in home page
    When the user is logged in in as admin
    And the user clicks on admin button
    And the user goes to the products page
    Then the user should be at products page
    And the user should see product info

Scenario: Successful seaching products in product page
    Given user is in the product page
    When the user searches for a product
    Then only the searched products appear

Scenario: Successful sorting products in product page
    Given user is in the product page
    When the user selects the category "Product Name" to sort
    Then the table will be sorted by "string" in "ascending" order
    When the user selects the category "Product Name" to sort
    Then the table will be sorted by "string" in "descending" order

Scenario: Successful sorting prices in product page
    Given user is in the product page
    When the user selects the category "Price" to sort
    Then the table will be sorted by "integer" in "ascending" order
    When the user selects the category "Price" to sort
    Then the table will be sorted by "integer" in "descending" order

Scenario: Successful sorting subscription length in product page
    Given user is in the product page
    When the user selects the category "Subscription Length" to sort
    Then the table will be sorted by "integer" in "ascending" order
    When the user selects the category "Subscription Length" to sort
    Then the table will be sorted by "integer" in "descending" order

Scenario: Failed accessing products page as general user
    Given user is in home page
    When the user is not logged in in as admin 
    And the user goes to the products url
    Then the user will be redirected to the home page