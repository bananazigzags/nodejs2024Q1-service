import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { Favorites, FavoritesResponse } from './dto/favorites';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FavoritesService {
  constructor(private prismaService: PrismaService) {
    this.createFavorites();
  }

  async checkEntityExists(type: keyof Favorites, id: string) {
    let entity: unknown;
    if (type === 'albums') {
      entity = await this.prismaService.album.findUnique({
        where: { id },
      });
    } else if (type === 'artists') {
      entity = await this.prismaService.artist.findUnique({
        where: { id },
      });
    } else if (type === 'tracks') {
      entity = await this.prismaService.track.findUnique({
        where: { id },
      });
    }

    if (!entity) {
      throw new UnprocessableEntityException(
        `${type} with id ${id} doesn't exist`,
      );
    }
  }

  async createFavorites() {
    const favs = await this.prismaService.favorites.findUnique({
      where: { id: 'favorites' },
    });
    if (!favs) {
      await this.prismaService.favorites.create({
        data: {
          id: 'favorites',
          albums: [],
          artists: [],
          tracks: [],
        },
      });
    }
  }

  async addToFavorites(type: keyof Favorites, id: string) {
    const favorites = await this.prismaService.favorites.findUnique({
      where: { id: 'favorites' },
    });
    await this.checkEntityExists(type, id);
    await this.prismaService.favorites.update({
      where: { id: 'favorites' },
      data: {
        albums: type === 'albums' ? [...favorites.albums, id] : undefined,
        artists: type === 'artists' ? [...favorites.artists, id] : undefined,
        tracks: type === 'tracks' ? [...favorites.tracks, id] : undefined,
      },
    });
  }

  // TODO: see if there are tools in prisma to fill objects using relation
  async findAll() {
    const allFavorites = await this.prismaService.favorites.findUnique({
      where: { id: 'favorites' },
    });
    await Promise.all(
      allFavorites.albums.map(async (entityId: string, index: number) => {
        const entity = await this.prismaService.album.findUnique({
          where: { id: entityId },
        });
        if (entity) {
          (allFavorites as unknown as FavoritesResponse).albums[index] = entity;
        }
      }),
    );
    await Promise.all(
      allFavorites.artists.map(async (entityId: string, index: number) => {
        const entity = await this.prismaService.artist.findUnique({
          where: { id: entityId },
        });
        if (entity) {
          (allFavorites as unknown as FavoritesResponse).artists[index] =
            entity;
        }
      }),
    );
    await Promise.all(
      allFavorites.tracks.map(async (entityId: string, index: number) => {
        const entity = await this.prismaService.track.findUnique({
          where: { id: entityId },
        });
        if (entity) {
          (allFavorites as unknown as FavoritesResponse).tracks[index] = entity;
        }
      }),
    );
    return allFavorites;
  }

  async deleteArtistFromFavorites(id: string) {
    const allFavorites = await this.prismaService.favorites.findUnique({
      where: { id: 'favorites' },
    });
    await this.prismaService.favorites.update({
      where: { id: 'favorites' },
      data: {
        artists: allFavorites.artists.filter(
          (artistId) => artistId && artistId !== id,
        ),
      },
    });
  }

  async deleteAlbumFromFavorites(id: string) {
    const allFavorites = await this.prismaService.favorites.findUnique({
      where: { id: 'favorites' },
    });
    await this.prismaService.favorites.update({
      where: { id: 'favorites' },
      data: {
        albums: allFavorites.albums.filter(
          (albumId) => albumId && albumId !== id,
        ),
      },
    });
  }

  async deleteTrackFromFavorites(id: string) {
    const allFavorites = await this.prismaService.favorites.findUnique({
      where: { id: 'favorites' },
    });
    await this.prismaService.favorites.update({
      where: { id: 'favorites' },
      data: {
        tracks: allFavorites.tracks.filter(
          (trackId) => trackId && trackId !== id,
        ),
      },
    });
  }
}
