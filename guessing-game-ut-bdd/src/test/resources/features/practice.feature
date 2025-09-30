Feature: 創建 or 加入遊戲

Rule: 若系統中尚無此 ID，則視為創建新遊戲，該玩家將成為該場遊戲的 P1。
  Example: P1 創建新遊戲
    Given 玩家 "Alice" 加入遊戲
    When 系統中尚無此玩家ID
    Then 創建新遊戲 "ABC123"
    And 遊戲 "ABC123" 中只存在以下玩家:
      | 玩家  | 角色 |
      | Alice | P1   |

Rule: 若該 ID 已存在且遊戲尚未進入猜題階段，則玩家加入為 P2。
  Example: P2 成功加入已存在遊戲
    Given 玩家 "Alice" 已加入遊戲 "ABC123"
    When 玩家 "Bob" 輸入遊戲 ID "ABC123" 開始遊戲
    Then 遊戲 "ABC123" 的狀態為 "設定秘密數字"
    And 遊戲 "ABC123" 中只存在以下玩家:
      | 玩家  | 角色 |
      | Alice | P1   |
      | Bob   | P2   |

Rule: 若該遊戲已經有兩位玩家，則顯示「該遊戲已滿，請選擇其他遊戲」。
  Example: P3 加入遊戲 "ABC123" 時，則顯示「該遊戲已滿，請選擇其他遊戲」
    Given 遊戲 "ABC123" 中已存在兩位玩家
    When 玩家 "Jack" 加入已存在遊戲 "ABC123"
    Then 玩家 "Jack" 加入遊戲 "ABC123" 失敗
    And 顯示「該遊戲已滿，請選擇其他遊戲」