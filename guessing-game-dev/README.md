# 1A2B 猜數字遊戲

這是一個支援雙人線上對戰的1A2B猜數字遊戲的後端API系統。

## 技術棧

- **語言**: Java 17
- **框架**: Spring Boot 2.7.14
- **ORM**: Spring Data JPA
- **資料庫**: H2 (內存資料庫，用於開發)
- **建構工具**: Maven

## 項目結構

```
src/main/java/tw/waterballsa/guessinggame/
├── entity/          # JPA實體類別
├── repository/      # 資料存取層介面
├── service/         # 業務邏輯層
├── controller/      # API控制器層
├── dto/            # 資料傳輸物件
└── GuessingGameApplication.java  # 主應用程式類別
```

## 如何運行

1. **使用Maven編譯和運行**:
   ```bash
   ./mvnw clean compile
   ./mvnw spring-boot:run
   ```

2. **應用程式將在 http://localhost:8080 啟動**

3. **訪問H2資料庫控制台** (開發用):
   - URL: http://localhost:8080/h2-console
   - JDBC URL: jdbc:h2:mem:guessinggame
   - 用戶名: sa
   - 密碼: (留空)

## API端點

### 1. 加入遊戲
```http
POST /api/games/join
Content-Type: application/json

{
    "gameId": "ABC12",
    "playerName": "玩家1"
}
```

### 2. 設定答案
```http
POST /api/games/{gameId}/answer
Content-Type: application/json

{
    "playerId": 1,
    "answer": "1234"
}
```

### 3. 進行猜測
```http
POST /api/games/{gameId}/guess
Content-Type: application/json

{
    "playerId": 1,
    "guessNumber": "5678"
}
```

### 4. 獲取遊戲狀態
```http
GET /api/games/{gameId}
```

## 遊戲流程

1. **加入遊戲**: 玩家輸入遊戲ID和名稱加入遊戲
2. **等待對手**: 等待第二位玩家加入
3. **設定答案**: 兩位玩家分別設定4位不重複數字作為答案
4. **開始猜測**: 輪流猜測對方的答案
5. **遊戲結束**: 當某位玩家猜出4A時獲勝

## 遊戲規則

- 答案必須為4位不重複數字
- 猜測時系統會回傳「幾A幾B」的結果
- A表示數字和位置都正確
- B表示數字正確但位置錯誤
- 4A表示完全正確，該玩家獲勝

## 開發注意事項

- 使用H2內存資料庫，應用程式重啟後資料會消失
- 所有API都支持跨域請求(CORS)
- 包含完整的錯誤處理和輸入驗證
- 支持並發多場遊戲
