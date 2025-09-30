package tw.waterballsa.bddworkshop.stepdefs.then;

import io.cucumber.datatable.DataTable;
import io.cucumber.java.en.Then;
import org.springframework.beans.factory.annotation.Autowired;
import tw.waterballsa.bddworkshop.entity.Greeting;
import tw.waterballsa.bddworkshop.repository.GreetingRepository;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

public class Then_A_Greeting_Record {

    @Autowired
    private GreetingRepository greetingRepository;

    @Then("a greeting record:")
    public void then_a_greeting_record(DataTable dataTable) {
        // 獲取 DataTable 的所有欄位名稱和值
        List<Map<String, String>> rows = dataTable.asMaps();
        
        // 假設我們只驗證第一行
        Map<String, String> row = rows.get(0);
        
        // 檢查是否有 content 欄位
        if (row.containsKey("content")) {
            String expectedContent = row.get("content");
            
            // 從資料庫中查找最新的問候記錄
            Greeting latestGreeting = greetingRepository.findFirstByOrderByIdDesc();
            
            // 驗證記錄存在且內容符合預期
            assertNotNull(latestGreeting, "找不到問候記錄");
            assertEquals(expectedContent, latestGreeting.getContent(), 
                "問候記錄的內容不符合預期。預期: " + expectedContent + ", 實際: " + latestGreeting.getContent());
        }
    }
}