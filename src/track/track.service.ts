import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTrackDto, UpdateTrackDto } from './dto/track';
import { DbService } from 'src/db/db.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TrackService {
  @Inject(DbService)
  private readonly dbService: DbService;
  @Inject(PrismaService)
  private readonly prismaService: PrismaService;

  async createTrack(track: CreateTrackDto) {
    return await this.prismaService.track.create({ data: track });
  }

  async deleteTrack(id: string) {
    const track = await this.prismaService.track.findUnique({ where: { id } });
    if (!track) {
      throw new NotFoundException(`Track with id ${id} not found`);
    }
    await this.prismaService.track.delete({ where: { id } });
    this.dbService.removeFromFavorites({ type: 'tracks', id });
  }

  async updateTrack(id: string, data: UpdateTrackDto) {
    const track = await this.prismaService.track.findUnique({ where: { id } });
    if (!track) {
      throw new NotFoundException(`Track with id ${id} not found`);
    }
    return await this.prismaService.track.update({ where: { id }, data });
  }

  async findAll() {
    return await this.prismaService.track.findMany();
  }

  async findById(id: string) {
    return await this.prismaService.track.findUnique({ where: { id } });
  }

  async removeAlbumId(albumId: string) {
    const listForRemoval = await this.findByAlbumId(albumId);
    await Promise.all(
      listForRemoval.map((track) =>
        this.prismaService.track.update({
          where: { id: track.id },
          data: { albumId: null },
        }),
      ),
    );
  }

  async findByAlbumId(id: string) {
    const tracks = await this.findAll();
    return tracks.filter(
      (track) => track.albumId !== null && track.albumId === id,
    );
  }

  async removeArtistId(artistId: string) {
    const listForRemoval = await this.findByArtistId(artistId);
    await Promise.all(
      listForRemoval.map((track) =>
        this.prismaService.track.update({
          where: { id: track.id },
          data: { artistId: null },
        }),
      ),
    );
  }

  async findByArtistId(id: string) {
    const tracks = await this.findAll();
    return tracks.filter(
      (track) => track.artistId !== null && track.artistId === id,
    );
  }
}
