import { Then } from '@cucumber/cucumber';
import { DataTable } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';
import { strict as assert } from 'assert';
import * as jsonpath from 'jsonpath';

Then('the request fails', function(this: CustomWorld) {
  const response = this.scenarioContext.getLastResponse();
  const statusCode = response.status;
  assert(statusCode >= 400 && statusCode < 500,
    `Expected HTTP status code to be 4xx (client error) but got ${statusCode}`);
});

Then('the request fails, due to {string}', function(this: CustomWorld, reason: string) {
  const response = this.scenarioContext.getLastResponse();
  const statusCode = response.status;
  assert(statusCode >= 400 && statusCode < 500,
    `Expected HTTP status code to be 4xx (client error) but got ${statusCode}. Reason: ${reason}`);
});

Then('request succeeds', function(this: CustomWorld) {
  const response = this.scenarioContext.getLastResponse();
  const statusCode = response.status;
  assert(statusCode >= 200 && statusCode < 300,
    `Expected HTTP status code to be 2xx (success) but got ${statusCode}`);
});

Then('succeeded', function(this: CustomWorld) {
  const response = this.scenarioContext.getLastResponse();
  const statusCode = response.status;
  assert(statusCode >= 200 && statusCode < 300,
    `Expected HTTP status code to be 2xx (success) but got ${statusCode}`);
});

Then('response:', function(this: CustomWorld, dataTable: DataTable) {
  const response = this.scenarioContext.getLastResponse();
  const statusCode = response.status;
  assert(statusCode >= 200 && statusCode < 300,
    `預期 HTTP 狀態碼應為 2xx (成功)，但實際為 ${statusCode}`);
  
  // 取得 response body 作為 JSON
  const responseBody = response.body;
  
  // 取得 DataTable 的所有欄位名稱和值
  const rows = dataTable.hashes();
  
  // 針對 DataTable 中的每一行進行驗證
  for (const row of rows) {
    for (const [key, expectedValue] of Object.entries(row)) {
      const jsonPath = `$.${key}`;
      
      try {
        const actualValue = jsonpath.query(responseBody, jsonPath)[0];
        assert(actualValue !== undefined, `在 JSON 回應中找不到路徑 '${key}'`);
        
        // 根據預期值的類型進行適當的轉換和比較
        if (expectedValue === 'true' || expectedValue === 'false') {
          // 布林值比較
          const expected = expectedValue === 'true';
          assert.equal(Boolean(actualValue), expected,
            `JSON 路徑 '${key}' 的值不符合預期。預期: ${expected}, 實際: ${actualValue}`);
        } else if (/^-?\d+$/.test(expectedValue)) {
          // 整數比較
          const expected = parseInt(expectedValue, 10);
          assert.equal(parseInt(actualValue.toString(), 10), expected,
            `JSON 路徑 '${key}' 的值不符合預期。預期: ${expected}, 實際: ${actualValue}`);
        } else if (/^-?\d+\.\d+$/.test(expectedValue)) {
          // 浮點數比較
          const expected = parseFloat(expectedValue);
          assert.equal(parseFloat(actualValue.toString()), expected,
            `JSON 路徑 '${key}' 的值不符合預期。預期: ${expected}, 實際: ${actualValue}`);
        } else {
          // 字串比較
          assert.equal(actualValue.toString(), expectedValue,
            `JSON 路徑 '${key}' 的值不符合預期。預期: ${expectedValue}, 實際: ${actualValue}`);
        }
      } catch (error) {
        if (error.message.includes('Cannot read property')) {
          assert.fail(`在 JSON 回應中找不到路徑 '${key}'`);
        }
        throw error;
      }
    }
  }
});
