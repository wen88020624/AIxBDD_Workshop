import { Injectable } from '@nestjs/common';
import { JoinGameDto, JoinGameResponseDto } from './dto/join-game.dto';

@Injectable()
export class GameService {
  async joinGame(joinGameDto: JoinGameDto): Promise<JoinGameResponseDto> {
    // 保持原有邏輯不變
    return {
      gameId: joinGameDto.gameId,
      playerRole: 'P1'
    };
  }
}