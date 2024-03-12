import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateArtistDto, UpdateArtistDto } from './dto/artist';
import { TrackService } from 'src/track/track.service';
import { AlbumService } from 'src/album/album.service';
import { DbService } from 'src/db/db.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ArtistService {
  @Inject(TrackService)
  private readonly trackService: TrackService;
  @Inject(AlbumService)
  private readonly albumService: AlbumService;
  @Inject(DbService)
  private readonly dbService: DbService;
  @Inject(PrismaService)
  private readonly prismaService: PrismaService;

  async createArtist(artist: CreateArtistDto) {
    return await this.prismaService.artist.create({ data: artist });
  }

  async deleteArtist(id: string) {
    const artist = await this.prismaService.artist.findUnique({
      where: { id },
    });
    if (!artist) {
      throw new NotFoundException(`Artist with id ${id} not found`);
    }
    this.albumService.removeArtistId(id);
    this.trackService.removeArtistId(id);
    await this.prismaService.artist.delete({ where: { id } });
    this.dbService.removeFromFavorites({ type: 'artists', id });
  }

  async updateArtist(id: string, data: UpdateArtistDto) {
    const artist = await this.prismaService.artist.findUnique({
      where: { id },
    });
    if (!artist) {
      throw new NotFoundException(`Artist with id ${id} not found`);
    }
    return await this.prismaService.artist.update({ where: { id }, data });
  }

  async findAll() {
    return await this.prismaService.artist.findMany();
  }

  async findById(id: string) {
    const artist = await this.prismaService.artist.findUnique({
      where: { id },
    });
    if (!artist) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return artist;
  }
}
