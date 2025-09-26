import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { GameRepository } from './game.repository';
import { CreateGameDto, JoinGameDto, SetAnswerDto, MakeGuessDto, GameStateDto } from './dto';
import { Game, Player, Guess } from './entities';
import { GameStatus } from './enums/game-status.enum';

@Injectable()
export class GameService {
  constructor(private readonly gameRepository: GameRepository) {}

  async createGame(createGameDto: CreateGameDto): Promise<GameStateDto> {
    const existingGame = await this.gameRepository.findGameByGameId(createGameDto.gameId);
    if (existingGame) {
      throw new BadRequestException('遊戲 ID 已存在');
    }

    const game = await this.gameRepository.createGame(createGameDto.gameId, {
      name: createGameDto.playerName,
    });

    return this.mapToGameState(game);
  }

  async joinGame(joinGameDto: JoinGameDto): Promise<GameStateDto> {
    const game = await this.gameRepository.findGameByGameId(joinGameDto.gameId);
    if (!game) {
      throw new NotFoundException('遊戲不存在');
    }

    if (!game.canJoin()) {
      throw new BadRequestException('遊戲已滿或已開始');
    }

    if (game.players.some(p => p.name === joinGameDto.playerName)) {
      throw new BadRequestException('玩家名稱已存在');
    }

    const updatedGame = await this.gameRepository.addPlayerToGame(game.id, {
      name: joinGameDto.playerName,
    });

    await this.gameRepository.updateGameStatus(game.id, GameStatus.SETTING_ANSWER);

    return this.mapToGameState(updatedGame);
  }

  async setAnswer(gameId: string, playerId: string, setAnswerDto: SetAnswerDto): Promise<GameStateDto> {
    const game = await this.gameRepository.findGameByGameId(gameId);
    if (!game) {
      throw new NotFoundException('遊戲不存在');
    }

    const player = game.players.find(p => p.id === playerId);
    if (!player) {
      throw new NotFoundException('玩家不存在');
    }

    if (game.status !== GameStatus.SETTING_ANSWER) {
      throw new BadRequestException('現在不是設定答案的階段');
    }

    if (!setAnswerDto.validate()) {
      throw new BadRequestException('答案格式不正確');
    }

    await this.gameRepository.setPlayerAnswer(playerId, setAnswerDto.answer);

    const updatedGame = await this.gameRepository.findGameById(game.id);
    if (updatedGame.isReadyToStart()) {
      await this.gameRepository.updateGameStatus(game.id, GameStatus.GUESSING);
    }

    return this.mapToGameState(updatedGame);
  }

  async makeGuess(gameId: string, playerId: string, makeGuessDto: MakeGuessDto): Promise<GameStateDto> {
    const game = await this.gameRepository.findGameByGameId(gameId);
    if (!game) {
      throw new NotFoundException('遊戲不存在');
    }

    if (game.status !== GameStatus.GUESSING) {
      throw new BadRequestException('遊戲尚未開始猜測階段');
    }

    const player = game.players.find(p => p.id === playerId);
    if (!player) {
      throw new NotFoundException('玩家不存在');
    }

    const opponent = game.players.find(p => p.id !== playerId);
    if (!opponent || !opponent.answer) {
      throw new BadRequestException('對手尚未準備好');
    }

    if (!makeGuessDto.validate()) {
      throw new BadRequestException('猜測格式不正確');
    }

    const result = Guess.calculateResult(makeGuessDto.number, opponent.answer);
    await this.gameRepository.addGuess(playerId, makeGuessDto.number, result);

    if (result === '4A0B') {
      await this.gameRepository.setWinner(playerId);
      await this.gameRepository.updateGameStatus(game.id, GameStatus.FINISHED);
    }

    const updatedGame = await this.gameRepository.findGameById(game.id);
    return this.mapToGameState(updatedGame);
  }

  async getGameState(gameId: string): Promise<GameStateDto> {
    const game = await this.gameRepository.findGameByGameId(gameId);
    if (!game) {
      throw new NotFoundException('遊戲不存在');
    }

    return this.mapToGameState(game);
  }

  private mapToGameState(game: Game): GameStateDto {
    return {
      id: game.id,
      gameId: game.gameId,
      status: game.status as GameStatus,
      players: game.players.map(player => ({
        id: player.id,
        name: player.name,
        isHost: player.isHost,
        hasSetAnswer: !!player.answer,
        winner: player.winner,
        guesses: player.guesses.map(guess => ({
          number: guess.number,
          result: guess.result,
          createdAt: guess.createdAt,
        })),
      })),
      winner: game.getWinner()?.name,
      createdAt: game.createdAt,
      updatedAt: game.updatedAt,
    };
  }
}
