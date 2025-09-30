import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { GameService } from './game.service';
import { JoinGameDto, JoinGameResponseDto } from './dto/join-game.dto';

@Controller('games')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post()
  @HttpCode(200)
  async joinGame(@Body() joinGameDto: JoinGameDto): Promise<JoinGameResponseDto> {
    return this.gameService.joinGame(joinGameDto);
  }
}