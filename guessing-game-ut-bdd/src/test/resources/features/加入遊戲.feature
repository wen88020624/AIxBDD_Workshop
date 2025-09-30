@game_creation
Feature: 猜數字遊戲 - 加入遊戲

  Scenario: 創建新遊戲
    When 玩家 "Johnny" 加入一場遊戲 "ABC"
    Then 遊戲 "ABC" 應該被創建
    And 遊戲應該包含玩家:
      | name   |
      | Johnny |

  Scenario: 遊戲成功開始
    Given 遊戲 "ABC" 已被玩家 "Johnny" 創建
    When 玩家 "Sean" 加入一場遊戲 "ABC"
    Then 遊戲 "ABC" 應該進入 "設定秘密數字階段" 狀態
    And 遊戲應該包含玩家:
      | name   |
      | Johnny |
      | Sean   |

  Scenario: 遊戲已滿時玩家無法加入
    Given 遊戲 "ABC" 已包含玩家:
      | name   |
      | Johnny |
      | Sean   |
    When 玩家 "Roy" 加入一場遊戲 "ABC"
    Then 請求應該失敗
