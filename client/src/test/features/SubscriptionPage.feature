Feature: Read or Download Book from Subscriptions page

Background:
    Given user is logged in on test arunim account
    And I am on the subscription page

Scenario: Read Book
    When I click on Read
    Then I should be redirected to the Read page

Scenario: Download Finance with Maple Book
    And There is a Finance with Maple Book Subscription
    Then The Download button should be present
    When I click on the download button 
    Then The PDF book should be downloaded

Scenario: Correct Subscription in Owned
    Then The subscription with a 2025 expiration date should be in owned

Scenario: Correct Subscription not in Access
    Then The subscription with a 2025 expiration date should not be in access

Scenario: Correct Subscription in Access
    Then The subscription with a 2042 expiration date should be in access

Scenario: Correct Subscription not in Owned
    Then The subscription with a 2042 expiration date should not be in owned

Scenario: Download Option Not present for Other Subscriptions
    And There is a Book which is not Finance with Maple Subscription
    Then The download button should not be present 