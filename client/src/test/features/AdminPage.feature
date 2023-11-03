Feature: Access Admin Page
As the seller
So that I can access the user transaction purchase code in my admin page 
I want to manage the customer info

Scenario: Successful accessing admin page as admin user
    Given user is in home page
    When the user is logged in in as admin
    And the user clicks on admin button
    Then the user should be in admin page

Scenario: Failed accessing admin page as general user
    Given user is in home page
    When the user is not logged in in as admin 
    And the user goes to the admin url
    Then the user will be redirected to the home page

