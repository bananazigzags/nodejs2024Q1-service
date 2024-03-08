import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  Artist,
  ArtistId,
  CreateArtostDto,
  UpdateArtistDto,
} from './dto/artist';
import { v4 as uuid } from 'uuid';
import { TrackService } from 'src/track/track.service';
import { AlbumService } from 'src/album/album.service';

@Injectable()
export class ArtistService {
  @Inject(TrackService)
  private readonly trackService: TrackService;
  @Inject(AlbumService)
  private readonly albumService: AlbumService;

  private artists: { [id: ArtistId['id']]: Artist } = {};

  createArtist(artist: CreateArtostDto) {
    const id: string = uuid();
    this.artists[id] = {
      ...artist,
      id,
    };
    return this.artists[id];
  }

  deleteArtist(id: string) {
    const user = this.findById(id);
    if (!user) {
      throw new NotFoundException(`Artist with id ${id} not found`);
    }
    this.albumService.removeArtistId(id);
    this.trackService.removeArtistId(id);
    delete this.artists[id];
  }

  updateArtist(id: string, data: UpdateArtistDto) {
    const user = this.findById(id);
    if (!user) {
      throw new NotFoundException(`Artist with id ${id} not found`);
    }
    Object.keys(data).forEach((key) => {
      this.artists[id][key] = data[key];
    });
    return this.artists[id];
  }

  findAll(): Artist[] {
    return Object.values(this.artists);
  }

  findById(id: string): Artist {
    return this.artists[id];
  }
}
