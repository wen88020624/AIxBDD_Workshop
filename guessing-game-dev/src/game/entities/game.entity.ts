import { GameStatus } from '../enums/game-status.enum';
import { Player } from './player.entity';

export class Game {
  id: string;
  gameId: string;
  status: GameStatus;
  players: Player[];
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<Game>) {
    Object.assign(this, partial);
  }

  addPlayer(player: Player): void {
    if (!this.players) {
      this.players = [];
    }
    this.players.push(player);
  }

  canJoin(): boolean {
    return this.status === GameStatus.WAITING_FOR_PLAYER && this.players.length < 2;
  }

  isReadyToStart(): boolean {
    return this.players.length === 2 && this.players.every(player => player.answer);
  }

  getWinner(): Player | null {
    return this.players.find(player => player.winner) || null;
  }
}
