import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Response } from 'express';
import { BadRequestException } from '../exceptions/bad-request.exception';
import { RateLimitExceededException } from '../exceptions/rate-limit-exceeded.exception';
import { ValidationError } from 'class-validator';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof BadRequestException) {
      return response.status(400).json({
        error: exception.message,
      });
    }

    if (exception instanceof RateLimitExceededException) {
      return response.status(429).json({
        error: exception.message,
      });
    }

    if (Array.isArray(exception) && exception[0] instanceof ValidationError) {
      return response.status(400).json({
        error: 'Invalid input: ' + this.formatValidationErrors(exception),
      });
    }

    if (exception instanceof HttpException) {
      return response.status(exception.getStatus()).json({
        error: exception.message,
      });
    }

    // 處理未知錯誤
    return response.status(500).json({
      error: 'Internal server error',
    });
  }

  private formatValidationErrors(errors: ValidationError[]): string {
    return errors
      .map(error => Object.values(error.constraints || {}))
      .flat()
      .join(', ');
  }
}
