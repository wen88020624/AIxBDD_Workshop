import { Then } from '@cucumber/cucumber';
import { DataTable } from '@cucumber/cucumber';
import { INestApplication } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Greeting } from '../../../main/greeting/entities/greeting.entity';
import { strict as assert } from 'assert';

export class Then_The_Greeting_Record_Should_Be {
    constructor(
        private readonly app: INestApplication
    ) {}

    @Then('the greeting record should be:')
    public async validate(dataTable: DataTable): Promise<void> {
        const greetingRepository = this.app.get<Repository<Greeting>>('GreetingRepository');

        // 從 DataTable 獲取預期的資料
        const rows = dataTable.hashes();
        const expectedData = rows[0];  // 取得第一行資料

        // 使用 content 來查詢 greeting 實體
        const expectedContent = expectedData.content;
        const greeting = await greetingRepository.findOne({
            where: { content: expectedContent }
        });

        // 驗證 greeting 實體存在
        assert(greeting, `Greeting with content '${expectedContent}' should exist`);

        // 驗證 Greeting 的各項屬性
        assert.equal(greeting.content, expectedContent, 'Content should match');

        // 如果有其他屬性需要驗證，可以在這裡添加更多的斷言
    }
}
