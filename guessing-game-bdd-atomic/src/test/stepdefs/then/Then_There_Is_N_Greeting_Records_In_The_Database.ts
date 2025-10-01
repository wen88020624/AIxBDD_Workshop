import { Then } from '@cucumber/cucumber';
import { INestApplication } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Greeting } from '../../../main/greeting/entities/greeting.entity';
import { strict as assert } from 'assert';

export class Then_There_Is_N_Greeting_Records_In_The_Database {
    constructor(
        private readonly app: INestApplication
    ) {}

    @Then('there is {int} greeting records in the database')
    public async validate(expectedCount: number): Promise<void> {
        const greetingRepository = this.app.get<Repository<Greeting>>('GreetingRepository');

        // Count all greeting records in the database
        const actualCount = await greetingRepository.count();

        // Validate that the count matches the expected count
        assert.equal(actualCount, expectedCount,
            `The number of greeting records in the database does not match the expected count. Expected: ${expectedCount}, Actual: ${actualCount}`);
    }
}
