import { IsString, Length, Matches } from 'class-validator';

export class MakeGuessDto {
  @IsString()
  @Length(4, 4)
  @Matches(/^[0-9]{4}$/, {
    message: '猜測必須是 4 位數字',
  })
  number: string;

  // 用於驗證數字是否重複的自定義驗證
  validate(): boolean {
    const digits = new Set(this.number.split(''));
    return digits.size === 4;
  }
}
