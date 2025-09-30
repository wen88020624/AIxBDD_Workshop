---
trigger: model_decision
description: rule: given-entity-saved
---

# Given Entity Saved Class 實作規範
## Location
Given entity saved step class 存放於：{StepDef package}/given package 底下。

## Class Name
Given entity saved class 的命名格式為：Given_A_<entity name>
範例：某一 Given step statement 為：`Given a customer, with:`，那麼其對應的 class name 則為 `Given_A_Customer`，其中，Entity 為 "Customer"。

## Implementation Constraints
1. 在這一步驟中，你不能實作任何後端 Controller / Service 邏輯程式，更不可實作任何新的 Controller / Service 方法，請專心定義測試步驟。

## Implementation
嚴格遵照
1. 首先，依照 Class name 創建此 Given entity saved step class。
2. 再來，檢查 Entity 對應的 Repository 介面是否存在，必定存放在 {App package}/repository/<Entity's name>Repository，若不存在則創建 Repository 介面，介面名稱為 <Entity's name>Repository。
3. 接著，進到此 Given entity saved step class 中，依賴注入上一步所需的 Repository。
4. 定義其 step definition 於 step class 中：
    ```
    @Given("<given step statement template>")
    public void invoke(DataTable dataTable) throws Exception {
        // TODO 將 dataTable 中每一列的 Entity properties 參數，將每一個 entity 創建出來，並且用 Repository 的 save 方法儲存。
    }
    ```
5. 回到此 Given class 中完成 `TODO 將 dataTable 中每一列的 Entity properties 參數，將每一個 entity 創建出來，並且用 Repository 的 save 方法儲存。` 的程式碼。
6. 把 TODO 的註解刪掉
7. 確認此 Repository 是否在 {StepDef package}/DatabaseCleanupHooks 的 cleanupAllData 方法中，有把所有資料刪掉（i.e., 呼叫 deleteAll()。