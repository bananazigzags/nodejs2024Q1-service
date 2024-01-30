import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Album, AlbumId, CreateAlbumDto, UpdateAlbumDto } from './dto/album';
import { v4 as uuid } from 'uuid';
import { TrackService } from 'src/track/track.service';

@Injectable()
export class AlbumService {
  @Inject(TrackService)
  private readonly trackService: TrackService;

  private albums: { [id: AlbumId['id']]: Album } = {};

  createAlbum(album: CreateAlbumDto) {
    const id: string = uuid();
    this.albums[id] = {
      ...album,
      id,
    };
    return this.albums[id];
  }

  deleteAlbum(id: string) {
    const user = this.findById(id);
    if (!user) {
      throw new NotFoundException(`Album with id ${id} not found`);
    }
    delete this.albums[id];
    this.trackService.removeAlbumId(id);
  }

  updateAlbum(id: string, data: UpdateAlbumDto) {
    const user = this.findById(id);
    if (!user) {
      throw new NotFoundException(`Album with id ${id} not found`);
    }
    Object.keys(data).forEach((key) => {
      this.albums[id][key] = data[key];
    });
    return this.albums[id];
  }

  findAll(): Album[] {
    return Object.values(this.albums);
  }

  findById(id: string): Album {
    const album = this.albums[id];
    if (!album) {
      throw new NotFoundException(`Album with id ${id} not found`);
    }
    return album;
  }
}
