import { Controller, Post, Body, Param, ParseIntPipe } from '@nestjs/common';
import { LyricsService } from './lyrics.service';

@Controller('lyrics')
export class LyricsController {
  constructor(private lyricsService: LyricsService) {}

  @Post('fetch/:songId')
  fetchAndStoreLyrics(@Param('songId', ParseIntPipe) songId: number) {
    return this.lyricsService.fetchAndStoreLyrics(songId);
  }

  @Post('translate')
  addTranslation(@Body() body: { lineId: number; language: string; text: string }) {
    return this.lyricsService.addTranslation(body.lineId, body.language, body.text);
  }
}
