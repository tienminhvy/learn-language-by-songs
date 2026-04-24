import { Injectable, OnModuleInit, InternalServerErrorException } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import YTDlpWrap from 'yt-dlp-wrap';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SongsService implements OnModuleInit {
  private ytDlp: any;
  private readonly songsDir = path.resolve('apps/backend/assets/songs');

  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    const binaryPath = path.resolve('apps/backend/assets/yt-dlp');
    if (!fs.existsSync(this.songsDir)) {
      fs.mkdirSync(this.songsDir, { recursive: true });
    }
    try {
      if (!fs.existsSync(binaryPath)) {
        console.log('Downloading yt-dlp binary...');
        await YTDlpWrap.downloadFromGithub(binaryPath);
        fs.chmodSync(binaryPath, '755');
      }
      this.ytDlp = new YTDlpWrap(binaryPath);
    } catch (error) {
      console.error('Failed to initialize yt-dlp:', error);
    }
  }

  async getAllSongs() {
    return this.prisma.song.findMany({
      include: {
        lyrics: {
          include: {
            lines: {
              include: { translations: true }
            }
          }
        }
      }
    });
  }

  async getSongById(id: number) {
    return this.prisma.song.findUnique({
      where: { id },
      include: {
        lyrics: {
          include: {
            lines: {
              include: { translations: true }
            }
          }
        }
      }
    });
  }

  async downloadSong(youtubeUrl: string, language = 'ja') {
    // Check if song already exists
    const existing = await this.prisma.song.findUnique({ where: { youtubeUrl } });
    if (existing) return existing;

    try {
      const metadata: any = await this.ytDlp.getVideoInfo(youtubeUrl);
      const title = metadata.track || metadata.title;
      const artist = metadata.artist || metadata.uploader || 'Unknown';
      const thumbnail = metadata.thumbnail;
      const duration = Math.floor(metadata.duration);

      const safeTitle = title.replace(/[^\w\s]/gi, '_').replace(/\s+/g, '_');
      const filename = `${safeTitle}.mp3`;
      const filePath = path.join(this.songsDir, filename);

      await this.ytDlp.execPromise([
        youtubeUrl,
        '-x',
        '--audio-format', 'mp3',
        '-o', filePath
      ]);

      return await this.prisma.song.create({
        data: {
          title,
          artist,
          youtubeUrl,
          filePath: filename,
          fileType: 'audio',
          language,
          duration,
          thumbnail
        }
      });
    } catch (error) {
      console.error('Download error:', error);
      throw new InternalServerErrorException(`Failed to download song: ${error.message}`);
    }
  }
}
