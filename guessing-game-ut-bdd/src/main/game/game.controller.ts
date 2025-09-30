import { Controller, Put, Patch, Post, Param, Body } from '@nestjs/common';
import { GameService } from './game.service';
import { SetSecretDto, GuessDto } from './game.interface';

@Controller('games')
export class GameController {
    constructor(private gameService: GameService) {}

    @Put(':gameId/secret')
    async setSecret(
        @Param('gameId') gameId: string,
        @Body() dto: SetSecretDto
    ): Promise<void> {
        await this.gameService.setSecret(gameId, dto);
    }

    @Patch(':gameId/secret')
    async updateSecret(
        @Param('gameId') gameId: string,
        @Body() dto: SetSecretDto
    ): Promise<void> {
        await this.gameService.updateSecret(gameId, dto);
    }

    @Post(':gameId/guess')
    async guess(
        @Param('gameId') gameId: string,
        @Body() dto: GuessDto
    ): Promise<{ a: number, b: number }> {
        return await this.gameService.guess(gameId, dto.playerRole, dto.guess);
    }
}