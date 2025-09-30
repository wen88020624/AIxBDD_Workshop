---
description: task: relationship-validate
alwaysApply: false
---
# Relationship validate Class 實作規範

## Location
Relationship validate class 存放於：{StepDef package}/then package 底下。

## Class Name
1. 首先，先撰寫 then step statement 對應的 step statement template
    - 規則：
        - 遇到雙引號或是單引號刮起來的字串，一律換成 {str} 變數插值區塊。
        - 遇到整數，一律換成 {int} 變數插值區塊。
        - 遇到浮點數，一律換成 {double} 浮點數插值區塊。
    - 範例：
        - Then step statement: `the classroom (ID="A") has 32 students`
        - 其對應的 then step statement template: `the classroom (ID="{str}") has {int} students`
2. 接著將此 step statement template 撰寫成對應的 Relationship validate step Class 名稱：
    - 規則：
        - Then step class 的命名格式為：`Then_{step statement in Snake_Capital_Case}`
        - 把所有其餘符號拿掉，用空格取而代之。
        - 在 statement 中，將每一個變數插值區塊，抽換成對應的簡易代號（才能作為類別名稱）：
            - {int} 或是 {double}: 填入 N 作為數字代號
            - {double}: 填入 N 作為數字代號
            - {str}: 填入 XXX 作為字串代號
    - 範例：
        - Then step statement template: `the classroom (ID="{str}") has {int} students`
        - 其對應的 Then step class name：`Then_The_Classroom_ID_XXX_Has_N_Students`

## Implementation Constraints
1. 請注意，到這一步還不需要實作任何後端程式碼，請專心定義測試步驟，除非是先去定義好 Then step 中涉及的 Repository 介面 或是 Entity 類別，否則不要撰寫任何的實作程式碼。

## Implementation
1. 宣告一個 ```
    @Then("<then step statement template>")
    public void validate(String ownerIdAsString, int expectedMultiplicityNumber, DataTable dataTable) throws Exception
    ``` 方法，此方法即為此 Then step 的唯一實作（DataTable 有可能為 null）

2. 遵守底下規則，來實作此 then step 對應的驗證邏輯：
    i. 必須使用 JUnit 的 Assertions 來進行逐參數驗證，不能使用其他測試框架的斷言方法。
    ii. 如果驗證需要查詢資料庫狀態，則使用 Repository 介面來查詢，不能使用 Mock 物件。
- 範例：
    1. 假設 **Then Step** 定義為: "Then the classroom (ID="{str}") has {int} students"
    2. 在 Then_The_Classroom_ID_XXX_Has_N_Students 類別中，實作
    ```java
    class Then_The_Classroom_ID_XXX_Has_N_Students {
        @Autowired
        private ClassroomRepository classroomRepository;
        
        @Autowired
        private StudentRepository studentRepository;
        
        @Then("the classroom \\(ID=\"{str}\"\\) has {int} students")
        public void validate(String ownerIdAsString, int expectedMultiplicityNumber, DataTable dataTable) throws Exception {
            // 1. Verify the classroom exists
            Classroom classroom = classroomRepository.findById(ownerIdAsString)
                .orElseThrow(() -> new IllegalArgumentException("Classroom with ID " + ownerIdAsString + " not found"));
            
            // 2. Get the actual students for this classroom
            List<Student> students = studentRepository.findByClassroomId(ownerIdAsString);
            
            // 3. Verify the count matches
            assertEquals(expectedMultiplicityNumber, students.size(),
                String.format("Expected classroom (ID=%s) to have %d students, but found %d",
                ownerIdAsString, expectedMultiplicityNumber, students.size()));
            
            // 4. If a DataTable is provided, verify each student in the table
            if (dataTable != null) {
                List<Map<String, String>> expectedStudents = dataTable.asMaps();
                
                // Verify each expected student exists in the actual students list
                for (Map<String, String> expectedStudent : expectedStudents) {
                    String studentId = expectedStudent.get("student.id");
                    boolean found = students.stream()
                        .anyMatch(student -> student.getId().equals(studentId));
                    
                    assertTrue(found, 
                        String.format("Expected student with ID %s not found in classroom %s", 
                        studentId, classroomId));
                }
            }
        }
    }
    ```
    