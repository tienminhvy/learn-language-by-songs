import { Injectable, OnModuleInit } from '@nestjs/common';
import Kuroshiro from 'kuroshiro';
import Analyzer from 'kuroshiro-analyzer-kuromoji';

@Injectable()
export class ParserService implements OnModuleInit {
  private kuroshiro: Kuroshiro;

  async onModuleInit() {
    this.kuroshiro = new Kuroshiro();
    await this.kuroshiro.init(new Analyzer());
  }

  parseLrc(lrc: string) {
    const lines = lrc.split('\n');
    const result = [];
    const timeRegex = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/;

    for (let i = 0; i < lines.length; i++) {
      const match = lines[i].match(timeRegex);
      if (match) {
        const minutes = parseInt(match[1]);
        const seconds = parseInt(match[2]);
        const milliseconds = parseInt(match[3]);
        const startTime = minutes * 60 + seconds + milliseconds / (match[3].length === 2 ? 100 : 1000);
        const text = lines[i].replace(timeRegex, '').trim();

        if (text) {
          result.push({
            startTime,
            text,
            phonetic: null
          });
        }
      }
    }

    // Set endTimes based on next line's startTime
    for (let i = 0; i < result.length - 1; i++) {
      result[i].endTime = result[i + 1].startTime;
    }

    return result;
  }

  async addFuriganaToLines(lines: any[]) {
    const results = [];
    for (const line of lines) {
      try {
        const phonetic = await this.kuroshiro.convert(line.text, { mode: 'furigana', to: 'hiragana' });
        results.push({
          ...line,
          phonetic
        });
      } catch (error) {
        console.error('Kuroshiro conversion error for line:', line.text, error);
        results.push(line);
      }
    }
    return results;
  }
}
