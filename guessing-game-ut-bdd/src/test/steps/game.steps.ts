import { Before, After, Given, When, Then, DataTable } from '@cucumber/cucumber';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import supertest from 'supertest';
import { AppModule } from '../../main/app.module';
import assert from 'assert';
import { GameStatus, PlayerRole } from '../../main/game/game.enum';

let app: INestApplication;
let lastResponse: supertest.Response;
let lastError: Error;
let currentGameId: string;

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
  if (app) {
    await app.close();
  }
});

Given('遊戲 {string} 處於 {string} 狀態，包含玩家:', async function (gameId: string, status: string, dataTable: DataTable) {
  currentGameId = gameId;
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

  // 如果玩家有預設的秘密數字，設定它們
  for (const player of players) {
    if (player.secret) {
      await supertest(app.getHttpServer())
        .put(`/games/${gameId}/secret`)
        .send({ playerRole: player.id, secret: player.secret })
        .set('Accept', 'application/json');
    }
  }
});

Given('玩家 {string} 已設定祕密數字 {int}', async function (playerRole: string, secret: number) {
  lastResponse = await supertest(app.getHttpServer())
    .put(`/games/${currentGameId}/secret`)
    .send({ playerRole, secret: secret.toString().padStart(4, '0') })
    .set('Accept', 'application/json');

  assert.strictEqual(lastResponse.status, 204);
});

Given('玩家 {string} 已經變更過一次祕密數字', async function (playerRole: string) {
  // 這個狀態已經在資料庫中記錄，不需要額外操作
});

Given('遊戲 {string} 已被玩家 {string} 創建', async function (gameId: string, playerName: string) {
  currentGameId = gameId;
  lastResponse = await supertest(app.getHttpServer())
    .post('/games')
    .send({ gameId, playerName })
    .set('Accept', 'application/json');
  
  assert.strictEqual(lastResponse.status, 200);
});

Given('遊戲 {string} 已包含玩家:', async function (gameId: string, dataTable: DataTable) {
  currentGameId = gameId;
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

When('玩家 {string} 設定秘密數字 {string}', async function (playerRole: string, secret: string) {
  try {
    lastResponse = await supertest(app.getHttpServer())
      .put(`/games/${currentGameId}/secret`)
      .send({ playerRole, secret })
      .set('Accept', 'application/json');
  } catch (error) {
    lastError = error;
  }
});

When('玩家 {string} 更改秘密數字 {string}', async function (playerRole: string, secret: string) {
  try {
    lastResponse = await supertest(app.getHttpServer())
      .patch(`/games/${currentGameId}/secret`)
      .send({ playerRole, secret })
      .set('Accept', 'application/json');
  } catch (error) {
    lastError = error;
  }
});

When('玩家 {string} 猜測數字 {string}', async function (playerRole: string, guess: string) {
  try {
    lastResponse = await supertest(app.getHttpServer())
      .post(`/games/${currentGameId}/guess`)
      .send({ playerRole, guess })
      .set('Accept', 'application/json');
  } catch (error) {
    lastError = error;
  }
});

Then('遊戲 {string} 應該保持在 {string} 狀態', async function (gameId: string, status: string) {
  await checkGameStatus(gameId, status);
});

Then('遊戲 {string} 應該進入 {string} 狀態', async function (gameId: string, status: string) {
  await checkGameStatus(gameId, status);
});

Then('遊戲 {string} 應該處於 {string} 狀態', async function (gameId: string, status: string) {
  await checkGameStatus(gameId, status);
});

async function checkGameStatus(gameId: string, status: string) {
  const response = await supertest(app.getHttpServer())
    .get(`/games/${gameId}/status`)
    .set('Accept', 'application/json');
  
  assert.strictEqual(response.status, 200);
  assert.strictEqual(response.body.status, status);
}

Then('祕密數字應該為:', async function (dataTable: DataTable) {
  const expectedSecrets = dataTable.hashes();
  const response = await supertest(app.getHttpServer())
    .get(`/games/${currentGameId}/secrets`)
    .set('Accept', 'application/json');
  
  assert.strictEqual(response.status, 200);
  const actualSecrets = response.body.secrets;
  
  expectedSecrets.forEach(expected => {
    const actual = actualSecrets.find(s => s.id === expected.id);
    if (expected.secret) {
      assert.strictEqual(actual.secret, expected.secret);
    } else {
      assert.strictEqual(actual.secret, '');
    }
  });
});

Then('請求應該失敗，原因為 {string}', function (reason: string) {
  assert.strictEqual(lastResponse.status, 400);
  assert.strictEqual(lastResponse.body.error, reason);
});

Then('結果應該為 {string}', function (result: string) {
  assert.strictEqual(lastResponse.status, 200);
  const [a, b] = result.split('A');
  assert.strictEqual(lastResponse.body.result.a, parseInt(a));
  assert.strictEqual(lastResponse.body.result.b, parseInt(b.replace('B', '')));
});

Then('遊戲 {string} 應該被創建', async function (gameId: string) {
  assert.strictEqual(lastResponse.status, 200);
  assert.strictEqual(lastResponse.body.gameId, gameId);
});

Then('遊戲應該包含玩家:', async function (dataTable: DataTable) {
  const expectedPlayers = dataTable.hashes();
  const response = await supertest(app.getHttpServer())
    .get(`/games/${currentGameId}/players`)
    .set('Accept', 'application/json');
  
  assert.strictEqual(response.status, 200);
  const actualPlayers = response.body.players;
  assert.strictEqual(actualPlayers.length, expectedPlayers.length);
  expectedPlayers.forEach(expectedPlayer => {
    assert(actualPlayers.some(player => player.name === expectedPlayer.name));
  });
});

Then('請求應該失敗', function () {
  assert.strictEqual(lastResponse.status, 400);
});