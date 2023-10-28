Feature: Access Product Page
As the seller
So that I can access all available products in my admin page 
I want to manage the products info

Scenario: Successful accessing products page as admin user with data
    Given user is at home page product
    When logged in as admin product
    And go to the admin menu product
    And go to the products page
    Then the user should be at products page
    And the user should see product info


Scenario: Failed accessing transaction page as general user
    Given user is at home page product
    When not logged in as admin product
    And go to the products url
    Then the user should be at home page product