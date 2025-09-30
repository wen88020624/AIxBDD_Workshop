---
description: rule: then-entity-validate
alwaysApply: false
---
# Then step Class 實作規範

## Location
Then entity validate class 存放於：{StepDef package}/then package 底下。

## Class Name
Then entity validate class 的命名格式為：Then_the_<entity name>_should_be

範例：某一 Then step statement 為：`Then the customer should be:`，那麼其對應的 class name 則為 `Then_The_Customer_Should_Be`，其中，Entity 為 "Customer"。

## Implementation Constraints
1. 請注意，到這一步還不需要實作任何後端程式碼，請專心定義測試步驟，除非是先去定義好 Then step 中涉及的 Repository 介面 或是 Entity 類別，否則不要撰寫任何的實作程式碼。


## Implementation
1. 宣告一個 
    ```
    @Then("<then step statement template>")
    public void validate(DataTable dataTable) throws Exception {
      // TODO (1) 使用此 entity 對應的 repository 來透過 ID 查詢此筆 entity。
      // TODO (2) 使用一系列的 Assertions 來對 entity 進行逐參數驗證，預期的值被定義在 dataTable 中。
    }
    ``` 
    - 參數實作：根據該 then step 使用的參數狀況實作對應參數
2. 接著，到 {App package}/repository 中尋找，看看此 entity 對應的 Repository 是否已經被創建了。如果沒有，則創建 (使用 Sprint JPA 的 CrudRepository) 於 repository 目錄下。
3. 回到此 Then entity validate class 中完成 `TODO (1) 使用此 entity 對應的 repository 來透過 ID 查詢此筆 entity。`
4. 完成 `TODO (2) 使用一系列的 Assertions 來對 entity 進行逐參數驗證，預期的值被定義在 dataTable 中。` 的程式碼。注意，所有被定義在 DataTable 中的參數都要拿出來逐條與 entity 進行驗證。

- 範例：
1. 假設有一個 Product Entity 為：
  ```yml
  name: Product
  description: "產品實體，代表一個可購買的商品的資訊"
  primary_key: 
    - productId
  properties:
    productId:
      type: string
      description: "產品的唯一識別碼"
      example: "PROD-123"
      constraints:
        - "通常為 8-16 位字母數字組合"
    name:
      type: string
      description: "產品名稱"
      example: "iPhone 15 Pro"
      constraints:
        - "不能為空"
        - "長度在 2-100 字元之間"
    price:
      type: number
      description: "產品價格"
      example: 999.99
      constraints:
        - "必須大於 0"
    stock:
      type: integer
      description: "產品庫存數量"
      example: 50
      constraints:
        - "必須大於等於 0"
    category:
      type: string
      description: "產品類別"
      enum:
        - "Electronics"
        - "Clothing"
        - "Books"
        - "Home"
        - "Beauty"
      example: "Electronics"
    isActive:
      type: boolean
      description: "產品是否上架"
      example: true

  relationships:
    - entity: CartItem
      type: one-to-many
      description: "一個產品可以出現在多個購物車項目中"

  invariants:
    # 基本約束
    - isActive == true => stock > 0
    - price > 0
    
    # 庫存與購物車的關係
    - ∀ cartItem ∈ cartItems: cartItem.quantity <= stock
  ```
