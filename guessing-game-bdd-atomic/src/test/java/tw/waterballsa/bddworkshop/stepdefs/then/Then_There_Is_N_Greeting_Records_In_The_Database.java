package tw.waterballsa.bddworkshop.stepdefs.then;

import io.cucumber.java.en.Then;
import org.springframework.beans.factory.annotation.Autowired;
import tw.waterballsa.bddworkshop.entity.Greeting;
import tw.waterballsa.bddworkshop.repository.GreetingRepository;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class Then_There_Is_N_Greeting_Records_In_The_Database {

    @Autowired
    private GreetingRepository greetingRepository;

    @Then("there is {int} greeting records in the database")
    public void validate(int expectedCount) {
        // Count all greeting records in the database
        long actualCount = 0;
        Iterable<Greeting> greetings = greetingRepository.findAll();
        
        // Count the number of greetings
        for (Greeting greeting : greetings) {
            actualCount++;
        }
        
        // Validate that the count matches the expected count
        assertEquals(expectedCount, actualCount, 
            "The number of greeting records in the database does not match the expected count");
    }
}