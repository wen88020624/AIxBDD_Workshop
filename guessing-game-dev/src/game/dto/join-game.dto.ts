import { IsString, Length, Matches } from 'class-validator';

export class JoinGameDto {
  @IsString()
  @Length(3, 5)
  @Matches(/^[a-zA-Z0-9]+$/, {
    message: '遊戲 ID 只能包含字母和數字',
  })
  gameId: string;

  @IsString()
  @Length(3, 10)
  playerName: string;
}
