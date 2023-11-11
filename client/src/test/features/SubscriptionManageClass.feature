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

    Scenario: Successfully Purchase Subscription for Students
        And toggles checkbox for a student listed without a subscription on
        And goes to Product Pricing Page
        And adds the subscription item to cart
        And goes to checkout page
        And buys the subscription
        And goes to Manage Class page
        Then the instructor now owns the student's subscription
