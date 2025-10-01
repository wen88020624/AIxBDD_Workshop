import { Then } from '@cucumber/cucumber';
import { DataTable } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { Repository } from 'typeorm';
import { Greeting } from '../../../src/greeting/entities/greeting.entity';
import { strict as assert } from 'assert';

Then('a greeting record:', async function(this: CustomWorld, dataTable: DataTable) {
  const app = this.getApp();
  const greetingRepository = app.get<Repository<Greeting>>('GreetingRepository');

  // 獲取 DataTable 的所有欄位名稱和值
  const rows = dataTable.hashes();
  
  // 假設我們只驗證第一行
  const row = rows[0];
  
  // 檢查是否有 content 欄位
  if ('content' in row) {
    const expectedContent = row.content;
    
    // 從資料庫中查找最新的問候記錄
    const latestGreeting = await greetingRepository.findOne({
      order: { id: 'DESC' }
    });
    
    // 驗證記錄存在且內容符合預期
    assert(latestGreeting, '找不到問候記錄');
    assert.equal(latestGreeting.content, expectedContent,
      `問候記錄的內容不符合預期。預期: ${expectedContent}, 實際: ${latestGreeting.content}`);
  }
});
