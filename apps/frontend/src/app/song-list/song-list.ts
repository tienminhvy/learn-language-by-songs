import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SongService } from '../services/song/song';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-song-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './song-list.html',
  styleUrl: './song-list.css',
})
export class SongListComponent implements OnInit {
  songs: any[] = [];
  loading = false;

  constructor(public songService: SongService) {}

  ngOnInit(): void {
    this.loadSongs();
  }

  loadSongs(): void {
    this.loading = true;
    this.songService.getSongs().subscribe({
      next: (songs) => {
        this.songs = songs;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load songs', err);
        this.loading = false;
      }
    });
  }

  download(url: string): void {
    if (!url) return;
    this.loading = true;
    this.songService.downloadSong(url).subscribe({
      next: () => {
        this.loadSongs();
      },
      error: (err) => {
        console.error('Download failed', err);
        this.loading = false;
      }
    });
  }

  fetchLyrics(songId: number): void {
    this.loading = true;
    this.songService.fetchLyrics(songId).subscribe({
      next: () => {
        this.loadSongs();
      },
      error: (err) => {
        console.error('Fetch lyrics failed', err);
        this.loading = false;
      }
    });
  }
}
