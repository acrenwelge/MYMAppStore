Feature: Edit Class Management Page
I want to edit my class' info
As an instructor
So that I can add/remove students and pay for their textbooks

    Background:
        Given user is logged in as instructor
        When user is at the class management page

    Scenario: Successfully adding a student with an existing account
        And inputs student's email under 'Add Existing User as Student'
        And clicks 'Add Student'
        Then student is added to the class and shows in the student list.

    Scenario: Failed adding a student from an existing email
        And inputs student's email under 'Add Existing User as Student'
        And clicks 'Add Student'
        And email does not exist in the database
        Then student is not added to the class and doesn't show in the student list.

    Scenario: Successfully adding a student without an existing account
        And under 'Add New User as Student' section
        And inputs student's firstname, lastname, and email
        And email given is not in the database already
        Then student is added to the class and shows in the student list.

    Scenario: Failed adding a student without an existing account
        And under 'Add New User as Student' section
        And inputs student's firstname, lastname, and email
        And email given is in the database already
        Then student is not added to the class.

    Scenario: Successfully removing a student from the class
        And clicks 'Remove Student' for a student listed
        Then the student is removed from the class and doesn't show on the page.

    Scenario: Successfully purchase a textbook for a student from the class
        And clicks 'Purchase Items' for a student listed
        Then the student is removed from the class and doesn't show on the page.
    