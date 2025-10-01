import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { Repository } from 'typeorm';
import { Greeting } from '../../../src/greeting/entities/greeting.entity';
import { strict as assert } from 'assert';

Then('there is {int} greeting records in the database', async function(this: CustomWorld, expectedCount: number) {
  const app = this.getApp();
  const greetingRepository = app.get<Repository<Greeting>>('GreetingRepository');

  // Count all greeting records in the database
  const actualCount = await greetingRepository.count();
  
  // Validate that the count matches the expected count
  assert.equal(actualCount, expectedCount,
    `The number of greeting records in the database does not match the expected count. Expected: ${expectedCount}, Actual: ${actualCount}`);
});