2. 還有一個 Cart / CartItem entity：
  ```yml
  name: Cart
  description: "購物車實體，代表使用者的購物車狀態和資訊"
  primary_key: 
    - cartId
  properties:
    cartId:
      type: string
      description: "購物車的唯一識別碼"
      example: "CART-456"
      constraints:
        - "通常為 8-16 位字母數字組合"
    userId:
      type: string
      description: "擁有此購物車的使用者 ID"
      example: "USER-789"
    status:
      type: string
      description: "購物車當前狀態"
      enum:
        - "Active"      # 活躍狀態，可以添加/修改商品
        - "Checkout"    # 結帳中
        - "Completed"   # 已完成購買
        - "Abandoned"   # 已放棄
      example: "Active"
    createdAt:
      type: timestamp
      description: "購物車創建時間"
      example: "2023-08-15T10:30:00Z"
    updatedAt:
      type: timestamp
      description: "購物車最後更新時間"
      example: "2023-08-15T11:45:00Z"
    totalAmount:
      type: number
      description: "購物車總金額"
      example: 1299.97
      constraints:
        - "必須大於等於 0"

  relationships:
    - entity: CartItem
      type: one-to-many
      description: "一個購物車可以包含多個購物車項目"
    - entity: User
      type: many-to-one
      description: "多個購物車屬於一個使用者"

  invariants:
    # 基本狀態約束
    - status == "Completed" => totalAmount > 0
    - status == "Active" => |cartItems| >= 0
    
    # 購物車項目與狀態的關係
    - status ∈ {"Checkout", "Completed"} => |cartItems| > 0
    - status == "Abandoned" && (currentTime - updatedAt) > 24小時
    
    # 總金額計算
    - totalAmount == ∑(cartItem.price * cartItem.quantity) for all cartItem ∈ cartItems

  ---

  name: CartItem
  description: "購物車項目實體，表示購物車中的單個商品"
  properties:
    cartItemId:
      type: string
      description: "購物車項目的唯一識別碼"
      example: "ITEM-101"
    quantity:
      type: integer
      description: "商品數量"
      example: 2
      constraints:
        - "必須大於 0"
    price:
      type: number
      description: "加入購物車時的商品單價"
      example: 999.99
      constraints:
        - "必須大於 0"

  relationships:
    - entity: Cart
      type: many-to-one
      description: "多個購物車項目屬於一個購物車"
    - entity: Product
      type: many-to-one
      description: "多個購物車項目關聯到一個產品"

  invariants:
    # 基本約束
    - quantity > 0
    - price > 0
    
    # 與產品的關係
    - price == product.price (加入購物車時)
    - quantity <= product.stock (加入購物車時)
```

    3. **Then Step**:
    ```gherkin
    Then the cart should be:
      | cartId | userId | status | totalAmount | items[0].cartItemId | items[0].quantity | items[0].price | items[1].cartItemId | items[1].quantity | items[1].price |
      | CART-456 | USER-789 | Active | 1299.97 | ITEM-101 | 2 | 499.99 | ITEM-102 | 1 | 799.99 |
    ```
    4. 在 Then_The_Cart_Should_Be 類別中，則第一步，他會先定義 Then step：
      ```
      @Then("<then step statement template>")
      public void validate(DataTable dataTable) throws Exception {
        // TODO (1) 使用此 entity 對應的 repository 來透過 ID 查詢此筆 entity。
        // TODO (2) 使用一系列的 Assertions 來對 entity 進行逐參數驗證，預期的值被定義在 dataTable 中。
      }
      ```
    5. 接著，我們需要創建 CartRepository 介面（如果還不存在的話）：
    ```java
    package tw.waterballsa.bddworkshop.repository;

    import tw.waterballsa.bddworkshop.entity.Cart;
    import org.springframework.data.repository.CrudRepository;
    import org.springframework.stereotype.Repository;

    @Repository
    public interface CartRepository extends CrudRepository<Cart, String> {
    }
    ```

    6. 然後，我們回到 Then_The_Cart_Should_Be 類別，完成 TODO 部分：
    ```java
    public class Then_The_Cart_Should_Be {

        @Autowired
        private CartRepository cartRepository;

        @Autowired
        private ScenarioContext scenarioContext;

        @Then("the cart should be:")
        public void validate(DataTable dataTable) {
            // 從 DataTable 獲取預期的資料
            List<Map<String, String>> rows = dataTable.asMaps();
            Map<String, String> expectedData = rows.get(0);  // 取得第一行資料
            
            // 從 ScenarioContext 或 DataTable 中獲取 cartId
            String cartId = expectedData.get("cartId");
            
            // 使用 repository 查詢 cart 實體
            Optional<Cart> optionalCart = cartRepository.findById(cartId);
            assertTrue(optionalCart.isPresent(), "Cart with ID " + cartId + " should exist");
            
            Cart actualCart = optionalCart.get();
            
            // 驗證 Cart 的基本屬性
            assertEquals(expectedData.get("userId"), actualCart.getUserId(), "UserId should match");
            assertEquals(expectedData.get("status"), actualCart.getStatus(), "Status should match");
            assertEquals(new BigDecimal(expectedData.get("totalAmount")), actualCart.getTotalAmount(), "TotalAmount should match");
            
            // 驗證 CartItems
            List<CartItem> cartItems = actualCart.getCartItems();
            
            // 驗證第一個 CartItem
            if (expectedData.containsKey("items[0].cartItemId")) {
                assertTrue(cartItems.size() >= 1, "Cart should have at least 1 item");
                CartItem item0 = findCartItemById(cartItems, expectedData.get("items[0].cartItemId"));
                assertEquals(Integer.parseInt(expectedData.get("items[0].quantity")), item0.getQuantity(), "First item quantity should match");
                assertEquals(new BigDecimal(expectedData.get("items[0].price")), item0.getPrice(), "First item price should match");
            }
            
            // 驗證第二個 CartItem
            if (expectedData.containsKey("items[1].cartItemId")) {
                assertTrue(cartItems.size() >= 2, "Cart should have at least 2 items");
                CartItem item1 = findCartItemById(cartItems, expectedData.get("items[1].cartItemId"));
                assertEquals(Integer.parseInt(expectedData.get("items[1].quantity")), item1.getQuantity(), "Second item quantity should match");
                assertEquals(new BigDecimal(expectedData.get("items[1].price")), item1.getPrice(), "Second item price should match");
            }
            
            // 如果有更多的 CartItem，可以繼續添加驗證邏輯
        }
        
        // 輔助方法：根據 cartItemId 查找 CartItem
        private CartItem findCartItemById(List<CartItem> items, String cartItemId) {
            return items.stream()
                    .filter(item -> item.getCartItemId().equals(cartItemId))
                    .findFirst()
                    .orElseThrow(() -> new AssertionError("CartItem with ID " + cartItemId + " not found"));
        }
    }
    ```