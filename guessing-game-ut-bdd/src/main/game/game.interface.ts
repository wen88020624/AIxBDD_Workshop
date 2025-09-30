import { GameStatus, PlayerRole } from './game.enum';

export interface SetSecretDto {
    playerRole: PlayerRole;
    secret: string;
}

export interface GuessDto {
    playerRole: PlayerRole;
    guess: string;
}

export interface Player {
    id: number;
    gameId: string;
    role: PlayerRole;
    name: string;
    secret?: string;
    hasChangedSecret: boolean;
}

export interface Game {
    id: string;
    status: GameStatus;
    players: Player[];
    winner?: PlayerRole;
}