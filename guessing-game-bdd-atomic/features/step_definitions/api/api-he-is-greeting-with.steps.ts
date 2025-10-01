import { When } from '@cucumber/cucumber';
import { DataTable } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import * as request from 'supertest';

When('he is greeting, with:', async function(this: CustomWorld, dataTable: DataTable) {
  const app = this.getApp();
  
  // 1. Extract data from DataTable
  const data = dataTable.hashes()[0];
  const name = data.name;

  // 2. Call the API according to the API spec
  const response = await request(app.getHttpServer())
    .get('/greeting')
    .query({ name })
    .set('Content-Type', 'application/json')
    .expect(200);

  // 3. Store the response in the ScenarioContext
  this.scenarioContext.setLastResponse(response);
});
