---
description: task: api-call
alwaysApply: false
---
# API Call Step Class 實作規範
## Location
API Call step class 存放於：{StepDef package}/api package 底下。

## 意義
API Call Step 的職責是「作為 Given/When steps 皆可使用的 API 呼叫型步驟」。
好比在 Feature file 中，可能同時有 given/when 同時定義了同樣的 API call step，好比說：
```gherkin
Example: Each student can only submits his assignment three times
  Given a student submits his assignment
  And a student submits his assignment
  When a studemt submits his assignment
  Then the request fails
```

此範例中，Given 和 When 都共用了 "a student submits his assignment" 這個 API Call，指的是呼叫 summary = "a student submits his assignment" 對應的 API。我們將這個指令呼叫的綁定步驟封裝到一個獨立類別中，因此稱此指令為 "API Call step class"。

## Class Name
API Call step class 的命名格式為：API_{step statement in Snake_Capital_Case}，遵照底下命名解析流程：
1. 首先，先撰寫 step statement 對應的 API Call step statement template
    - 規則：
        - 遇到雙引號或是單引號刮起來的字串，一律換成 {str} 變數插值區塊。
        - 遇到整數，一律換成 {int} 變數插值區塊。
        - 遇到浮點數，一律換成 {double} 浮點數插值區塊。
    - 範例：
        - Given step statement: `a customer (ID="ABC") places an order (4 products), with:`
        - 其對應的 API Call step statement template: `a customer (ID={str}) places an order ({int} products), with:`
2. 接著將此 step statement template 撰寫成對應的 API Call Step Class 名稱：
    - 規則：
        - API Call step class 的命名格式為：`API_{step statement in Snake_Capital_Case}`
        - 把所有其餘符號拿掉，用空格取而代之。
        - 在 statement 中，將每一個變數插值區塊，抽換成對應的簡易代號（才能作為類別名稱）：
            - {int} 或是 {double}: 填入 N 作為數字代號
            - {double}: 填入 N 作為數字代號
            - {str}: 填入 XXX 作為字串代號
    - 範例：
        - Given step statement template: `a customer (ID={str}) places an order ({int} products), with:`
        - 其對應的 API Call step class name：`API_A_Customer_ID_XXX_Places_An_Order_N_Products_With`

## Implementation Constraints
1. 請注意，到這一步還不需要實作任何後端程式碼，請專心定義測試步驟，不要撰寫任何的實作程式碼。

## Implementation
0. 依賴注入 {StepDef Package}/ScenarioContext 和 MockMvc 類別
1. 首先，先宣告一個共用的命令方法
    ```
    @When("<given/when step statement template>")
    public void invoke(DataTable dataTable) throws Exception {...}
    ```
    - 無論此 step 是 Given 還是 When step，只需要統一標注 @When annotation 就好，不必特別標注 @Given。
2. 實作 invoke 方法:
    1. 先將此 API Request parameters & Body properties 所有的參數，從 DataTable 中取出。
    2. 再來，會嚴格參考 API Spec，透過 API 測試工具 (e.g., MockMvc)，來呼叫 API，直接實作 API-Level End to end test。必須符合 API Spec 所定義的 API 使用方式、及參數傳入方式以及完全正確的 body schema。
      - API Spec 與 API Call 的對應規則，將該 step statement 中的變數以及輔助字眼（e.g., with) 拿掉之後，就會對應到該 API endpoint 在 API Spec 中的 'summary'。
        - 範例："Given the participant submits his sign-up form, with" 會對應到的 API's summary 為 "the participant submits his sign-up form" 的 endpoint
    3. 最後，從 API 測試工具中呼叫 API 得到的 HttpResponse 物件，直接呼叫 `scenarioContext.setLastResponse(result);` 由 ＳcenarioContext 保管 API 呼叫後的 HttpResponse，之後的 then step 會取出 lastResponse 來加以驗證。

範例：
假設我們要實作一個 Given step:
```
Given the participant submits his sign-up form, with:
    | participantId | age | gender | city |
    | A001          | 25  | male   | Taipei |
```

對應的 API Spec 定義：
```yaml
POST /signup
Summary: the participant submits his sign-up form
Request Body:
  Content-Type: application/json
  Schema:
    type: object
    required:
      - participantId
      - age
      - gender
      - city
    properties:
      participantId:
        type: string
        description: 參與者ID
      age:
        type: string
        description: 年齡
      gender:
        type: string
        description: 性別
      city:
        type: string
        description: 城市
```

則其對應的 invoke step 實作為底下程式碼：
```java
@When("the participant submits his sign-up form, with:")
public void invoke(DataTable dataTable) throws Exception {
    // 1. 從 DataTable 中取出相關資料
    Map<String, String> formData = dataTable.asMaps().get(0);
    String participantId = formData.get("participantId");
    String age = formData.get("age");
    String gender = formData.get("gender");
    String city = formData.get("city");

    // 2. 準備 API 請求資料 - 嚴格遵照 API Spec 的 Request Body Schema
    Map<String, String> requestBody = Map.of(
        "participantId", participantId,  // 對應 API Spec 的 required field
        "age", age,                      // 對應 API Spec 的 required field
        "gender", gender,                // 對應 API Spec 的 required field
        "city", city                     // 對應 API Spec 的 required field
    );

    // 3. 呼叫 API - 使用正確的 HTTP Method 和 Path
    String jsonRequestBody = objectMapper.writeValueAsString(requestBody);

    MvcResult result = mockMvc.perform(post("/signup")  // 符合 API Spec 的 POST /signup
            .contentType(MediaType.APPLICATION_JSON)    // 符合 API Spec 的 Content-Type
            .content(jsonRequestBody))                   // 傳送符合 Schema 的 Request Body
            .andReturn();

    // 4. 儲存 response 到 ScenarioContext
    scenarioContext.setLastResponse(result);
}
```