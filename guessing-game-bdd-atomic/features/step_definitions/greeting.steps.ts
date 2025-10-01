import { Given, When, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';
import * as request from 'supertest';
import { GreetingService } from '../../src/greeting/greeting.service';

Given('there is no greeting record', async function(this: CustomWorld) {
  const app = this.getApp();
  const greetingService = app.get(GreetingService);
  await greetingService.deleteGreetingByContent('*');
});

When('he is greeting with {string}', async function(this: CustomWorld, name: string) {
  const app = this.getApp();
  const response = await request(app.getHttpServer())
    .get('/greeting')
    .query({ name })
    .expect(200);
  
  this.scenarioContext.setLastResponse(response);
});

Then('the greeting record should be {string}', async function(this: CustomWorld, expectedMessage: string) {
  const response = this.scenarioContext.getLastResponse();
  if (response.body.message !== expectedMessage) {
    throw new Error(`Expected message to be "${expectedMessage}" but got "${response.body.message}"`);
  }
});