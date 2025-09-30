import { Module } from '@nestjs/common';
import { HelloWorldModule } from './main/example/hello-world.module';

@Module({
  imports: [HelloWorldModule],
})
export class AppModule {}