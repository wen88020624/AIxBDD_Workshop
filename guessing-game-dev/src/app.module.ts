import { Module } from '@nestjs/common';
import { GameModule } from './game/game.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule, GameModule],
})
export class AppModule {}