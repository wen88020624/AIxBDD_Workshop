---
globs: **/entity/**.java
alwaysApply: false
---
## Entity Class 實作規範
## Location
Entity Class 存放於：{App package}/entity package 底下。

## Entity Spec

1. 須與 Entity 規格文件完全一致。
2. 此份 Entity 規格文件存放於 {Analysis package}/entities/{entity's name} 中。

## Implementation Constraint

1. 必須使用相容 **Spring Boot 3.x / Jakarta**（使用 `jakarta.persistence.*`） 的 JPA 技術來實作 Entity class。
2. 需要複合主鍵時，自動產生 `@Embeddable` + `@EmbeddedId`。
3. 依約束加入 **Bean Validation** 註解 (`@NotBlank`, `@Size`, `@Pattern`, …)。
4. 能為 `null` 的欄位標示 `@Column(nullable = true)`；反之設 `false`。

## Implementation 
1. **確認主鍵**
   * 若 `properties` 含 `id` 或 `<entity>Id` ⇒ 單鍵。
   * 否則依 `relationships` 決定是否需複合鍵。
4. **產生 Enum**
   * 對所有 `enum:` 欄位：
     * 建立 `enum <FieldName> { … }`。
     * 在 Entity 中加 `@Enumerated(EnumType.STRING)`。
5. **建立 Embeddable Key（如需要）**
   * 將複合鍵欄位建成 `@Embeddable` 類。
   * 在子實體使用 `@EmbeddedId` + `@MapsId`。
6. **對映屬性**
   * 將 YAML 型別映射成 Java 型別（`String`, `Integer`, `Boolean`, `LocalDateTime`…）。
   * 依 `example` 長度或 `constraints` 加 `@Column(length = …)`。
7. **套用驗證**
   * 把 `constraints` / `validation_rules` 轉成 Bean Validation Annotation。
   * 若需自訂規則（如 `unique_digits`），產生對應 Validator。
8. **建立關聯**
   * 依 `relationships.type` 決定 `@OneToMany`, `@ManyToMany`, …
   * 預設 `fetch = LAZY`, `cascade = ALL`, `orphanRemoval = true`。
9. **命名規範**
   * 類名 **PascalCase**；欄位 **camelCase**。
   * Table 名稱 `snake_case_plural`，除非 YAML 指定。
10. **靜態驗證**
    * 使用 Hibernate Validator 進行模擬校驗，確保 Annotation 不衝突。
11. **嚴格守護不變條件**
    * 若 Entity spec 中有定義 "invariant" 則需根據每一條 invariant 嚴格在每一個可能修改到狀態的方法下執行驗證。
12. **最終檢查**
    * 勾選交付清單：檔案完整、關聯正確、驗證到位、理論可編譯。
