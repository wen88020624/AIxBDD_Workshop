package tw.waterballsa.bddworkshop.stepdefs;

import org.springframework.stereotype.Component;
import org.springframework.test.web.servlet.MvcResult;

import java.util.HashMap;
import java.util.Map;

@Component
public class ScenarioContext {
    
    private MvcResult lastResponse;
    private Map<String, Object> contextData = new HashMap<>();
    
    public MvcResult getLastResponse() {
        return lastResponse;
    }
    
    public void setLastResponse(MvcResult lastResponse) {
        this.lastResponse = lastResponse;
    }
    
    public void clear() {
        this.lastResponse = null;
    }
    
    public void reset() {
        this.lastResponse = null;
        this.contextData.clear();
    }
    
    public void put(String key, String value) {
        contextData.put(key, value);
    }
    
    public Object get(String key) {
        return contextData.get(key);
    }
} 