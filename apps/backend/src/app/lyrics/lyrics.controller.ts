import { Controller, Post, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { LyricsService } from './lyrics.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TranslateLyricsDto } from './dto/lyrics.dto';

@Controller('lyrics')
@UseGuards(JwtAuthGuard)
export class LyricsController {
  constructor(private lyricsService: LyricsService) {}

  @Post('fetch/:songId')
  fetchAndStoreLyrics(@Param('songId', ParseIntPipe) songId: number) {
    return this.lyricsService.fetchAndStoreLyrics(songId);
  }

  @Post('translate')
  addTranslation(@Body() body: TranslateLyricsDto) {
    return this.lyricsService.addTranslation(body.lineId, body.language, body.text);
  }
}
