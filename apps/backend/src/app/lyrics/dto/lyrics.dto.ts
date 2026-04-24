import { IsNumber, IsString, IsNotEmpty } from 'class-validator';

export class TranslateLyricsDto {
  @IsNumber()
  lineId: number;

  @IsString()
  @IsNotEmpty()
  language: string;

  @IsString()
  @IsNotEmpty()
  text: string;
}
