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

public class Then_The_Greeting_Record_Should_Be {

    @Autowired
    private GreetingRepository greetingRepository;


    @Then("the greeting record should be:")
    public void validate(DataTable dataTable) {
        // 從 DataTable 獲取預期的資料
        List<Map<String, String>> rows = dataTable.asMaps();
        Map<String, String> expectedData = rows.get(0);  // 取得第一行資料
        
        // 使用 content 來查詢 greeting 實體
        String expectedContent = expectedData.get("content");
        Greeting greeting = greetingRepository.findByContent(expectedContent);
        
        // 驗證 greeting 實體存在
        assertNotNull(greeting, "Greeting with content '" + expectedContent + "' should exist");
        
        // 驗證 Greeting 的各項屬性
        assertEquals(expectedContent, greeting.getContent(), "Content should match");
        
        // 如果有其他屬性需要驗證，可以在這裡添加更多的斷言
    }
}