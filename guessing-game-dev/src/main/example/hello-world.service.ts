import { Injectable } from '@nestjs/common';
import { HelloWorldRepository } from './hello-world.repository';
import { HelloWorld } from './hello-world.entity';

@Injectable()
export class HelloWorldService {
  constructor(private readonly repository: HelloWorldRepository) {}

  async greet(name: string): Promise<string> {
    const greeting = new HelloWorld();
    greeting.name = name;
    greeting.message = `Hello world '${name}'!`;
    
    await this.repository.save(greeting);
    return greeting.message;
  }
}
