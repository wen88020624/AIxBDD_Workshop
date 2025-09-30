@secret_setting
Feature: 猜數字遊戲 - 設定秘密數字

  Scenario: 第一位玩家設定祕密數字
    Given 遊戲 "ABC" 處於 "設定秘密數字階段" 狀態，包含玩家:
      | id | name   |
      | P1 | Johnny |
      | P2 | Sean   |
    When 玩家 "P1" 設定秘密數字 "1234"
    Then 遊戲 "ABC" 應該保持在 "設定秘密數字階段" 狀態
    And 祕密數字應該為:
      | id | secret |
      | P1 |   1234 |
      | P2 |        |

  Scenario: 兩個祕密數字都設定後進入猜測階段
    Given 遊戲 "ABC" 處於 "設定秘密數字階段" 狀態，包含玩家:
      | id | name   |
      | P1 | Johnny |
      | P2 | Sean   |
    And 玩家 "P1" 已設定祕密數字 1234
    When 玩家 "P2" 設定秘密數字 "1078"
    Then 遊戲 "ABC" 應該進入 "猜數字階段" 狀態
    And 祕密數字應該為:
      | id | secret |
      | P1 |   1234 |
      | P2 |   1078 |

  Scenario: 第一位玩家在猜測開始前更改祕密數字
    Given 遊戲 "ABC" 處於 "設定秘密數字階段" 狀態，包含玩家:
      | id | name   |
      | P1 | Johnny |
      | P2 | Sean   |
    And 玩家 "P1" 已設定祕密數字 1234
    When 玩家 "P1" 更改秘密數字 "5678"
    Then 遊戲 "ABC" 應該保持在 "設定秘密數字階段" 狀態
    And 祕密數字應該為:
      | id | secret |
      | P1 |   5678 |
      | P2 |        |

  Scenario: P2 試圖在 P1 之前設定祕密數字
    Given 遊戲 "ABC" 處於 "設定秘密數字階段" 狀態，包含玩家:
      | id | name   |
      | P1 | Johnny |
      | P2 | Sean   |
    When 玩家 "P2" 設定秘密數字 "1078"
    Then 請求應該失敗，原因為 "P2 must set secret after P1"
    And 遊戲 "ABC" 應該保持在 "Setting secret" 狀態
    And 祕密數字應該為:
      | id | secret |
      | P1 |        |
      | P2 |        |

  Scenario Outline: 無效的祕密數字格式
    Given 遊戲 "ABC" 處於 "設定秘密數字階段" 狀態，包含玩家:
      | id | name   |
      | P1 | Johnny |
      | P2 | Sean   |
    When 玩家 "P1" 設定秘密數字 "<secret>"
    Then 請求應該失敗，原因為 "<reason>"

    Examples:
      | secret | reason                        |
      |    123 | secret length is not 4 digits |
      |  12345 | secret length is not 4 digits |
      |   1123 | digits are not unique         |
      |   abcd | contains non-numeric values   |
      |   12a4 | contains non-numeric values   |
      |   1 23 | contains non-numeric values   |
      |   0000 | digits are not unique         |
      |      9 | secret length is not 4 digits |
      |  1234a | secret length is not 4 digits |
      |   12-4 | contains non-numeric values   |

  Scenario: P1 超過祕密數字變更限制
    Given 遊戲 "ABC" 處於 "設定秘密數字階段" 狀態，包含玩家:
      | id | name   | secret |
      | P1 | Johnny |   5678 |
      | P2 | Sean   |        |
    And 玩家 "P1" 已經變更過一次祕密數字
    When 玩家 "P1" 更改秘密數字 "9012"
    Then 請求應該失敗，原因為 "P1 has already changed secret once, cannot change again"
    And 遊戲 "ABC" 應該保持在 "Setting secret" 狀態
    And 祕密數字應該為:
      | id | secret |
      | P1 |   5678 |
      | P2 |        |

  Scenario: P1 試圖在猜測開始後更改祕密數字
    Given 遊戲 "ABC" 處於 "猜數字階段" 狀態，包含玩家:
      | id | name   | secret |
      | P1 | Johnny |   1234 |
      | P2 | Sean   |   5678 |
    When 玩家 "P1" 更改秘密數字 "9012"
    Then 請求應該失敗，原因為 "Cannot change secret after game enters guessing phase"
    And 遊戲 "ABC" 應該保持在 "猜數字階段" 狀態
    And 祕密數字應該為:
      | id | secret |
      | P1 |   1234 |
      | P2 |   5678 |

  Scenario: P2 無法在猜測開始後更改祕密數字
    Given 遊戲 "ABC" 處於 "猜數字階段" 狀態，包含玩家:
      | id | name   | secret |
      | P1 | Johnny |   1234 |
      | P2 | Sean   |   5678 |
    When 玩家 "P2" 更改秘密數字 "9012"
    Then 請求應該失敗，原因為 "Cannot change secret after game enters guessing phase"
    And 遊戲 "ABC" 應該保持在 "猜數字階段" 狀態
    And 祕密數字應該為:
      | id | secret |
      | P1 |   1234 |
      | P2 |   5678 |
