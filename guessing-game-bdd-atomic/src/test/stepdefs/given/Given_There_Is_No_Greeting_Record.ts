import { Given } from '@cucumber/cucumber';
import { INestApplication } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Greeting } from '../../../main/greeting/entities/greeting.entity';

export class Given_There_Is_No_Greeting_Record {
    constructor(
        private readonly app: INestApplication
    ) {}

    @Given('there is no greeting record')
    public async given_there_is_no_greeting_record(): Promise<void> {
        const greetingRepository = this.app.get<Repository<Greeting>>('GreetingRepository');
        // 清空所有問候記錄
        await greetingRepository.clear();
    }
}
