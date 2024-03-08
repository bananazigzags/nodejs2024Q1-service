import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTrackDto, Track, TrackId, UpdateTrackDto } from './dto/track';
import { v4 as uuid } from 'uuid';

@Injectable()
export class TrackService {
  private tracks: { [id: TrackId['id']]: Track } = {};

  createTrack(track: CreateTrackDto) {
    const id: string = uuid();
    this.tracks[id] = {
      ...track,
      id,
    };
    return this.tracks[id];
  }

  deleteTrack(id: string) {
    const user = this.findById(id);
    if (!user) {
      throw new NotFoundException(`Track with id ${id} not found`);
    }
    delete this.tracks[id];
  }

  updateTrack(id: string, data: UpdateTrackDto) {
    const user = this.findById(id);
    if (!user) {
      throw new NotFoundException(`Track with id ${id} not found`);
    }
    Object.keys(data).forEach((key) => {
      this.tracks[id][key] = data[key];
    });
    return this.tracks[id];
  }

  findAll(): Track[] {
    return Object.values(this.tracks);
  }

  findById(id: string): Track {
    return this.tracks[id];
  }

  removeAlbumId(albumId: string) {
    const listForRemoval = this.findByAlbumId(albumId);
    listForRemoval.forEach((track) => (track.albumId = null));
  }

  findByAlbumId(id: string): Track[] {
    return this.findAll().filter((track) => track.albumId === id);
  }

  removeArtistId(artistId: string) {
    const listForRemoval = this.findByArtistId(artistId);
    listForRemoval.forEach((track) => (track.artistId = null));
  }

  findByArtistId(id: string): Track[] {
    return this.findAll().filter((track) => track.artistId === id);
  }
}
