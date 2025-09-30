package tw.waterballsa.bddworkshop.stepdefs;

import io.cucumber.java.en.Then;
import org.springframework.beans.factory.annotation.Autowired;
import static org.junit.jupiter.api.Assertions.*;
import io.cucumber.datatable.DataTable;
import com.jayway.jsonpath.DocumentContext;
import com.jayway.jsonpath.JsonPath;
import com.jayway.jsonpath.PathNotFoundException;
import java.util.List;
import java.util.Map;

public class CommonThen {
    
    @Autowired
    private ScenarioContext scenarioContext;
    
    @Then("the request fails")
    public void then_the_request_fails() throws Exception {
        // Verify HTTP Status Code is 4xx (client-side fault)
        int statusCode = scenarioContext.getLastResponse().getResponse().getStatus();
        assertTrue(statusCode >= 400 && statusCode < 500, 
            "Expected HTTP status code to be 4xx (client error) but got " + statusCode);
    }
    
    @Then("the request fails, due to {string}")
    public void then_the_request_fails_due_to(String reason) throws Exception {
        // Verify HTTP Status Code is 4xx (client-side fault)
        int statusCode = scenarioContext.getLastResponse().getResponse().getStatus();
        assertTrue(statusCode >= 400 && statusCode < 500, 
            "Expected HTTP status code to be 4xx (client error) but got " + statusCode + 
            ". Reason: " + reason);
    }
    
    @Then("request succeeds")
    public void then_request_succeeds() throws Exception {
        // Verify HTTP Status Code is 2xx (success)
        int statusCode = scenarioContext.getLastResponse().getResponse().getStatus();
        assertTrue(statusCode >= 200 && statusCode < 300, 
            "Expected HTTP status code to be 2xx (success) but got " + statusCode);
    }
    
    @Then("succeeded")
    public void then_succeeded() throws Exception {
        // Verify HTTP Status Code is 2xx (success)
        int statusCode = scenarioContext.getLastResponse().getResponse().getStatus();
        assertTrue(statusCode >= 200 && statusCode < 300, 
            "Expected HTTP status code to be 2xx (success) but got " + statusCode);
    }

    @Then("response:")
    public void then_response(DataTable dataTable) throws Exception {
        // 驗證 HTTP Status Code 是否為 2xx (成功)
        int statusCode = scenarioContext.getLastResponse().getResponse().getStatus();
        assertTrue(statusCode >= 200 && statusCode < 300, 
            "預期 HTTP 狀態碼應為 2xx (成功)，但實際為 " + statusCode);
        
        // 取得 response body 作為 JSON
        String responseBody = scenarioContext.getLastResponse().getResponse().getContentAsString();
        DocumentContext jsonContext = JsonPath.parse(responseBody);
        
        // 取得 DataTable 的所有欄位名稱和值
        List<Map<String, String>> rows = dataTable.asMaps();
        
        // 針對 DataTable 中的每一行進行驗證
        for (Map<String, String> row : rows) {
            for (Map.Entry<String, String> entry : row.entrySet()) {
                String jsonPath = "$." + entry.getKey();
                String expectedValue = entry.getValue();
                
                try {
                    Object actualValue = jsonContext.read(jsonPath);
                    
                    // 根據預期值的類型進行適當的轉換和比較
                    if (expectedValue.equals("true") || expectedValue.equals("false")) {
                        // 布林值比較
                        boolean expected = Boolean.parseBoolean(expectedValue);
                        assertEquals(expected, Boolean.parseBoolean(actualValue.toString()),
                            "JSON 路徑 '" + entry.getKey() + "' 的值不符合預期。預期: " + expected + ", 實際: " + actualValue);
                    } else if (expectedValue.matches("-?\\d+")) {
                        // 整數比較
                        int expected = Integer.parseInt(expectedValue);
                        assertEquals(expected, Integer.parseInt(actualValue.toString()),
                            "JSON 路徑 '" + entry.getKey() + "' 的值不符合預期。預期: " + expected + ", 實際: " + actualValue);
                    } else if (expectedValue.matches("-?\\d+\\.\\d+")) {
                        // 浮點數比較
                        double expected = Double.parseDouble(expectedValue);
                        assertEquals(expected, Double.parseDouble(actualValue.toString()),
                            "JSON 路徑 '" + entry.getKey() + "' 的值不符合預期。預期: " + expected + ", 實際: " + actualValue);
                    } else {
                        // 字串比較
                        assertEquals(expectedValue, actualValue.toString(),
                            "JSON 路徑 '" + entry.getKey() + "' 的值不符合預期。預期: " + expectedValue + ", 實際: " + actualValue);
                    }
                } catch (PathNotFoundException e) {
                    fail("在 JSON 回應中找不到路徑 '" + entry.getKey() + "'");
                }
            }
        }
    }

} 