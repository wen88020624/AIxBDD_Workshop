package tw.waterballsa.bddworkshop.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

/**
 * 問候實體，記錄使用者的問候資訊
 */
@Entity
@Table(name = "greeting")
public class Greeting {

    @Id
    @Column(nullable = false)
    private String id;

    @NotBlank
    @Column(nullable = false)
    private String content;

    @NotBlank
    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    public Greeting() {
    }

    public Greeting(String id, String content, String name, LocalDateTime createdAt) {
        this.id = id;
        this.content = content;
        this.name = name;
        this.createdAt = createdAt;
        validateInvariants();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
        validateInvariants();
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
        validateInvariants();
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    /**
     * 驗證不變條件
     * @throws IllegalStateException 若不變條件被違反
     */
    private void validateInvariants() {
        if (name != null && name.trim().isEmpty()) {
            throw new IllegalStateException("Name cannot be empty");
        }
    }
}