import { Given } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { Repository } from 'typeorm';
import { Greeting } from '../../../src/greeting/entities/greeting.entity';

Given('there is no greeting record', async function(this: CustomWorld) {
  const app = this.getApp();
  const greetingRepository = app.get<Repository<Greeting>>('GreetingRepository');
  
  // 清空所有問候記錄
  await greetingRepository.clear();
});
