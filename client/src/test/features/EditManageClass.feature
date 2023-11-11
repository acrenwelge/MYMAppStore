Feature: Edit Class Management Page
I want to edit my class' info
As an instructor
So that I can add/remove students

    Background:
        Given user is logged in as instructor
        When user is at the class management page

    Scenario: Successfully removing a student from the class
        And clicks 'Remove Student' for a student listed
        Then the student is removed from the class.

    Scenario: Successfully adding a student with an existing account
        And inputs student's email under 'Add Existing User as Student'
        And clicks 'Add Student'
        Then student is added to the class and shows in the student list.

    Scenario: Failed adding a student from an existing email since they don't have an account
        And inputs student's email under 'Add Existing User as Student' with nonexisting
        And clicks 'Add Student'
        Then student is not added to the class.

    Scenario: Successfully adding a student without an existing account
        And inputs student's firstname, lastname, and email without existing
        Then student is added to the class and shows in the student list.

    Scenario: Failed adding a student without an existing account
        And inputs student's firstname, lastname, and email with existing
        Then student is not added to the class.
