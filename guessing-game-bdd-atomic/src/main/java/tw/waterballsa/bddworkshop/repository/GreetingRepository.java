package tw.waterballsa.bddworkshop.repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import tw.waterballsa.bddworkshop.entity.Greeting;

import java.time.LocalDateTime;

@Repository
public interface GreetingRepository extends CrudRepository<Greeting, String> {
    Greeting findByContent(String content);
    
    Greeting findFirstByOrderByIdDesc();
    
    @Query("SELECT COUNT(g) FROM Greeting g WHERE g.createdAt >= :since")
    long countGreetingsSince(@Param("since") LocalDateTime since);
}