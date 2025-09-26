import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Game, Player, Guess } from './entities';
import { GameStatus } from './enums/game-status.enum';

@Injectable()
export class GameRepository {
  constructor(private prisma: PrismaService) {}

  async createGame(gameId: string, player: Partial<Player>): Promise<Game> {
    return this.prisma.game.create({
      data: {
        gameId,
        status: GameStatus.WAITING_FOR_PLAYER,
        players: {
          create: {
            name: player.name,
            isHost: true,
          },
        },
      },
      include: {
        players: true,
      },
    });
  }

  async findGameById(id: string): Promise<Game | null> {
    return this.prisma.game.findUnique({
      where: { id },
      include: {
        players: {
          include: {
            guesses: true,
          },
        },
      },
    });
  }

  async findGameByGameId(gameId: string): Promise<Game | null> {
    return this.prisma.game.findUnique({
      where: { gameId },
      include: {
        players: {
          include: {
            guesses: true,
          },
        },
      },
    });
  }

  async addPlayerToGame(gameId: string, player: Partial<Player>): Promise<Game> {
    return this.prisma.game.update({
      where: { id: gameId },
      data: {
        players: {
          create: {
            name: player.name,
            isHost: false,
          },
        },
      },
      include: {
        players: {
          include: {
            guesses: true,
          },
        },
      },
    });
  }

  async updateGameStatus(gameId: string, status: GameStatus): Promise<Game> {
    return this.prisma.game.update({
      where: { id: gameId },
      data: { status },
      include: {
        players: {
          include: {
            guesses: true,
          },
        },
      },
    });
  }

  async setPlayerAnswer(playerId: string, answer: string): Promise<Player> {
    return this.prisma.player.update({
      where: { id: playerId },
      data: { answer },
      include: {
        guesses: true,
      },
    });
  }

  async addGuess(playerId: string, number: string, result: string): Promise<Guess> {
    return this.prisma.guess.create({
      data: {
        number,
        result,
        playerId,
      },
    });
  }

  async setWinner(playerId: string): Promise<Player> {
    return this.prisma.player.update({
      where: { id: playerId },
      data: { winner: true },
    });
  }
}
