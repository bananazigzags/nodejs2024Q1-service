import { Injectable } from '@nestjs/common';
import {
  Album,
  AlbumId,
  CreateAlbumDto,
  UpdateAlbumDto,
} from 'src/album/dto/album';
import {
  Artist,
  ArtistId,
  CreateArtistDto,
  UpdateArtistDto,
} from 'src/artist/dto/artist';
import { Favorites } from 'src/favorites/dto/favorites';
import { v4 as uuid } from 'uuid';
import {
  CreateTrackDto,
  Track,
  TrackId,
  UpdateTrackDto,
} from 'src/track/dto/track';
import { Entity } from './dto/db';

@Injectable()
export class DbService {
  private album: { [id: AlbumId['id']]: Album } = {};
  private artist: { [id: ArtistId['id']]: Artist } = {};
  private track: { [id: TrackId['id']]: Track } = {};

  private favorites: Favorites = {
    albums: [],
    artists: [],
    tracks: [],
  };

  create({
    type,
    dto,
  }: {
    type: Entity;
    dto: CreateAlbumDto | CreateArtistDto | CreateTrackDto;
  }) {
    const id: string = uuid();
    this[type][id] = {
      ...dto,
      id,
    };
    return this[type][id];
  }

  delete({ type, id }: { type: Entity; id: string }) {
    return delete this[type][id];
  }

  update({
    type,
    data,
    id,
  }: {
    type: Entity;
    id: string;
    data: UpdateAlbumDto | UpdateArtistDto | UpdateTrackDto;
  }) {
    Object.keys(data).forEach((key) => {
      this[type][id][key] = data[key];
    });
    return this[type][id];
  }

  findAll({ type }: { type: Entity }) {
    return Object.values(this[type]);
  }

  findById({ type, id }: { type: Entity; id: string }): Artist | Track | Album {
    return this[type]?.[id];
  }

  getFavorites() {
    return this.favorites;
  }

  removeFromFavorites({ type, id }: { type: keyof Favorites; id: string }) {
    this.favorites[type] = this.favorites[type].filter(
      (entityId: Entity) => entityId !== id,
    );
  }

  addToFavorites({ type, id }: { type: keyof Favorites; id: string }) {
    this.favorites[type].push(id);
    return this.favorites[type];
  }
}
