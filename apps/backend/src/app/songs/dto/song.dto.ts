import { IsString, IsUrl, IsOptional } from 'class-validator';

export class DownloadSongDto {
  @IsUrl({}, { message: 'Must be a valid URL' })
  url: string;

  @IsOptional()
  @IsString()
  language?: string;
}
