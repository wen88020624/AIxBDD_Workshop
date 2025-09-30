import { Controller, Post, Body, Param, Put, Patch, Get } from '@nestjs/common';
import { GameService } from './game.service';
import { PlayerRole } from './game.enum';

@Controller('games')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post()
  async joinGame(
    @Body('gameId') gameId: string,
    @Body('playerName') playerName: string,
  ) {
    return this.gameService.joinGame(gameId, playerName);
  }

  @Put(':gameId/secret')
  async setSecret(
    @Param('gameId') gameId: string,
    @Body('playerRole') playerRole: PlayerRole,
    @Body('secret') secret: string,
  ) {
    await this.gameService.setSecret(gameId, playerRole, secret);
  }

  @Patch(':gameId/secret')
  async changeSecret(
    @Param('gameId') gameId: string,
    @Body('playerRole') playerRole: PlayerRole,
    @Body('secret') secret: string,
  ) {
    await this.gameService.changeSecret(gameId, playerRole, secret);
  }

  @Get(':gameId/status')
  async getStatus(@Param('gameId') gameId: string) {
    const game = await this.gameService.getGame(gameId);
    return { status: game.status };
  }

  @Get(':gameId/secrets')
  async getSecrets(@Param('gameId') gameId: string) {
    const game = await this.gameService.getGame(gameId);
    return {
      secrets: game.players.map(p => ({
        id: p.role,
        secret: p.secret || ''
      }))
    };
  }

  @Post(':gameId/guess')
  async guess(
    @Param('gameId') gameId: string,
    @Body('playerRole') playerRole: PlayerRole,
    @Body('guess') guess: string,
  ) {
    return this.gameService.guess(gameId, playerRole, guess);
  }
}
