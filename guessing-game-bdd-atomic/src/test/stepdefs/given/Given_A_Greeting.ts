import { Given } from '@cucumber/cucumber';
import { DataTable } from '@cucumber/cucumber';
import { INestApplication } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Greeting } from '../../../main/greeting/entities/greeting.entity';

export class Given_A_Greeting {
    constructor(
        private readonly app: INestApplication
    ) {}

    @Given('a greeting, with:')
    public async invoke(dataTable: DataTable): Promise<void> {
        const greetingRepository = this.app.get<Repository<Greeting>>('GreetingRepository');
        const rows = dataTable.hashes();

        for (const row of rows) {
            const { id, content, name, createdAt: createdAtStr } = row;

            // Handle special <now_ts> placeholder
            let createdAt: Date;
            if (createdAtStr === '<now_ts>') {
                createdAt = new Date();
            } else {
                // Parse the timestamp string if it's not the placeholder
                createdAt = new Date(createdAtStr);
            }

            const greeting = new Greeting(id, content, name, createdAt);
            await greetingRepository.save(greeting);
        }
    }
}
