import { Module } from '@nestjs/common';
import { GameController } from './controllers/game.controller';
import { GameService } from './services/game.service';
import { GameRepository } from './repositories/game.repository';

@Module({
  imports: [],
  controllers: [GameController],
  providers: [GameService, GameRepository],
})
export class AppModule {}
