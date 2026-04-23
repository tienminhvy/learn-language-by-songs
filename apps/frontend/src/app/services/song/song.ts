import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SongService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getSongs(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/songs`);
  }

  getSong(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/songs/${id}`);
  }

  downloadSong(url: string, language = 'ja'): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/songs/download`, { url, language });
  }

  fetchLyrics(songId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/lyrics/fetch/${songId}`, {});
  }
}
