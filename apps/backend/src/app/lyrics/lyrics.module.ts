import { Module } from '@nestjs/common';
import { LyricsController } from './lyrics.controller';
import { LyricsService } from './lyrics.service';
import { ParserModule } from '../parser/parser.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [ParserModule, PrismaModule],
  controllers: [LyricsController],
  providers: [LyricsService],
})
export class LyricsModule {}
