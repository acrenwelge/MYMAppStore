Feature: Manage Student Subscriptions On Class Management Page
I want to manage my class' subscriptions
As an instructor
So that I can pay for their textbook subscription

    Background:
        Given user is logged in as instructor with 5 students in their class
        When user is at the class management page

    Scenario: Successfully Toggle Checkbox On 
        And toggles checkbox for a student listed without a subscription on
        Then the student is on purchase list.

    Scenario: Successfully Toggle Checkbox Off
        And toggles checkbox for a student listed without a subscription on
        And toggles checkbox for a student listed without a subscription off
        Then the student is not on purchase list.

    Scenario: Successfully Show No Student Information on Product Page
        And goes to Product Pricing Page
        Then no student information is shown.

    Scenario: Successfully Show No Student Information on Checkout Page
        And goes to checkout page
        Then no student information is shown.

    Scenario: Successfully Show Student Information on Product Page
        And toggles checkbox for a student listed without a subscription on
        And goes to Product Pricing Page
        Then that student's information is shown.

    Scenario: Successfully Show Student Information on Checkout Page
        And toggles checkbox for a student listed without a subscription on
        And goes to checkout page
        Then that student's information is shown.

    Scenario: Quantity on Checkout Successfully Does Not Increment when Adding a Student
        And goes to Product Pricing Page
        And adds the subscription item to cart
        And goes to checkout page
        And records the quantity
        And goes to the class management page
        And toggles checkbox for a student listed without a subscription on
        And goes to checkout page
        Then the quantity should still be 1

    Scenario: Quantity on Checkout Successfully Does Increment when Adding a Student
        And toggles checkbox for a student listed without a subscription on
        And goes to Product Pricing Page
        And adds the subscription item to cart
        And goes to checkout page
        And records the quantity
        And goes to the class management page
        And toggles checkbox for another student listed without a subscription on
        And goes to checkout page
        Then the quantity should be 2 from 1

    Scenario: Quantity on Checkout Successfully Decrements when Removing a Student
        And toggles checkbox for a student listed without a subscription on
        And toggles checkbox for another student listed without a subscription on
        And goes to Product Pricing Page
        And adds the subscription item to cart
        And goes to checkout page
        And records the quantity
        And goes to the class management page
        And toggles checkbox for a student listed without a subscription off
        And goes to checkout page
        Then the quantity should be 1 from 2

    Scenario: Successfully Purchase Subscription for Students
        And toggles checkbox for a student listed without a subscription on
        And goes to Product Pricing Page
        And adds the subscription item to cart
        And goes to checkout page
        And buys the subscription
        And goes to Manage Class page
        Then the instructor now owns the student's subscription
