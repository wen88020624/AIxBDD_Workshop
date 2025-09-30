import { Injectable, BadRequestException } from '@nestjs/common';
import { GameRepository } from './game.repository';
import { SetSecretDto } from './game.interface';
import { GameStatus, PlayerRole } from './game.enum';

@Injectable()
export class GameService {
    constructor(private gameRepository: GameRepository) {}

    async setSecret(gameId: string, dto: SetSecretDto): Promise<void> {
        const game = await this.gameRepository.findGameById(gameId);
        if (!game) {
            throw new BadRequestException('Game not found');
        }

        if (game.status !== GameStatus.SETTING_SECRET) {
            throw new BadRequestException('Game is not in secret setting phase');
        }

        const player = await this.gameRepository.findPlayerByGameIdAndRole(gameId, dto.playerRole);
        if (!player) {
            throw new BadRequestException('Player not found');
        }

        // 驗證秘密數字格式
        if (!/^\d+$/.test(dto.secret)) {
            throw new BadRequestException('contains non-numeric values');
        }

        if (!/^\d{4}$/.test(dto.secret)) {
            throw new BadRequestException('secret length is not 4 digits');
        }

        if (/(\d).*\1/.test(dto.secret)) {
            throw new BadRequestException('digits are not unique');
        }

        // P2 必須在 P1 之後設定
        if (dto.playerRole === PlayerRole.P2) {
            const p1 = await this.gameRepository.findPlayerByGameIdAndRole(gameId, PlayerRole.P1);
            if (!p1.secret) {
                throw new BadRequestException('P2 must set secret after P1');
            }
        }

        await this.gameRepository.updatePlayerSecret(gameId, dto.playerRole, dto.secret);

        // 檢查是否兩位玩家都已設定秘密數字
        const updatedGame = await this.gameRepository.findGameById(gameId);
        const allPlayersSetSecret = updatedGame.players.every(p => p.secret);
        if (allPlayersSetSecret) {
            await this.gameRepository.updateGameStatus(gameId, GameStatus.GUESSING);
        }
    }

    async updateSecret(gameId: string, dto: SetSecretDto): Promise<void> {
        // 驗證秘密數字格式
        if (!/^\d+$/.test(dto.secret)) {
            throw new BadRequestException('contains non-numeric values');
        }

        if (!/^\d{4}$/.test(dto.secret)) {
            throw new BadRequestException('secret length is not 4 digits');
        }

        if (/(\d).*\1/.test(dto.secret)) {
            throw new BadRequestException('digits are not unique');
        }

        const game = await this.gameRepository.findGameById(gameId);
        if (!game) {
            throw new BadRequestException('Game not found');
        }

        if (game.status !== GameStatus.SETTING_SECRET) {
            throw new BadRequestException('Cannot change secret after game enters guessing phase');
        }

        const player = await this.gameRepository.findPlayerByGameIdAndRole(gameId, dto.playerRole);
        if (!player) {
            throw new BadRequestException('Player not found');
        }

        if (!player.secret) {
            throw new BadRequestException('Cannot change secret before setting it first time');
        }

        if (player.hasChangedSecret) {
            throw new BadRequestException(`${dto.playerRole} has already changed secret once, cannot change again`);
        }

        await this.gameRepository.updatePlayerSecret(gameId, dto.playerRole, dto.secret);
    }

    async guess(gameId: string, playerRole: PlayerRole, guess: string): Promise<{ a: number, b: number }> {
        const game = await this.gameRepository.findGameById(gameId);
        if (!game) {
            throw new BadRequestException('Game not found');
        }

        if (game.status !== GameStatus.GUESSING) {
            throw new BadRequestException('Game is not in guessing phase');
        }

        const player = await this.gameRepository.findPlayerByGameIdAndRole(gameId, playerRole);
        if (!player) {
            throw new BadRequestException('Player not found');
        }

        // 驗證猜測數字格式
        if (!/^\d+$/.test(guess)) {
            throw new BadRequestException('contains non-numeric values');
        }

        if (!/^\d{4}$/.test(guess)) {
            throw new BadRequestException('guess length is not 4 digits');
        }

        // 取得對手的秘密數字
        const opponent = game.players.find(p => p.role !== playerRole);
        if (!opponent) {
            throw new BadRequestException('Opponent not found');
        }

        const result = this.calculateAB(guess, opponent.secret);

        // 如果猜中了，遊戲結束
        if (result.a === 4) {
            await this.gameRepository.updateGameStatus(gameId, GameStatus.FINISHED);
            await this.gameRepository.setWinner(gameId, playerRole);
        }

        return result;
    }

    private calculateAB(guess: string, secret: string): { a: number, b: number } {
        let a = 0;
        let b = 0;

        // 計算 A
        for (let i = 0; i < 4; i++) {
            if (guess[i] === secret[i]) {
                a++;
            }
        }

        // 計算 B
        const guessDigits = guess.split('');
        const secretDigits = secret.split('');
        for (let i = 0; i < 4; i++) {
            if (secretDigits.includes(guessDigits[i]) && guess[i] !== secret[i]) {
                b++;
            }
        }

        return { a, b };
    }

    private isValidSecret(secret: string): boolean {
        if (!/^\d{4}$/.test(secret)) {
            return false;
        }

        if (!/^\d+$/.test(secret)) {
            return false;
        }

        if (/(\d).*\1/.test(secret)) {
            return false;
        }

        return true;
    }
}