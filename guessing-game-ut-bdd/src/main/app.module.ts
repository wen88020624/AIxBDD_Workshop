import { Module } from '@nestjs/common';
import { GameController } from './game/game.controller';
import { GameService } from './game/game.service';
import { GameRepository } from './game/game.repository';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [],
  controllers: [GameController],
  providers: [GameService, GameRepository, PrismaService],
})
export class AppModule {}