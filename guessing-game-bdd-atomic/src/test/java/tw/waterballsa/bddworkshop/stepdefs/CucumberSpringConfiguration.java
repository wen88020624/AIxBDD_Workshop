package tw.waterballsa.bddworkshop.stepdefs;

import io.cucumber.spring.CucumberContextConfiguration;
import tw.waterballsa.bddworkshop.Application;

import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;

@CucumberContextConfiguration
@SpringBootTest(classes = Application.class)
@AutoConfigureMockMvc
public class CucumberSpringConfiguration {
    // This class doesn't need any beans defined within it for now.
    // Its purpose is to configure the Spring context for Cucumber tests.
} 