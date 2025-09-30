import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { GameRepository } from './game.repository';
import { GameStatus, PlayerRole } from './game.enum';
import { Game, JoinGameResponse } from './game.interface';

@Injectable()
export class GameService {
  constructor(private readonly gameRepository: GameRepository) {}

  async joinGame(gameId: string, playerName: string): Promise<JoinGameResponse> {
    let game = await this.gameRepository.findGameById(gameId);

    if (!game) {
      game = await this.gameRepository.createGame(gameId, playerName);
      return { gameId: game.id, playerRole: PlayerRole.P1 };
    }

    if (game.players.length >= 2) {
      throw new BadRequestException('Game is full');
    }

    if (game.players.some(p => p.name === playerName)) {
      throw new BadRequestException('Player already in game');
    }

    game = await this.gameRepository.addPlayerToGame(gameId, playerName);
    return { gameId: game.id, playerRole: PlayerRole.P2 };
  }

  async setSecret(gameId: string, playerRole: PlayerRole, secret: string): Promise<void> {
    const game = await this.gameRepository.findGameById(gameId);
    if (!game) {
      throw new NotFoundException('Game not found');
    }

    if (game.status !== GameStatus.SETTING_SECRET_NUMBER) {
      throw new BadRequestException('Game is not in secret setting phase');
    }

    if (playerRole === PlayerRole.P2 && !game.players.find(p => p.role === PlayerRole.P1)?.secret) {
      throw new BadRequestException('P2 must set secret after P1');
    }

    if (!this.isValidSecret(secret)) {
      throw new BadRequestException('Invalid secret format');
    }

    await this.gameRepository.setPlayerSecret(gameId, playerRole, secret);

    // Check if both players have set their secrets
    const updatedGame = await this.gameRepository.findGameById(gameId);
    if (updatedGame?.players.every(p => p.secret)) {
      await this.gameRepository.updateGameStatus(gameId, GameStatus.PLAYING);
    }
  }

  async changeSecret(gameId: string, playerRole: PlayerRole, secret: string): Promise<void> {
    const game = await this.gameRepository.findGameById(gameId);
    if (!game) {
      throw new NotFoundException('Game not found');
    }

    if (game.status !== GameStatus.SETTING_SECRET_NUMBER) {
      throw new BadRequestException('Cannot change secret after game enters guessing phase');
    }

    const hasChanged = await this.gameRepository.hasPlayerChangedSecret(gameId, playerRole);
    if (hasChanged) {
      throw new BadRequestException(`${playerRole} has already changed secret once, cannot change again`);
    }

    if (!this.isValidSecret(secret)) {
      throw new BadRequestException('Invalid secret format');
    }

    await this.gameRepository.setPlayerSecret(gameId, playerRole, secret);
    await this.gameRepository.markPlayerSecretChanged(gameId, playerRole);
  }

  async getGame(gameId: string): Promise<Game> {
    const game = await this.gameRepository.findGameById(gameId);
    if (!game) {
      throw new NotFoundException('Game not found');
    }
    return game;
  }

  async guess(gameId: string, playerRole: PlayerRole, guess: string): Promise<{ result: { a: number; b: number }; gameStatus: string }> {
    const game = await this.gameRepository.findGameById(gameId);
    if (!game) {
      throw new NotFoundException('Game not found');
    }

    if (game.status !== GameStatus.PLAYING) {
      throw new BadRequestException('Game is not in guessing phase');
    }

    const opponent = game.players.find(p => p.role !== playerRole);
    if (!opponent) {
      throw new BadRequestException('Opponent not found');
    }

    const result = this.compareNumbers(guess, opponent.secret);
    if (result.a === 4) {
      await this.gameRepository.updateGameStatus(gameId, GameStatus.ENDED);
      return { result, gameStatus: GameStatus.ENDED };
    }

    return { result, gameStatus: game.status };
  }

  private compareNumbers(guess: string, secret: string): { a: number; b: number } {
    let a = 0;
    let b = 0;
    const guessDigits = guess.split('');
    const secretDigits = secret.split('');

    // 計算 A
    for (let i = 0; i < 4; i++) {
      if (guessDigits[i] === secretDigits[i]) {
        a++;
      }
    }

    // 計算 B
    const guessSet = new Set(guessDigits);
    const secretSet = new Set(secretDigits);
    const commonDigits = [...guessSet].filter(x => secretSet.has(x)).length;
    b = commonDigits - a;

    return { a, b };
  }

  private isValidSecret(secret: string): boolean {
    if (!/^\d{4}$/.test(secret)) {
      return false;
    }

    const digits = secret.split('');
    const uniqueDigits = new Set(digits);
    return uniqueDigits.size === digits.length;
  }
}
