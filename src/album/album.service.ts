import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Album, CreateAlbumDto, UpdateAlbumDto } from './dto/album';
import { TrackService } from 'src/track/track.service';
import { DbService } from 'src/db/db.service';

@Injectable()
export class AlbumService {
  @Inject(TrackService)
  private readonly trackService: TrackService;
  @Inject(DbService)
  private readonly dbService: DbService;

  createAlbum(album: CreateAlbumDto) {
    return this.dbService.create({ type: 'album', dto: album });
  }

  deleteAlbum(id: string) {
    const album = this.dbService.findById({ type: 'album', id });
    if (!album) {
      throw new NotFoundException(`Album with id ${id} not found`);
    }
    this.dbService.delete({ type: 'album', id });
    this.trackService.removeAlbumId(id);
    this.dbService.removeFromFavorites({ type: 'albums', id });
  }

  updateAlbum(id: string, data: UpdateAlbumDto) {
    const album = this.dbService.findById({ type: 'album', id });
    if (!album) {
      throw new NotFoundException(`Album with id ${id} not found`);
    }
    return this.dbService.update({ type: 'album', id, data });
  }

  findAll(): Album[] {
    return this.dbService.findAll({ type: 'album' });
  }

  findById(id: string): Album {
    const album = this.dbService.findById({ type: 'album', id }) as Album;
    if (!album) {
      throw new NotFoundException(`Album with id ${id} not found`);
    }
    return album;
  }

  removeArtistId(artistId: string) {
    const listForRemoval = this.findByArtistId(artistId);
    listForRemoval.forEach((album) =>
      this.dbService.update({
        type: 'album',
        id: album.id,
        data: { artistId: null },
      }),
    );
  }

  findByArtistId(id: string): Album[] {
    return this.findAll().filter((album) => album.artistId === id);
  }
}
