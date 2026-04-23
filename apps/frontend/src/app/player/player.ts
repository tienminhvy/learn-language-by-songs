import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SongService } from '../services/song/song';

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './player.html',
  styleUrl: './player.css',
})
export class PlayerComponent implements OnInit, OnDestroy {
  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;
  song: any;
  currentLyrics: any[] = [];
  activeLineIndex = -1;
  showTranslation = true;

  constructor(
    private route: ActivatedRoute,
    private songService: SongService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadSong(parseInt(id));
    }
  }

  ngOnDestroy(): void {
    // Cleanup logic if needed
  }

  loadSong(id: number): void {
    this.songService.getSong(id).subscribe({
      next: (song) => {
        this.song = song;
        if (song.lyrics && song.lyrics.length > 0) {
          this.currentLyrics = song.lyrics[0].lines.sort((a: any, b: any) => a.startTime - b.startTime);
        }
      },
      error: (err) => console.error('Failed to load song', err)
    });
  }

  onTimeUpdate(): void {
    if (!this.audioPlayer) return;
    const currentTime = this.audioPlayer.nativeElement.currentTime;
    const index = this.currentLyrics.findIndex((line, i) => {
      const nextLine = this.currentLyrics[i + 1];
      return currentTime >= line.startTime && (!nextLine || currentTime < nextLine.startTime);
    });

    if (index !== this.activeLineIndex) {
      this.activeLineIndex = index;
      this.scrollToActiveLine();
    }
  }

  scrollToActiveLine(): void {
    setTimeout(() => {
      const activeEl = document.querySelector('.lyric-line.active');
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  }

  getAudioUrl(): string {
    if (!this.song || !this.song.filePath) return '';
    return `http://localhost:3000/audio/${this.song.filePath}`;
  }
}
