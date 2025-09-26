import { Controller, Post, Body, Param, Get, UseGuards } from '@nestjs/common';
import { GameService } from './game.service';
import {
  CreateGameDto,
  JoinGameDto,
  SetAnswerDto,
  MakeGuessDto,
  GameStateDto,
} from './dto';

@Controller('games')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post()
  async createGame(@Body() createGameDto: CreateGameDto): Promise<GameStateDto> {
    return this.gameService.createGame(createGameDto);
  }

  @Post(':gameId/join')
  async joinGame(
    @Param('gameId') gameId: string,
    @Body() joinGameDto: JoinGameDto,
  ): Promise<GameStateDto> {
    return this.gameService.joinGame(joinGameDto);
  }

  @Post(':gameId/players/:playerId/answer')
  async setAnswer(
    @Param('gameId') gameId: string,
    @Param('playerId') playerId: string,
    @Body() setAnswerDto: SetAnswerDto,
  ): Promise<GameStateDto> {
    return this.gameService.setAnswer(gameId, playerId, setAnswerDto);
  }

  @Post(':gameId/players/:playerId/guess')
  async makeGuess(
    @Param('gameId') gameId: string,
    @Param('playerId') playerId: string,
    @Body() makeGuessDto: MakeGuessDto,
  ): Promise<GameStateDto> {
    return this.gameService.makeGuess(gameId, playerId, makeGuessDto);
  }

  @Get(':gameId')
  async getGameState(@Param('gameId') gameId: string): Promise<GameStateDto> {
    return this.gameService.getGameState(gameId);
  }
}
