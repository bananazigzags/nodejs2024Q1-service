import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAlbumDto, UpdateAlbumDto } from './dto/album';
import { TrackService } from 'src/track/track.service';
import { DbService } from 'src/db/db.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AlbumService {
  @Inject(TrackService)
  private readonly trackService: TrackService;
  @Inject(DbService)
  private readonly dbService: DbService;
  @Inject(PrismaService)
  private readonly prismaService: PrismaService;

  async createAlbum(album: CreateAlbumDto) {
    return await this.prismaService.album.create({ data: album });
  }

  async deleteAlbum(id: string) {
    const album = await this.prismaService.album.findUnique({
      where: { id },
    });
    if (!album) {
      throw new NotFoundException(`Album with id ${id} not found`);
    }
    await this.prismaService.album.delete({ where: { id } });
    await this.trackService.removeAlbumId(id);
    this.dbService.removeFromFavorites({ type: 'albums', id });
  }

  async updateAlbum(id: string, data: UpdateAlbumDto) {
    const album = await this.prismaService.album.findUnique({
      where: { id },
    });
    if (!album) {
      throw new NotFoundException(`Album with id ${id} not found`);
    }
    return await this.prismaService.album.update({ where: { id }, data });
  }

  async findAll() {
    return await this.prismaService.album.findMany();
  }

  async findById(id: string) {
    const album = await this.prismaService.album.findUnique({
      where: { id },
    });
    if (!album) {
      throw new NotFoundException(`Album with id ${id} not found`);
    }
    return album;
  }

  async removeArtistId(artistId: string) {
    const listForRemoval = await this.findByArtistId(artistId);
    await Promise.all(
      listForRemoval.map((album) =>
        this.prismaService.album.update({
          where: { id: album.id },
          data: { artistId: null },
        }),
      ),
    );
  }

  async findByArtistId(id: string) {
    const artists = await this.findAll();
    return artists.filter((album) => album.artistId === id);
  }
}
