package tw.waterballsa.bddworkshop.stepdefs.given;

import io.cucumber.datatable.DataTable;
import io.cucumber.java.en.Given;
import org.springframework.beans.factory.annotation.Autowired;
import tw.waterballsa.bddworkshop.entity.Greeting;
import tw.waterballsa.bddworkshop.repository.GreetingRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public class Given_A_Greeting {

    @Autowired
    private GreetingRepository greetingRepository;

    @Given("a greeting, with:")
    public void invoke(DataTable dataTable) throws Exception {
        List<Map<String, String>> rows = dataTable.asMaps(String.class, String.class);
        
        for (Map<String, String> row : rows) {
            String id = row.get("id");
            String content = row.get("content");
            String name = row.get("name");
            String createdAtStr = row.get("createdAt");
            
            // Handle special <now_ts> placeholder
            LocalDateTime createdAt;
            if ("<now_ts>".equals(createdAtStr)) {
                createdAt = LocalDateTime.now();
            } else {
                // Parse the timestamp string if it's not the placeholder
                createdAt = LocalDateTime.parse(createdAtStr);
            }
            
            Greeting greeting = new Greeting(id, content, name, createdAt);
            
            greetingRepository.save(greeting);
        }
    }
}