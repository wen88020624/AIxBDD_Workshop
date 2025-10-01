import { Controller, Get, Delete, Query, UseFilters, ValidationPipe } from '@nestjs/common';
import { GreetingService } from './greeting.service';
import { GlobalExceptionFilter } from '../filters/global-exception.filter';
import { IsNotEmpty } from 'class-validator';

class GreetingDto {
  @IsNotEmpty()
  name: string;
}

class DeleteGreetingDto {
  @IsNotEmpty()
  content: string;
}

@Controller('greeting')
@UseFilters(GlobalExceptionFilter)
export class GreetingController {
  constructor(private readonly greetingService: GreetingService) {}

  @Get()
  async greet(@Query(ValidationPipe) query: GreetingDto) {
    const message = await this.greetingService.greet(query.name);
    return { message };
  }

  @Delete()
  async deleteGreeting(@Query(ValidationPipe) query: DeleteGreetingDto) {
    await this.greetingService.deleteGreetingByContent(query.content);
  }
}