---
description: task: verify-scenario-test-fails
globs: 
alwaysApply: false
---
# Task
確定指定之 Scenario 中的每一個 steps 皆已被實作，且確定 Cucumber 能執行此 scenario 的自動化測試，並且確認結果為 "Failed" （畢竟還沒開始實作）

# Inputs
1. 指定的 scenario 原始碼文本

# Task Outcome
1. 除了此 Scenario 為 Test failed 之外，其他 test case 全部過關
2. 此 scenario test failed 的原因，必須不能為測試框架本身環境，或是語言編譯失敗等等的錯誤，必須為「value difference」(e.g., 期望 200 http response，實際卻為 404/500 http response）類型的錯誤。

# Task Reference
1. 指定的 then step: 請見參考的 feature file 中指定的行數
2. Tech-Stack 規格：dev/tech-stack.md

# Strictly follow this SOP to complete this task
1. 下達 `mvn test -Dcucumber.filter.tags="@wip"` 來單獨執行此 scenario（假設此 scenario 已被標注 @wip，否則必須要為其標注）
2. 確認此 scenario 的每一個測試步驟都有被執行到，並且必須為 Test failed 狀態：
   - 確認測試失敗有符合預期的原因，此原因必須不能為測試框架本身環境，或是語言編譯失敗等等的錯誤，必須為「value difference」(e.g., 期望 200 http response，實際卻為 404/500 http response）類型的錯誤，因為還沒有實作此功能，所以後端當然不會照期望運作，因此為應用程式邏輯上的錯誤，不該為運行環境上的錯誤。
   - 如果發生的預期之外的，運行環境/編譯上的錯誤，則必須修正，直到發生的錯誤屬於 「value difference」類型的錯誤為止。
3. 最後，再執行 `mvn test -Dcucumber.filter.tags="not @ignore"` 來確定所有被列入測試範疇內的 scenario 其 test 仍然維持過關狀態。 (Test passes)