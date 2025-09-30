package tw.waterballsa.bddworkshop.exceptions;

/**
 * 速率限制超出例外
 * 當使用者在指定時間內超出允許的請求次數時拋出
 */
public class RateLimitExceededException extends RuntimeException {
    public RateLimitExceededException(String message) {
        super(message);
    }
}