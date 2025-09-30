import { Given, When, Then, Before } from '@cucumber/cucumber';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../main/app.module';
import { PrismaService } from '../../main/prisma/prisma.service';
import { expect } from 'expect';

let app: INestApplication;
let prisma: PrismaService;
let lastResponse: request.Response;
let lastError: Error;

// 共用的 context 變數
let currentGameId: string;
let currentPlayerRole: string;
let currentSecret: string;

// 共用的執行方法
async function executeSetSecretCommand(gameId: string, playerRole: string, secret: string) {
    return request(app.getHttpServer())
        .put(`/games/${gameId}/secret`)
        .send({ playerRole, secret })
        .set('Accept', 'application/json');
}

async function executeUpdateSecretCommand(gameId: string, playerRole: string, secret: string) {
    return request(app.getHttpServer())
        .patch(`/games/${gameId}/secret`)
        .send({ playerRole, secret })
        .set('Accept', 'application/json');
}

async function executeGuessCommand(gameId: string, playerRole: string, guess: string) {
    return request(app.getHttpServer())
        .post(`/games/${gameId}/guess`)
        .send({ playerRole, guess })
        .set('Accept', 'application/json');
}

Before(async () => {
    const moduleRef = await Test.createTestingModule({
        imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get<PrismaService>(PrismaService);
    await app.init();

    // 清理資料庫
    await prisma.player.deleteMany();
    await prisma.game.deleteMany();

    // 重置測試變數
    currentGameId = '';
    currentPlayerRole = '';
    currentSecret = '';
    lastResponse = null;
    lastError = null;
});

// Given Steps
Given('遊戲 {string} 處於 {string} 狀態，包含玩家:', async function (gameId: string, gameStatus: string, dataTable: any) {
    currentGameId = gameId;
    const players = dataTable.hashes();
    
    // 建立遊戲和玩家資料
    await prisma.game.create({
        data: {
            id: gameId,
            status: gameStatus,
            players: {
                create: players.map((player: any) => ({
                    role: player.id,
                    name: player.name,
                    secret: player.secret || null,
                    hasChangedSecret: false
                }))
            }
        }
    });
});

Given('玩家 {string} 已設定祕密數字 {int}', async function (playerRole: string, secret: number) {
    await prisma.player.update({
        where: {
            gameId_role: {
                gameId: currentGameId,
                role: playerRole
            }
        },
        data: {
            secret: secret.toString(),
            hasChangedSecret: false
        }
    });
});

Given('玩家 {string} 已經變更過一次祕密數字', async function (playerRole: string) {
    await prisma.player.update({
        where: {
            gameId_role: {
                gameId: currentGameId,
                role: playerRole
            }
        },
        data: {
            hasChangedSecret: true
        }
    });
});

// When Steps
When('玩家 {string} 設定秘密數字 {string}', async function (playerRole: string, secret: string) {
    try {
        currentPlayerRole = playerRole;
        currentSecret = secret;
        lastResponse = await executeSetSecretCommand(currentGameId, playerRole, secret);
    } catch (error) {
        lastError = error;
    }
});

When('玩家 {string} 更改秘密數字 {string}', async function (playerRole: string, secret: string) {
    try {
        currentPlayerRole = playerRole;
        currentSecret = secret;
        lastResponse = await executeUpdateSecretCommand(currentGameId, playerRole, secret);
    } catch (error) {
        lastError = error;
    }
});

When('玩家 {string} 猜測數字 {string}', async function (playerRole: string, guess: string) {
    try {
        currentPlayerRole = playerRole;
        currentSecret = guess;
        lastResponse = await executeGuessCommand(currentGameId, playerRole, guess);
    } catch (error) {
        lastError = error;
    }
});

// Then Steps
Then('遊戲 {string} 應該保持在 {string} 狀態', async function (gameId: string, expectedStatus: string) {
    const game = await prisma.game.findUnique({
        where: { id: gameId }
    });
    expect(game.status).toBe(expectedStatus === 'Setting secret' ? '設定秘密數字階段' : expectedStatus);
});

Then('遊戲 {string} 應該進入 {string} 狀態', async function (gameId: string, expectedStatus: string) {
    const game = await prisma.game.findUnique({
        where: { id: gameId }
    });
    expect(game.status).toBe(expectedStatus);
});

Then('祕密數字應該為:', async function (dataTable: any) {
    const expectedSecrets = dataTable.hashes();
    
    for (const expected of expectedSecrets) {
        const player = await prisma.player.findUnique({
            where: {
                gameId_role: {
                    gameId: currentGameId,
                    role: expected.id
                }
            }
        });
        
        if (expected.secret) {
            expect(player.secret).toBe(expected.secret);
        } else {
            expect(player.secret).toBeNull();
        }
    }
});

Then('請求應該失敗，原因為 {string}', function (expectedError: string) {
    expect(lastResponse.status).toBe(400);
    expect(lastResponse.body.message).toBe(expectedError);
});

Then('結果應該為 {int}A{int}B', function (a: number, b: number) {
    expect(lastResponse.body.a).toBe(a);
    expect(lastResponse.body.b).toBe(b);
});

Then('遊戲 {string} 應該結束，獲勝者為 {string}', async function (gameId: string, winner: string) {
    const game = await prisma.game.findUnique({
        where: { id: gameId }
    });
    expect(game.status).toBe('已結束');
    expect(game.winner).toBe(winner);
});

Then('遊戲 {string} 應該處於 猜數字階段 狀態', async function (gameId: string) {
    const game = await prisma.game.findUnique({
        where: { id: gameId }
    });
    expect(game.status).toBe('猜數字階段');
});

Then('遊戲 {string} 應該處於 已結束 狀態', async function (gameId: string) {
    const game = await prisma.game.findUnique({
        where: { id: gameId }
    });
    expect(game.status).toBe('已結束');
});