Feature: Access Admin Transaction Page
As the seller
So that I can access the user in my admin page 
I want to manage the customer info

Scenario: Successful accessing class page as admin user with data
    Given user is in home page
    When the user is logged in in as admin
    And the user clicks on admin button
    And the user goes to the class page
    Then the user should be at class page
    And the user should see class info

Scenario: Successful seaching user in class page
    Given user is in the class page
    When the user searches for a class
    Then only the searched classes appear

Scenario: Successful sorting class id in class page
    Given user is in the class page
    When the user selects the category "Class ID" to sort
    Then the table will be sorted by "interger" in "ascending" order
    When the user selects the category "Class ID" to sort
    Then the table will be sorted by "interger" in "descending" order

Scenario: Successful sorting class instructor in class page
    Given user is in the class page  
    When the user selects the category "Class Instructor" to sort
    Then the table will be sorted by "string" in "ascending" order
    When the user selects the category "Class Instructor" to sort
    Then the table will be sorted by "string" in "descending" order

Scenario: Failed accessing class page as general user
    Given user is in home page
    When the user is not logged in in as admin 
    And the user goes to the class url
    Then the user will be redirected to the home page