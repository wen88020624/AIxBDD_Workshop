package tw.waterballsa.bddworkshop.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import tw.waterballsa.bddworkshop.service.GreetingService;
import tw.waterballsa.bddworkshop.exceptions.BadRequestException;

import jakarta.validation.constraints.NotBlank;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/greeting")
@Validated
public class GreetingController {
    @Autowired
    private GreetingService greetingService;

    @GetMapping
    public ResponseEntity<Map<String, String>> greet(@RequestParam("name") @NotBlank String name) {
        if (name == null || name.trim().isEmpty()) {
            throw new BadRequestException("Name cannot be blank");
        }
        String message = greetingService.greet(name);
        Map<String, String> response = new HashMap<>();
        response.put("message", message);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteGreeting(@RequestParam("content") @NotBlank String content) {
        if (content == null || content.trim().isEmpty()) {
            throw new BadRequestException("Content cannot be blank");
        }
        greetingService.deleteGreetingByContent(content);
        return ResponseEntity.ok().build();
    }
}