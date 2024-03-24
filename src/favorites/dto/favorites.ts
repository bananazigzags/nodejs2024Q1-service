import { Album } from 'src/album/dto/album';
import { Artist } from 'src/artist/dto/artist';
import { Track } from 'src/track/dto/track';

export class Favorites {
  artists: string[]; // favorite artists ids
  albums: string[]; // favorite albums ids
  tracks: string[]; // favorite tracks ids
}

export class FavoritesResponse {
  artists: Artist[]; // favorite artists
  albums: Album[]; // favorite albums
  tracks: Track[]; // favorite tracks
}
