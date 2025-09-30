import { Before, After, Given, When, Then, DataTable } from '@cucumber/cucumber';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import supertest from 'supertest';
import { AppModule } from '../../main/app.module';
import assert from 'assert';

let app: INestApplication;
let lastResponse: supertest.Response;
let lastError: Error;

// 在每個 scenario 開始前初始化應用程式
Before(async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = moduleFixture.createNestApplication();
  await app.init();
});

// 在每個 scenario 結束後關閉應用程式
After(async () => {
  await app.close();
});

Given('遊戲 {string} 已被玩家 {string} 創建', async function (gameId: string, playerName: string) {
  lastResponse = await supertest(app.getHttpServer())
    .post('/games')
    .send({ gameId, playerName })
    .set('Accept', 'application/json');
  
  assert.strictEqual(lastResponse.status, 200);
  assert.strictEqual(lastResponse.body.gameId, gameId);
});

Given('遊戲 {string} 已包含玩家:', async function (gameId: string, dataTable: DataTable) {
  const players = dataTable.hashes();
  
  // 第一個玩家創建遊戲
  lastResponse = await supertest(app.getHttpServer())
    .post('/games')
    .send({ gameId, playerName: players[0].name })
    .set('Accept', 'application/json');
  
  assert.strictEqual(lastResponse.status, 200);
  
  // 第二個玩家加入遊戲
  if (players.length > 1) {
    lastResponse = await supertest(app.getHttpServer())
      .post('/games')
      .send({ gameId, playerName: players[1].name })
      .set('Accept', 'application/json');
    
    assert.strictEqual(lastResponse.status, 200);
  }
});

When('玩家 {string} 加入一場遊戲 {string}', async function (playerName: string, gameId: string) {
  try {
    lastResponse = await supertest(app.getHttpServer())
      .post('/games')
      .send({ gameId, playerName })
      .set('Accept', 'application/json');
  } catch (error) {
    lastError = error;
  }
});

Then('遊戲 {string} 應該被創建', async function (gameId: string) {
  assert.strictEqual(lastResponse.status, 200);
  assert.strictEqual(lastResponse.body.gameId, gameId);
});

Then('遊戲應該包含玩家:', async function (dataTable: DataTable) {
  const expectedPlayers = dataTable.hashes();
  const response = await supertest(app.getHttpServer())
    .get(`/games/${lastResponse.body.gameId}/players`)
    .set('Accept', 'application/json');
  
  assert.strictEqual(response.status, 200);
  const actualPlayers = response.body.players;
  assert.strictEqual(actualPlayers.length, expectedPlayers.length);
  expectedPlayers.forEach(expectedPlayer => {
    assert(actualPlayers.some(player => player.name === expectedPlayer.name));
  });
});

Then('遊戲 {string} 應該進入 {string} 狀態', async function (gameId: string, status: string) {
  const response = await supertest(app.getHttpServer())
    .get(`/games/${gameId}/status`)
    .set('Accept', 'application/json');
  
  assert.strictEqual(response.status, 200);
  assert.strictEqual(response.body.status, status);
});

Then('請求應該失敗', function () {
  assert.strictEqual(lastResponse.status, 400);
});