Feature: Read or Download Book from Subscriptions page

Scenario: Read Book
    Given I am on the subscription page
    When I click on Read
    Then I should be redirected to the Read page

Scenario: Download Finance with Maple Book
    Given I am on the subscription page
    And There is a Finance with Maple Book Subscription
    Then The Download button should be present
    When I click on the download button 
    Then The PDF book should be downloaded

Scenario: Download Option Not present for Other Subscriptions
    Given I am on the subscription page
    And There is a Book which is not Finance with Maple Subscription
    Then The download button should not be present 