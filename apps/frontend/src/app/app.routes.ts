import { Route } from '@angular/router';
import { SongListComponent } from './song-list/song-list';
import { PlayerComponent } from './player/player';

export const appRoutes: Route[] = [
  { path: '', component: SongListComponent },
  { path: 'player/:id', component: PlayerComponent },
];
