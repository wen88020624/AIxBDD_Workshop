import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * 速率限制超出例外
 * 當使用者在指定時間內超出允許的請求次數時拋出
 */
export class RateLimitExceededException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.TOO_MANY_REQUESTS);
  }
}