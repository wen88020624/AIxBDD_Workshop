import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Game, Player } from './game.interface';
import { GameStatus, PlayerRole } from './game.enum';

@Injectable()
export class GameRepository {
    constructor(private prisma: PrismaService) {}

    async findGameById(gameId: string): Promise<Game> {
        const game = await this.prisma.game.findUnique({
            where: { id: gameId },
            include: { players: true }
        });
        
        if (!game) return null;
        
        return {
            ...game,
            status: game.status as GameStatus,
            winner: game.winner as PlayerRole,
            players: game.players.map(player => ({
                ...player,
                role: player.role as PlayerRole
            }))
        };
    }

    async findPlayerByGameIdAndRole(gameId: string, role: PlayerRole): Promise<Player> {
        const player = await this.prisma.player.findUnique({
            where: {
                gameId_role: {
                    gameId,
                    role
                }
            }
        });
        
        if (!player) return null;
        
        return {
            ...player,
            role: player.role as PlayerRole
        };
    }

    async updatePlayerSecret(gameId: string, role: PlayerRole, secret: string): Promise<Player> {
        const player = await this.prisma.player.update({
            where: {
                gameId_role: {
                    gameId,
                    role
                }
            },
            data: {
                secret,
                hasChangedSecret: true
            }
        });
        
        return {
            ...player,
            role: player.role as PlayerRole
        };
    }

    async updateGameStatus(gameId: string, status: GameStatus): Promise<Game> {
        const game = await this.prisma.game.update({
            where: { id: gameId },
            data: { status },
            include: { players: true }
        });
        
        return {
            ...game,
            status: game.status as GameStatus,
            winner: game.winner as PlayerRole,
            players: game.players.map(player => ({
                ...player,
                role: player.role as PlayerRole
            }))
        };
    }

    async setWinner(gameId: string, winner: PlayerRole): Promise<Game> {
        const game = await this.prisma.game.update({
            where: { id: gameId },
            data: { winner },
            include: { players: true }
        });
        
        return {
            ...game,
            status: game.status as GameStatus,
            winner: game.winner as PlayerRole,
            players: game.players.map(player => ({
                ...player,
                role: player.role as PlayerRole
            }))
        };
    }
}