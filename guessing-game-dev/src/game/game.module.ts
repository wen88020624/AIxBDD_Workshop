import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { GameRepository } from './game.repository';
import { GameGateway } from './game.gateway';

@Module({
  controllers: [GameController],
  providers: [GameService, GameRepository, GameGateway],
})
export class GameModule {}
