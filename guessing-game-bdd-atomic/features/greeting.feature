Feature: Greeting Management
  As a user
  I want to manage greetings
  So that I can track different greetings

  Scenario: Create a new greeting
    Given there is no greeting record
    When he is greeting with "Hello, World!"
    Then there is 1 greeting records in the database
