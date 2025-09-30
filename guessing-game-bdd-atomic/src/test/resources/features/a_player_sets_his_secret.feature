# [PUT] /games/{gameId}/secret
# Summary: a player sets his secret
Feature: a player sets his secret

  Background:
    Given a player joins a game, with:
      | gameId | playerName |
      | G100   | Alice      |
    And a player joins a game, with:
      | gameId | playerName |
      | G100   | Bob        |

  #------------------------------------------------------------
  Rule: 前置 - 玩家必須已加入此場遊戲
  #------------------------------------------------------------

    @ignore
    Example: Player successfully sets secret after joining game
      When a player sets his secret, with:
        | gameId | playerRole | secret |
        | G100   | P1         | 1234   |
      Then succeeded

    @ignore
    Example: Player fails to set secret without joining game
      When a player sets his secret, with:
        | gameId | playerRole | secret |
        | G999   | P1         | 1234   |
      Then the request fails

  #------------------------------------------------------------
  Rule: 前置 - 遊戲必須尚未進入猜測階段
  #------------------------------------------------------------

    @ignore
    Example: Player sets secret during setting secret phase
      When a player sets his secret, with:
        | gameId | playerRole | secret |
        | G100   | P1         | 5678   |
      Then succeeded

    @ignore
    Example: Player fails to set secret during guessing phase
      Given a player sets his secret, with:
        | gameId | playerRole | secret |
        | G100   | P1         | 1234   |
      And a player sets his secret, with:
        | gameId | playerRole | secret |
        | G100   | P2         | 5678   |
      When a player sets his secret, with:
        | gameId | playerRole | secret |
        | G100   | P1         | 9876   |
      Then the request fails

  #------------------------------------------------------------
  Rule: 前置 - 玩家設定答案的順序為 P1 先設定，然後是 P2
  #------------------------------------------------------------

    @ignore
    Example: P1 sets secret first successfully
      When a player sets his secret, with:
        | gameId | playerRole | secret |
        | G100   | P1         | 2468   |
      Then succeeded

    @ignore
    Example: P2 sets secret after P1 successfully
      Given a player sets his secret, with:
        | gameId | playerRole | secret |
        | G100   | P1         | 1357   |
      When a player sets his secret, with:
        | gameId | playerRole | secret |
        | G100   | P2         | 2468   |
      Then succeeded

    @ignore
    Example: P2 fails to set secret before P1
      When a player sets his secret, with:
        | gameId | playerRole | secret |
        | G100   | P2         | 3691   |
      Then the request fails

  #------------------------------------------------------------
  Rule: 後置 - 此玩家的答案會被首次設定
  #------------------------------------------------------------

    @ignore
    Example: Player secret is saved first time successfully
      When a player sets his secret, with:
        | gameId | playerRole | secret |
        | G100   | P1         | 4825   |
      Then succeeded
      And the Player should be:
        | id | role | name  | secret |
        | 1  | P1   | Alice | 4825   |

  #------------------------------------------------------------
  Rule: 後置 - 當兩位玩家都設定好答案後，遊戲進入猜題階段
  #------------------------------------------------------------

    @ignore
    Example: Game enters guessing phase when both players set secrets
      Given a player sets his secret, with:
        | gameId | playerRole | secret |
        | G100   | P1         | 7531   |
      When a player sets his secret, with:
        | gameId | playerRole | secret |
        | G100   | P2         | 8642   |
      Then succeeded
      And the Game should be:
        | gameId | status   |
        | G100   | Guessing |