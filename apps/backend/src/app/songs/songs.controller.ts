import { Controller, Get, Post, Body, Param, ParseIntPipe } from '@nestjs/common';
import { SongsService } from './songs.service';
import { DownloadSongDto } from './dto/song.dto';

@Controller('songs')
export class SongsController {
  constructor(private songsService: SongsService) {}

  @Get()
  getAllSongs() {
    return this.songsService.getAllSongs();
  }

  @Get(':id')
  getSongById(@Param('id', ParseIntPipe) id: number) {
    return this.songsService.getSongById(id);
  }

  @Post('download')
  downloadSong(@Body() body: DownloadSongDto) {
    return this.songsService.downloadSong(body.url, body.language);
  }
}
