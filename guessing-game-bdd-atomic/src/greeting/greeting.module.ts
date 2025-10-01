import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GreetingController } from './greeting.controller';
import { GreetingService } from './greeting.service';
import { Greeting } from './entities/greeting.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Greeting])],
  controllers: [GreetingController],
  providers: [GreetingService],
  exports: [GreetingService],
})
export class GreetingModule {}