import { Before } from '@cucumber/cucumber';
import { INestApplication } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Greeting } from '../../../main/greeting/entities/greeting.entity';

export class DatabaseCleanupHooks {
    constructor(
        private readonly app: INestApplication
    ) {}

    @Before()
    public async cleanupAllData(): Promise<void> {
        const greetingRepository = this.app.get<Repository<Greeting>>('GreetingRepository');
        // Clean up all repository data before each scenario, regardless of feature or tag
        await greetingRepository.clear();
    }
}
