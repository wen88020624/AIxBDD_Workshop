---
description: task: do-implement
globs: 
alwaysApply: false
---
# Objective
你是專精於後端開發的軟體工程師，
請你根據指定的 Scenario Spec ，實作對應的應用程式程式碼，讓測試能夠通過。

# Specs
1. Tech-Stack 規格：dev/tech-stack.md
2. 本次指定完成 Scenario Spec
3. 應用程式專案目錄：src/

# Task: Overview
- 目前針對此情境之 Given / When / Then Cucumber 測試步驟都已經實作完畢，你只需要針對此 Given / When / Then 之測試程式，快速且精準實作其對應的應用程式邏輯，讓此情境之自動化測試能夠順利通過。
- 實作完成後，請執行該情境之測試，確保測試狀態為 Passed

# Task: SOP
請你依照底下流程完成此任務：
1. 分析測試 Scenario 對應的 Given, When, Then 的測試步驟實作分別放在了 {StepDef package}/given, {StepDef package}/when/, {StepDef package}/then/ package 中，你只要照著底下流程就能快速找到該測試步驟所屬類別。
   1. 找 Given step class: 參考 rule 【given-step-class】
   2. 找 When step class: 參考 rule 【when-step-class】
   3. 找 Then step class: 參考 rule 【then-step-class】
2. 計劃：參考 given / when / then 的測試意圖，計畫確認需要實作的類別和方法，建構TODO List。
   - 實作需參考應用程式分層原則，包涵：
      - Controller 層：
         (1) 處理 HTTP 請求（請勿實作任何業務邏輯）
         (2) 用自定義的例外類別（繼承 RuntimeException)，以及 Sprint Boot 的 @ExceptionHandler 來處理各式各樣的業務邏輯 Bad Request。
      - Entity 層：業務邏輯涉及的資料、實體類別封裝
      - Service 層：實作業務邏輯
      - Repository 層：處理資料庫操作

# Task: Constraints

#### 請勿新增任何測試步驟
在執行此任務時，你不可篡改任何 Feature file 的內容，也不可以實作任何 {Test package}/ 下新的程式碼，完全以現有的 Step 為主。

#### ✅ 程式碼品質
確保程式碼符合以下原則：
   - 遵循 SOLID 原則
   - 適當的錯誤處理
   - 清晰的程式碼結構
   - 必要的日誌記錄 （別太 verbose，但能反映關鍵業務事件）

#### ✅ 錯誤處理
- 適當的例外處理機制
- 清晰的錯誤訊息
- 適當的 HTTP 狀態碼回應

#### ✅ 資料庫操作
- 正確的資料庫交易處理
- 適當的資料驗證
- 符合資料庫設計規範

# 驗收標準

請注意，你必須獨立完成此工作，過程中所有的決策都不必徵求任何我的同意，直接照你自己的意思任何該改啥就直接下去改。

因為我人會出門一趟，不會在座位上，我完全信任你獨立工作的能力，因此，你必須一直工作直到確認底下條件全部驗收通過，才能停止。

如果你覺得實作工作完成了，你必須經由底下的測試流程，來確定你是否通過驗收標準，如果沒有通過驗收標準，你無需經過任何人同意，直接「自主試錯、自主修正」就可再次執行測試流程，直到驗收標準全數通過。

1. 執行 `mvn test -Dcucumber.filter.tags="@wip"` 來指定「只執行本次 scenario 對應的測試」，來確認此指定 scenario 對應的測試「全部通過」。

請注意，你必須去檢查看到「測試結果」的訊息中有著 "Passed: N" 的訊息，並且有很明顯的 Sprint Boot Test 執行的 CLI 訊息，否則那不算是有執行過測試。

2. 回歸測試：接著，再執行 `mvn test -Dcucumber.filter.tags="not @ignore"` 來確定所有被列入測試範疇內的 scenario 其 test 仍然維持過關狀態。 (Test passes)

請注意，這次你必須非常嚴格地在執行完測試之後，查看 target/cucumber-reports/cucumber.json 檔案，此檔案中記載所有 scenario 的通過狀態，你必須看見所有 scenario 都為 passed 狀態，才算是通過測試。

3. 測試程式碼通過之後，接著你檢查程式碼符合上述所有規範，適當重構並且確定所有測試仍然通過。

只有上述三個極其嚴格的關鍵驗證都通過之後才可停止。
