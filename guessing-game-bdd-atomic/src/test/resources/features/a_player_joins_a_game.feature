# [POST] /games
# Summary: a player joins a game
Feature: a player joins a game

  #------------------------------------------------------------
  Rule: 後置 - 玩家輸入一組 3~5 位字元組成的「遊戲 ID」進行配對
  #------------------------------------------------------------
    @ignore
    Scenario Outline: Player joins with valid game ID format
      When a player joins a game, with:
        | gameId   | playerName   |
        | <gameId> | <playerName> |
      Then response:
        | gameId   | playerRole |
        | <gameId> | P1         |

      Examples:
        | gameId | playerName |
        | ABC    | Alice      |
        | ABCD   | Bob        |
        | ABCDE  | Charlie    |
        | A1B    | Diana      |
        | 12345  | Emma       |

    @ignore
    Scenario Outline: Player fails to join with invalid game ID format
      When a player joins a game, with:
        | gameId   | playerName   |
        | <gameId> | <playerName> |
      Then the request fails

      Examples:
        | gameId  | playerName |
        | AB      | Frank      |
        | A       | Grace      |
        | ABCDEF  | Henry      |
        | ABCDEFG | Ivy        |
        | A@B     | Jack       |

  #------------------------------------------------------------
  Rule: 後置 - 若系統中尚無此 ID，則創建新遊戲，該玩家的角色為 P1
  #------------------------------------------------------------
    @ignore
    Example: First player creates new game and becomes P1
      When a player joins a game, with:
        | gameId | playerName |
        | G001   | Emma       |
      Then response:
        | gameId | playerRole |
        | G001   | P1         |
      And the Game should be:
        | gameId | status             |
        | G001   | Waiting for player |

  #------------------------------------------------------------
  Rule: 後置 - 若該 ID 已存在且遊戲尚未進入猜題階段，則玩家加入之角色為 P2
  #------------------------------------------------------------

    @ignore
    Example: Second player joins existing game and becomes P2
      Given a player joins a game, with:
        | gameId | playerName |
        | G002   | Frank      |
      When a player joins a game, with:
        | gameId | playerName |
        | G002   | Grace      |
      Then response:
        | gameId | playerRole |
        | G002   | P2         |

    @ignore
    Example: Player fails to join game already in guessing phase
      Given a Game, with:
        | gameId | status   |
        | G003   | Guessing |
      When a player joins a game, with:
        | gameId | playerName |
        | G003   | Henry      |
      Then the request fails

  #------------------------------------------------------------
  Rule: 後置 - 若該遊戲已有兩位玩家，則拒絕加入並顯示提示訊息
  #------------------------------------------------------------

    @ignore
    Example: Third player fails to join game with two players already
      Given a player joins a game, with:
        | gameId | playerName |
        | G004   | Ivy        |
      And a player joins a game, with:
        | gameId | playerName |
        | G004   | Jack       |
      When a player joins a game, with:
        | gameId | playerName |
        | G004   | Kelly      |
      Then the request fails

  #------------------------------------------------------------
  Rule: 後置 - 同一玩家不得重複加入同一場遊戲
  #------------------------------------------------------------

    @ignore
    Example: Player fails to join same game twice
      Given a player joins a game, with:
        | gameId | playerName |
        | G005   | Larry      |
      When a player joins a game, with:
        | gameId | playerName |
        | G005   | Larry      |
      Then the request fails

  #------------------------------------------------------------
  Rule: 後置 - 當遊戲有兩位玩家時，進入設定秘密數字階段
  #------------------------------------------------------------

    @ignore
    Example: Game enters secret setting phase when two players joined
      Given a player joins a game, with:
        | gameId | playerName |
        | G006   | Mike       |
      When a player joins a game, with:
        | gameId | playerName |
        | G006   | Nancy      |
      Then response:
        | gameId | playerRole |
        | G006   | P2         |
      And the Game should be:
        | gameId | status         |
        | G006   | Setting secret |