package tw.waterballsa.bddworkshop.stepdefs.api;

import io.cucumber.datatable.DataTable;
import io.cucumber.java.en.When;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import tw.waterballsa.bddworkshop.stepdefs.ScenarioContext;

import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;

public class API_He_Is_Greeting_With {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ScenarioContext scenarioContext;

    @When("he is greeting, with:")
    public void invoke(DataTable dataTable) throws Exception {
        // 1. Extract data from DataTable
        Map<String, String> data = dataTable.asMaps().get(0);
        String name = data.get("name");

        // 2. Call the API according to the API spec
        MvcResult result = mockMvc.perform(get("/greeting")
                .param("name", name)
                .contentType(MediaType.APPLICATION_JSON))
                .andReturn();

        // 3. Store the response in the ScenarioContext
        scenarioContext.setLastResponse(result);
    }
}