import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Greeting } from './entities/greeting.entity';
import { BadRequestException } from '../exceptions/bad-request.exception';
import { RateLimitExceededException } from '../exceptions/rate-limit-exceeded.exception';

@Injectable()
export class GreetingService {
  private readonly logger = new Logger(GreetingService.name);
  private static readonly MAX_GREETINGS_PER_MINUTE = 2;

  constructor(
    @InjectRepository(Greeting)
    private readonly greetingRepository: Repository<Greeting>,
  ) {}

  async greet(name: string): Promise<string> {
    // Check rate limit - count greetings in the last minute
    const oneMinuteAgo = new Date(Date.now() - 60000);
    const greetingCount = await this.greetingRepository.count({
      where: {
        createdAt: MoreThan(oneMinuteAgo),
      },
    });

    this.logger.log(`Current greeting count in last minute: ${greetingCount}`);

    if (greetingCount >= GreetingService.MAX_GREETINGS_PER_MINUTE) {
      this.logger.warn(`Rate limit exceeded. Current count: ${greetingCount}, Max allowed: ${GreetingService.MAX_GREETINGS_PER_MINUTE}`);
      throw new RateLimitExceededException('Rate limit exceeded');
    }

    const message = `Hello world, ${name}.`;
    const greeting = new Greeting(uuidv4(), message, name, new Date());
    await this.greetingRepository.save(greeting);

    this.logger.log(`Greeting created successfully for name: ${name}`);
    return message;
  }

  async deleteGreetingByContent(content: string): Promise<void> {
    this.logger.log(`Attempting to delete greeting with content: ${content}`);

    // Find the greeting by content
    const greeting = await this.greetingRepository.findOne({
      where: { content },
    });

    if (!greeting) {
      this.logger.warn(`Greeting with content '${content}' not found`);
      throw new BadRequestException(`Greeting with content '${content}' not found`);
    }

    // Delete the greeting
    await this.greetingRepository.remove(greeting);
    this.logger.log(`Greeting with content '${content}' deleted successfully`);
  }
}