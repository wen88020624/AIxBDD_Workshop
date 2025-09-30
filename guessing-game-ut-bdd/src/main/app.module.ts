import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { GameController } from './game/game.controller';
import { GameService } from './game/game.service';
import { GameRepository } from './game/game.repository';

@Module({
  imports: [],
  controllers: [GameController],
  providers: [PrismaService, GameService, GameRepository],
})
export class AppModule {}