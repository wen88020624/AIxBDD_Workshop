package tw.waterballsa.bddworkshop.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tw.waterballsa.bddworkshop.entity.Greeting;
import tw.waterballsa.bddworkshop.exceptions.BadRequestException;
import tw.waterballsa.bddworkshop.exceptions.RateLimitExceededException;
import tw.waterballsa.bddworkshop.repository.GreetingRepository;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class GreetingService {
    private static final Logger logger = LoggerFactory.getLogger(GreetingService.class);
    private static final int MAX_GREETINGS_PER_MINUTE = 2;
    
    @Autowired
    private GreetingRepository greetingRepository;

    public String greet(String name) {
        // Check rate limit - count greetings in the last minute
        LocalDateTime oneMinuteAgo = LocalDateTime.now().minusMinutes(1);
        long greetingCount = greetingRepository.countGreetingsSince(oneMinuteAgo);
        
        logger.info("Current greeting count in last minute: {}", greetingCount);
        
        if (greetingCount >= MAX_GREETINGS_PER_MINUTE) {
            logger.warn("Rate limit exceeded. Current count: {}, Max allowed: {}", greetingCount, MAX_GREETINGS_PER_MINUTE);
            throw new RateLimitExceededException("Rate limit exceeded");
        }
        
        String message = String.format("Hello world, %s.", name);
        Greeting greeting = new Greeting(UUID.randomUUID().toString(), message, name, LocalDateTime.now());
        greetingRepository.save(greeting);
        
        logger.info("Greeting created successfully for name: {}", name);
        return message;
    }

    public void deleteGreetingByContent(String content) {
        logger.info("Attempting to delete greeting with content: {}", content);
        
        // Find the greeting by content
        Greeting greeting = greetingRepository.findByContent(content);
        
        if (greeting == null) {
            logger.warn("Greeting with content '{}' not found", content);
            throw new BadRequestException("Greeting with content '" + content + "' not found");
        }
        
        // Delete the greeting
        greetingRepository.delete(greeting);
        logger.info("Greeting with content '{}' deleted successfully", content);
    }
}