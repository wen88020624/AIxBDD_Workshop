import { Given } from '@cucumber/cucumber';
import { DataTable } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { Repository } from 'typeorm';
import { Greeting } from '../../../src/greeting/entities/greeting.entity';

Given('a greeting, with:', async function(this: CustomWorld, dataTable: DataTable) {
  const app = this.getApp();
  const greetingRepository = app.get<Repository<Greeting>>('GreetingRepository');

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
});
