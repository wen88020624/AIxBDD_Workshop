package tw.waterballsa.bddworkshop.stepdefs.given;

import io.cucumber.java.en.Given;
import org.springframework.beans.factory.annotation.Autowired;
import tw.waterballsa.bddworkshop.repository.GreetingRepository;

public class Given_There_Is_No_Greeting_Record {

    @Autowired
    private GreetingRepository greetingRepository;

    @Given("there is no greeting record")
    public void given_there_is_no_greeting_record() {
        // 清空所有問候記錄
        greetingRepository.deleteAll();
    }
}