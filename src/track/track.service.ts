import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTrackDto, Track, TrackId, UpdateTrackDto } from './dto/track';
import { v4 as uuid } from 'uuid';

@Injectable()
export class TrackService {
  private tracks: { [id: TrackId['id']]: Track } = {};

  createTrack(track: CreateTrackDto) {
    const id: string = uuid();
    this.tracks[id as unknown as string] = {
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
  }

  findAll(): Track[] {
    return Object.values(this.tracks);
  }

  findById(id: string): Track {
    return this.tracks[id];
  }
}
