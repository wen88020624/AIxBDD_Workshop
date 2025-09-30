package tw.waterballsa.bddworkshop.stepdefs.hooks;

import io.cucumber.java.Before;
import org.springframework.beans.factory.annotation.Autowired;
import tw.waterballsa.bddworkshop.repository.GreetingRepository;

public class DatabaseCleanupHooks {

    @Autowired
    private GreetingRepository greetingRepository;
    

    @Before
    public void cleanupAllData() {
        // Clean up all repository data before each scenario, regardless of feature or tag
        greetingRepository.deleteAll();
    }
} 