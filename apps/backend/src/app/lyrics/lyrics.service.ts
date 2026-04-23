import { Injectable, NotFoundException } from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from '../prisma/prisma.service';
import { ParserService } from '../parser/parser.service';

@Injectable()
export class LyricsService {
  constructor(
    private prisma: PrismaService,
    private parserService: ParserService
  ) {}

  async fetchAndStoreLyrics(songId: number) {
    const song = await this.prisma.song.findUnique({ where: { id: songId } });
    if (!song) throw new NotFoundException('Song not found');

    try {
      const response = await axios.get('https://lrclib.net/api/search', {
        params: {
          track_name: song.title,
          artist_name: song.artist
        }
      });

      const bestMatch = response.data.find(match => match.syncedLyrics);
      if (!bestMatch || !bestMatch.syncedLyrics) {
        throw new NotFoundException('Synced lyrics not found on LRCLIB');
      }

      const syncedLyrics = bestMatch.syncedLyrics;

      const lyricsRecord = await this.prisma.lyrics.create({
        data: {
          songId: song.id,
          language: song.language,
          source: 'LRCLIB'
        }
      });

      const parsedLines = this.parserService.parseLrc(syncedLyrics);
      const finalLines = song.language === 'ja'
        ? await this.parserService.addFuriganaToLines(parsedLines)
        : parsedLines;

      for (const line of finalLines) {
        await this.prisma.lyricLine.create({
          data: {
            lyricsId: lyricsRecord.id,
            startTime: line.startTime,
            endTime: line.endTime,
            text: line.text,
            phonetic: line.phonetic
          }
        });
      }

      return this.prisma.lyrics.findUnique({
        where: { id: lyricsRecord.id },
        include: { lines: true }
      });
    } catch (error) {
      console.error('Fetch lyrics error:', error);
      throw error;
    }
  }

  async addTranslation(lineId: number, language: string, text: string) {
    return this.prisma.lyricLineTranslation.create({
      data: {
        lineId,
        language,
        text
      }
    });
  }
}
