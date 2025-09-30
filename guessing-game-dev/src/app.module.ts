import { Module } from '@nestjs/common';
import { HelloWorldModule } from './main/example/hello-world.module';
import { GameModule } from './game/game.module';

@Module({
  imports: [HelloWorldModule, GameModule],
})
export class AppModule {}