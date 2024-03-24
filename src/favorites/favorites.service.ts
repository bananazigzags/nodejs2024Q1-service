import {
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Favorites } from './dto/favorites';
import { DbService } from 'src/db/db.service';
import { Entity } from 'src/db/dto/db';

@Injectable()
export class FavoritesService {
  @Inject(DbService)
  private readonly dbService: DbService;
  private readonly favKeyToType: Record<keyof Favorites, Entity> = {
    artists: 'artist',
    albums: 'album',
    tracks: 'track',
  };

  addToFavorites(type: keyof Favorites, id: string) {
    const entity = this.dbService.findById({
      type: this.favKeyToType[type],
      id,
    });
    if (!entity) {
      throw new UnprocessableEntityException(
        `${type} with id ${id} doesn't exist`,
      );
    }
    this.dbService.addToFavorites({ type, id });
  }

  findAll() {
    const allFavorites = this.dbService.getFavorites();
    const response = { ...allFavorites };
    Object.entries(response).forEach(([key, entries]) => {
      response[key] = entries.map(
        (entityId: string) =>
          entityId &&
          this.dbService.findById({
            type: this.favKeyToType[key],
            id: entityId,
          }),
      );
    });
    return response;
  }

  deleteArtistFromFavorites(id: string) {
    this.dbService.removeFromFavorites({ type: 'artists', id });
  }

  deleteAlbumFromFavorites(id: string) {
    this.dbService.removeFromFavorites({ type: 'albums', id });
  }

  deleteTrackFromFavorites(id: string) {
    this.dbService.removeFromFavorites({ type: 'tracks', id });
  }
}
