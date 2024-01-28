import { Injectable, NotFoundException } from '@nestjs/common';
import { Album, AlbumId, CreateAlbumDto, UpdateAlbumDto } from './dto/album';
import { v4 as uuid } from 'uuid';

@Injectable()
export class AlbumService {
  private albums: { [id: AlbumId['id']]: Album } = {};

  createAlbum(track: CreateAlbumDto) {
    const id: string = uuid();
    this.albums[id] = {
      ...track,
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
