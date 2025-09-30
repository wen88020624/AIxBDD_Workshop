import { Injectable } from '@nestjs/common';
import { HelloWorld } from './hello-world.entity';

@Injectable()
export class HelloWorldRepository {
  private readonly greetings: HelloWorld[] = [];

  async save(greeting: HelloWorld): Promise<HelloWorld> {
    greeting.id = this.greetings.length + 1;
    greeting.createdAt = new Date();
    this.greetings.push(greeting);
    return greeting;
  }
}
