import { Controller, Get, Query } from '@nestjs/common';
import { HelloWorldService } from './hello-world.service';

@Controller('api/hello')
export class HelloWorldController {
  constructor(private readonly helloWorldService: HelloWorldService) {}

  @Get()
  async greet(@Query('name') name: string): Promise<string> {
    return this.helloWorldService.greet(name);
  }
}
