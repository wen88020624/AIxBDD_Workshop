import { IsString, Length, Matches } from 'class-validator';

export class SetAnswerDto {
  @IsString()
  @Length(4, 4)
  @Matches(/^[0-9]{4}$/, {
    message: '答案必須是 4 位數字',
  })
  answer: string;

  // 用於驗證數字是否重複的自定義驗證
  validate(): boolean {
    const digits = new Set(this.answer.split(''));
    return digits.size === 4;
  }
}
