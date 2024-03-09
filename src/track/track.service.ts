import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTrackDto, Track, UpdateTrackDto } from './dto/track';
import { DbService } from 'src/db/db.service';

@Injectable()
export class TrackService {
  @Inject(DbService)
  private readonly dbService: DbService;

  createTrack(track: CreateTrackDto) {
    return this.dbService.create({ type: 'track', dto: track });
  }

  deleteTrack(id: string) {
    const track = this.dbService.findById({ type: 'track', id });
    if (!track) {
      throw new NotFoundException(`Track with id ${id} not found`);
    }
    this.dbService.delete({ type: 'track', id });
    this.dbService.removeFromFavorites({ type: 'tracks', id });
  }

  updateTrack(id: string, data: UpdateTrackDto) {
    const track = this.dbService.findById({ type: 'track', id });
    if (!track) {
      throw new NotFoundException(`Track with id ${id} not found`);
    }
    return this.dbService.update({ type: 'track', id, data });
  }

  findAll(): Track[] {
    return this.dbService.findAll({ type: 'track' });
  }

  findById(id: string): Track {
    return this.dbService.findById({ type: 'track', id }) as Track;
  }

  removeAlbumId(albumId: string) {
    const listForRemoval = this.findByAlbumId(albumId);
    listForRemoval.forEach((track) =>
      this.dbService.update({
        type: 'track',
        id: track.id,
        data: { albumId: null },
      }),
    );
  }

  findByAlbumId(id: string): Track[] {
    return this.findAll().filter(
      (track) => track.albumId !== null && track.albumId === id,
    );
  }

  removeArtistId(artistId: string) {
    const listForRemoval = this.findByArtistId(artistId);
    listForRemoval.forEach((track) =>
      this.dbService.update({
        type: 'track',
        id: track.id,
        data: { artistId: null },
      }),
    );
  }

  findByArtistId(id: string): Track[] {
    return this.findAll().filter(
      (track) => track.artistId !== null && track.artistId === id,
    );
  }
}
