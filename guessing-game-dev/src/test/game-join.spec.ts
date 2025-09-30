import { Test, TestingModule } from '@nestjs/testing';
import { describe, it, beforeEach } from '@jest/globals';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';

describe('遊戲加入功能 (Game Join Feature)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });
  // 測試規則 1：玩家輸入一組 3-5 位字母或數字組成的「遊戲 ID」，和自己的名稱（3~10字元）點擊「開始遊戲」進行配對。
  it('應該允許玩家使用有效的遊戲ID和名稱加入遊戲', async () => {
    // When
    const gameId = 'game1';  // 3-5位字母或數字
    const playerName = 'player1';  // 3-10字元
    
    const response = await request(app.getHttpServer())
      .post('/games')
      .send({ gameId, playerName })
      .expect(200);

    // Then
    expect(response.body).toEqual({
      gameId: gameId,
      playerRole: 'P1'  // 因為是新遊戲，所以應該是 P1
    });
  });

  // 測試規則 2：若系統中尚無此 ID，則視為創建新遊戲，該玩家將成為該場遊戲的 P1
  /*
  it('當使用新的遊戲ID時，應該創建新遊戲並將玩家設為P1', () => {
    // TODO: 實作測試內容
  });
  */

  // 測試規則 3：若該 ID 已存在且遊戲尚未進入猜題階段，則玩家加入為 P2
  /*
  it('當加入已存在且未開始的遊戲時，應該將玩家設為P2', () => {
    // TODO: 實作測試內容
  });
  */

  // 測試規則 4：若該遊戲已經有兩位玩家，則顯示「該遊戲已滿，請選擇其他遊戲」
  /*
  it('當遊戲已有兩位玩家時，應該拒絕新玩家加入並顯示適當訊息', () => {
    // TODO: 實作測試內容
  });
  */

  // 測試規則 5：同一玩家不得重複加入同一場遊戲
  /*
  it('應該防止同一玩家重複加入同一場遊戲', () => {
    // TODO: 實作測試內容
  });
  */
});
