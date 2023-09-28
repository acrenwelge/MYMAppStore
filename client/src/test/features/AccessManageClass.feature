Feature: Access Class Management Page
I want to see my class' info
As an instructor
So that I can access and edit my class' information 

Scenario: Successfully accessing class management page as an instructor
    Given user is logged in as instructor
    When not accessing an item
    And go to the class management url
    Then the user should be at class management page with their class information displayed.

Scenario: Failed accessing class management page as non-instructor user
    Given user is not logged in as instructor
    When not accessing an item
    And go to the class management url
    Then the user will not see any class data.