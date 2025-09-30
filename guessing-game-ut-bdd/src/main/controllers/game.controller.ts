import { Controller, Post, Get, Body, Param, HttpStatus, HttpCode } from '@nestjs/common';
import { GameService } from '../services/game.service';

@Controller('games')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async joinGame(@Body() body: { gameId: string; playerName: string }) {
    return this.gameService.joinGame(body.gameId, body.playerName);
  }

  @Get(':gameId/players')
  async getPlayers(@Param('gameId') gameId: string) {
    return this.gameService.getPlayers(gameId);
  }

  @Get(':gameId/status')
  async getStatus(@Param('gameId') gameId: string) {
    return this.gameService.getStatus(gameId);
  }
}