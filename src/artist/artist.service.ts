import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Artist, CreateArtistDto, UpdateArtistDto } from './dto/artist';
import { TrackService } from 'src/track/track.service';
import { AlbumService } from 'src/album/album.service';
import { DbService } from 'src/db/db.service';

@Injectable()
export class ArtistService {
  @Inject(TrackService)
  private readonly trackService: TrackService;
  @Inject(AlbumService)
  private readonly albumService: AlbumService;
  @Inject(DbService)
  private readonly dbService: DbService;

  createArtist(artist: CreateArtistDto) {
    return this.dbService.create({ type: 'artist', dto: artist });
  }

  deleteArtist(id: string) {
    const artist = this.dbService.findById({ type: 'artist', id });
    if (!artist) {
      throw new NotFoundException(`Artist with id ${id} not found`);
    }
    this.albumService.removeArtistId(id);
    this.trackService.removeArtistId(id);
    this.dbService.delete({ type: 'artist', id });
    this.dbService.removeFromFavorites({ type: 'artists', id });
  }

  updateArtist(id: string, data: UpdateArtistDto) {
    const artist = this.dbService.findById({ type: 'artist', id });
    if (!artist) {
      throw new NotFoundException(`Artist with id ${id} not found`);
    }
    return this.dbService.update({ type: 'artist', id, data });
  }

  findAll() {
    return this.dbService.findAll({ type: 'artist' }) as Artist[];
  }

  findById(id: string) {
    return this.dbService.findById({ type: 'artist', id }) as Artist;
  }
}
