---
description: task: count-validate
alwaysApply: false
---
# Count validate Class 實作規範

## Location
Count validate class 存放於：{StepDef package}/then package 底下。

## Class Name

Count validate Class 的類別名稱為：Then_There_Are_N_<entity name>。

範例：
1. Then step statement template: `there are {int} students`
2. 其對應的 Count validate Class name 為：`Then_There_Are_N_Students`

## Implementation Constraints
1. 請注意，到這一步還不需要實作任何後端程式碼，請專心定義測試步驟，除非是先去定義好 Then step 中涉及的 Repository 介面 或是 Entity 類別，否則不要撰寫任何的實作程式碼。

## Implementation
1. 宣告一個 ```
    @Then("<then step statement template>")
    public void validate(int expectedNumber, DataTable dataTable) throws Exception {
        // TODO: 使用該 Entity 負責之 Repository 來驗證其符合給定 dataTable 猜數條件的實體數量是否等於 expectedNumber
    }
    ``` 方法，此方法即為此 Then step 的唯一實作。

2. 實作 TODO － 使用該 Entity 負責之 Repository 來驗證其存在於資料庫的數量是否等於 expectedNumber
- 範例：
    1. 假設 **Then Step** 定義為: 
        ```
        Then there are 23 products:
            | category | region |
            |  Drink |  Taipei |
        ```
    2. 在 Then_There_Are_N_Products 類別中，實作
    ```java

    class Then_There_Are_N_Products {
        @Autowired
        private ProductRepository productRepository;

        @Then("there are {int} products")
        public void validate(int expectedNumber, DataTable dataTable) throws Exception {
            // 1. Extract filter criteria from DataTable
            Map<String, String> criteria = dataTable.asMaps().get(0);
            String category = criteria.get("category");
            String region = criteria.get("region");
            
            // 2. Use repository to count products matching the criteria
            long actualCount = productRepository.countByCategoryAndRegion(category, region);
            
            // 3. Assert that the actual count matches the expected count
            Assertions.assertEquals(expectedNumber, actualCount, 
                String.format("Expected %d products with category '%s' and region '%s', but found %d", 
                expectedNumber, category, region, actualCount));
        }
    }
    ```
    