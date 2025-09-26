import { Game } from './game.entity';
import { Guess } from './guess.entity';

export class Player {
  id: string;
  name: string;
  answer: string | null;
  isHost: boolean;
  gameId: string;
  game: Game;
  guesses: Guess[];
  winner: boolean;

  constructor(partial: Partial<Player>) {
    Object.assign(this, partial);
    this.guesses = this.guesses || [];
    this.winner = this.winner || false;
  }

  setAnswer(answer: string): void {
    if (!this.isValidAnswer(answer)) {
      throw new Error('Invalid answer format');
    }
    this.answer = answer;
  }

  addGuess(guess: Guess): void {
    if (!this.guesses) {
      this.guesses = [];
    }
    this.guesses.push(guess);
  }

  private isValidAnswer(answer: string): boolean {
    if (answer.length !== 4) return false;
    if (!/^\d+$/.test(answer)) return false;
    const digits = new Set(answer.split(''));
    return digits.size === 4;
  }
}
