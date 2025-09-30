import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Game, Player } from './game.interface';
import { GameStatus, PlayerRole } from './game.enum';

@Injectable()
export class GameRepository {
  constructor(private prisma: PrismaService) {}

  async createGame(gameId: string, playerName: string): Promise<Game> {
    const game = await this.prisma.game.create({
      data: {
        id: gameId,
        status: GameStatus.WAITING_FOR_PLAYER,
        players: {
          create: {
            name: playerName,
            role: PlayerRole.P1,
          },
        },
      },
      include: {
        players: true,
      },
    });

    return this.mapToGame(game);
  }

  async findGameById(gameId: string): Promise<Game | null> {
    const game = await this.prisma.game.findUnique({
      where: { id: gameId },
      include: { players: true },
    });

    return game ? this.mapToGame(game) : null;
  }

  async addPlayerToGame(gameId: string, playerName: string): Promise<Game> {
    const game = await this.prisma.game.update({
      where: { id: gameId },
      data: {
        status: GameStatus.SETTING_SECRET_NUMBER,
        players: {
          create: {
            name: playerName,
            role: PlayerRole.P2,
          },
        },
      },
      include: { players: true },
    });

    return this.mapToGame(game);
  }

  async setPlayerSecret(gameId: string, playerRole: PlayerRole, secret: string): Promise<void> {
    await this.prisma.player.updateMany({
      where: {
        gameId,
        role: playerRole,
      },
      data: {
        secret,
      },
    });
  }

  async updateGameStatus(gameId: string, status: GameStatus): Promise<void> {
    await this.prisma.game.update({
      where: { id: gameId },
      data: { status },
    });
  }

  async markPlayerSecretChanged(gameId: string, playerRole: PlayerRole): Promise<void> {
    await this.prisma.player.updateMany({
      where: {
        gameId,
        role: playerRole,
      },
      data: {
        hasChanged: true,
      },
    });
  }

  async hasPlayerChangedSecret(gameId: string, playerRole: PlayerRole): Promise<boolean> {
    const player = await this.prisma.player.findFirst({
      where: {
        gameId,
        role: playerRole,
      },
    });
    return player?.hasChanged || false;
  }

  private mapToGame(prismaGame: any): Game {
    return {
      id: prismaGame.id,
      status: prismaGame.status as GameStatus,
      players: prismaGame.players.map((player: any) => ({
        name: player.name,
        role: player.role,
        secret: player.secret,
        hasChanged: player.hasChanged,
      })),
    };
  }
}
