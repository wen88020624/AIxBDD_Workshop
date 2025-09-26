import { GameStatus } from '../enums/game-status.enum';

export class PlayerStateDto {
  id: string;
  name: string;
  isHost: boolean;
  hasSetAnswer: boolean;
  winner: boolean;
  guesses: {
    number: string;
    result: string;
    createdAt: Date;
  }[];
}

export class GameStateDto {
  id: string;
  gameId: string;
  status: GameStatus;
  players: PlayerStateDto[];
  currentPlayer?: string;
  winner?: string;
  createdAt: Date;
  updatedAt: Date;
}
