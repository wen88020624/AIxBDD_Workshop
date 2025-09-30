import { GameStatus } from './game.enum';

export interface Game {
  id: string;
  players: Player[];
  status: GameStatus;
}

export interface Player {
  name: string;
  role: string;
  secret?: string;
  hasChanged?: boolean;
}

export interface JoinGameResponse {
  gameId: string;
  playerRole: string;
}

export interface PlayersResponse {
  players: Player[];
}

export interface StatusResponse {
  status: string;
}
