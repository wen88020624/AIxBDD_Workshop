import { Before } from '@cucumber/cucumber';
import { CustomWorld } from '../world';
import { Repository } from 'typeorm';
import { Greeting } from '../../../src/greeting/entities/greeting.entity';

Before(async function(this: CustomWorld) {
  const app = this.getApp();
  const greetingRepository = app.get<Repository<Greeting>>('GreetingRepository');
  
  // Clean up all repository data before each scenario, regardless of feature or tag
  await greetingRepository.clear();
});
