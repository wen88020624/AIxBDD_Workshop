# [GET] /greeting
# Summary: he is greeting
@walking-skeleton
Feature: he is greeting

  #------------------------------------------------------------
  Rule: 後置：問候之後，會新增一筆問候訊息
  #------------------------------------------------------------
    
    Example: Normal greeting
      When he is greeting, with:
        | name |
        | Johnny |
      Then response:
        | message |
        | Hello world, Johnny. |
      And the greeting record should be:
        | content |
        | Hello world, Johnny. |

  #------------------------------------------------------------
  Rule: 前提：名字不能為空白
  #------------------------------------------------------------
    Example: Using blank name for greeting
      When he is greeting, with:
        | name |
        |      |
      Then the request fails
  
  #------------------------------------------------------------
  Rule: 前提：一分鐘內最多問候兩次
  #------------------------------------------------------------
    
    Example: Greeting three times within one minute failed
      Given a greeting, with:
        | id | content | name | createdAt |
        | 1 | Hello world, Johnny. | Johnny | <now_ts> |
      And he is greeting, with:
        | name |
        | Johnny |
      When he is greeting, with:
        | name |
        | Johnny |
      Then the request fails, due to "Rate limit exceeded"