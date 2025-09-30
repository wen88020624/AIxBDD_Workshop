# [PATCH] /games/{gameId}/secret
# Summary: a player changes his secret
Feature: a player changes his secret

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
    Example: Player successfully changes secret after joining game
      Given a player sets his secret, with:
        | gameId | playerRole | secret |
        | G100   | P1         | 1234   |
      When a player changes his secret, with:
        | gameId | playerRole | secret |
        | G100   | P1         | 5678   |
      Then succeeded

    @ignore
    Example: Player fails to change secret without joining game
      When a player changes his secret, with:
        | gameId | playerRole | secret |
        | G999   | P1         | 1234   |
      Then the request fails

  #------------------------------------------------------------
  Rule: 前置 - 遊戲必須尚未進入猜測階段
  #------------------------------------------------------------

    @ignore
    Example: Player changes secret during setting secret phase
      Given a player sets his secret, with:
        | gameId | playerRole | secret |
        | G100   | P1         | 2468   |
      When a player changes his secret, with:
        | gameId | playerRole | secret |
        | G100   | P1         | 1357   |
      Then succeeded

    @ignore
    Example: Player fails to change secret during guessing phase
      Given a player sets his secret, with:
        | gameId | playerRole | secret |
        | G100   | P1         | 1234   |
      And a player sets his secret, with:
        | gameId | playerRole | secret |
        | G100   | P2         | 5678   |
      When a player changes his secret, with:
        | gameId | playerRole | secret |
        | G100   | P1         | 9876   |
      Then the request fails

  #------------------------------------------------------------
  Rule: 前置 - 玩家必須已經設定過答案
  #------------------------------------------------------------

    @ignore
    Example: Player changes secret after initial secret was set
      Given a player sets his secret, with:
        | gameId | playerRole | secret |
        | G100   | P1         | 3691   |
      When a player changes his secret, with:
        | gameId | playerRole | secret |
        | G100   | P1         | 7024   |
      Then succeeded

    @ignore
    Example: Player fails to change secret without initial secret
      When a player changes his secret, with:
        | gameId | playerRole | secret |
        | G100   | P1         | 8531   |
      Then the request fails

  #------------------------------------------------------------
  Rule: 前置 - 玩家可以改變最多一次自己設定好的答案
  #------------------------------------------------------------

    @ignore
    Example: Player changes secret for the first time successfully
      Given a player sets his secret, with:
        | gameId | playerRole | secret |
        | G100   | P1         | 4825   |
      When a player changes his secret, with:
        | gameId | playerRole | secret |
        | G100   | P1         | 9630   |
      Then succeeded

    @ignore
    Example: Player fails to change secret for the second time
      Given a player sets his secret, with:
        | gameId | playerRole | secret |
        | G100   | P1         | 1472   |
      And a player changes his secret, with:
        | gameId | playerRole | secret |
        | G100   | P1         | 5839   |
      When a player changes his secret, with:
        | gameId | playerRole | secret |
        | G100   | P1         | 6041   |
      Then the request fails

  #------------------------------------------------------------
  Rule: 後置 - 玩家的答案會被更新
  #------------------------------------------------------------

    @ignore
    Example: Player secret is updated successfully
      Given a player sets his secret, with:
        | gameId | playerRole | secret |
        | G100   | P1         | 2753   |
      When a player changes his secret, with:
        | gameId | playerRole | secret |
        | G100   | P1         | 8146   |
      Then succeeded
      And the Player should be:
        | id | role | name  | secret |
        | 1  | P1   | Alice | 8146   |