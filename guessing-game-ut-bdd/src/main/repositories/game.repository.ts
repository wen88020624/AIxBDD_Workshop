import { Injectable } from '@nestjs/common';
import { Game } from '../game/game.interface';

@Injectable()
export class GameRepository {
  private games = new Map<string, Game>();

  async findById(gameId: string): Promise<Game | undefined> {
    return this.games.get(gameId);
  }

  async save(gameId: string, game: Game): Promise<Game> {
    this.games.set(gameId, game);
    return game;
  }
}