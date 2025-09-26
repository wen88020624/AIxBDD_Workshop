import { Player } from './player.entity';

export class Guess {
  id: string;
  number: string;
  result: string;
  playerId: string;
  player: Player;
  createdAt: Date;

  constructor(partial: Partial<Guess>) {
    Object.assign(this, partial);
  }

  static calculateResult(guess: string, answer: string): string {
    let a = 0;
    let b = 0;
    const guessArray = guess.split('');
    const answerArray = answer.split('');

    // 計算 A
    for (let i = 0; i < 4; i++) {
      if (guessArray[i] === answerArray[i]) {
        a++;
      }
    }

    // 計算 B
    for (let i = 0; i < 4; i++) {
      if (answerArray.includes(guessArray[i]) && guessArray[i] !== answerArray[i]) {
        b++;
      }
    }

    return `${a}A${b}B`;
  }
}
