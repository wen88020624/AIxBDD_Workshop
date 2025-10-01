import { When } from '@cucumber/cucumber';
import { DataTable } from '@cucumber/cucumber';
import * as request from 'supertest';
import { ScenarioContext } from '../ScenarioContext';
import { INestApplication } from '@nestjs/common';

export class API_He_Is_Greeting_With {
    constructor(
        private readonly app: INestApplication,
        private readonly scenarioContext: ScenarioContext
    ) {}

    @When('he is greeting, with:')
    public async invoke(dataTable: DataTable): Promise<void> {
        // 1. Extract data from DataTable
        const data = dataTable.hashes()[0];
        const name = data.name;

        // 2. Call the API according to the API spec
        const response = await request(this.app.getHttpServer())
            .get('/greeting')
            .query({ name })
            .set('Content-Type', 'application/json')
            .expect(200);

        // 3. Store the response in the ScenarioContext
        this.scenarioContext.setLastResponse(response);
    }
}
