import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { GameRepository } from '../repositories/game.repository';
import { Game, JoinGameResponse, PlayersResponse, StatusResponse } from '../game/game.interface';
import { GameStatus, PlayerRole } from '../game/game.enum';

@Injectable()
export class GameService {
  constructor(private readonly gameRepository: GameRepository) {}

  async joinGame(gameId: string, playerName: string): Promise<JoinGameResponse> {
    const game = await this.gameRepository.findById(gameId);
    
    if (!game) {
      // 創建新遊戲
      const newGame: Game = {
        id: gameId,
        players: [{ name: playerName }],
        status: GameStatus.WAITING_FOR_PLAYER
      };
      await this.gameRepository.save(gameId, newGame);
      return { gameId, playerRole: PlayerRole.P1 };
    }

    // 檢查遊戲是否已滿
    if (game.players.length >= 2) {
      throw new BadRequestException('遊戲已滿');
    }

    // 檢查玩家是否已經在遊戲中
    if (game.players.some(p => p.name === playerName)) {
      throw new BadRequestException('玩家已在遊戲中');
    }

    // 加入第二位玩家
    game.players.push({ name: playerName });
    game.status = GameStatus.SETTING_SECRET_NUMBER;
    await this.gameRepository.save(gameId, game);
    return { gameId, playerRole: PlayerRole.P2 };
  }

  async getPlayers(gameId: string): Promise<PlayersResponse> {
    const game = await this.findGameOrThrow(gameId);
    return {
      players: game.players
    };
  }

  async getStatus(gameId: string): Promise<StatusResponse> {
    const game = await this.findGameOrThrow(gameId);
    return {
      status: game.status
    };
  }

  private async findGameOrThrow(gameId: string): Promise<Game> {
    const game = await this.gameRepository.findById(gameId);
    if (!game) {
      throw new NotFoundException('遊戲不存在');
    }
    return game;
  }
}