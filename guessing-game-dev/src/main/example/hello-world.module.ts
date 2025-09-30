import { Module } from '@nestjs/common';
import { HelloWorldController } from './hello-world.controller';
import { HelloWorldService } from './hello-world.service';
import { HelloWorldRepository } from './hello-world.repository';

@Module({
  controllers: [HelloWorldController],
  providers: [HelloWorldService, HelloWorldRepository],
})
export class HelloWorldModule {}
