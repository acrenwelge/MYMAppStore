Feature: Access Admin Transaction Page
As the seller
So that I can access the user transaction purchase code in my admin page 
I want to manage the customer info

Scenario: Successful accessing transaction page as admin user with data
    Given user is at home page
    When logged in as admin
    And go to the admin menu
    And go to the transaction page
    Then the user should be at transaction page
    And the user should see info


Scenario: Failed accessing transaction page as general user
    Given user is at home page
    When not logged in as admin
    And go to the transaction url
    Then the user should be at home page