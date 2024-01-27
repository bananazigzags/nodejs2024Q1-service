import { Injectable, NotFoundException } from '@nestjs/common';
import {
  Artist,
  ArtistId,
  CreateArtostDto,
  UpdateArtistDto,
} from './dto/artist';
import { v4 as uuid } from 'uuid';

@Injectable()
export class ArtistService {
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
