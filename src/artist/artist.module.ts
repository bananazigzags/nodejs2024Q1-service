import { Module } from '@nestjs/common';
import { ArtistController } from './artist.controller';
import { ArtistService } from './artist.service';
import { TrackModule } from 'src/track/track.module';
import { AlbumModule } from 'src/album/album.module';

@Module({
  controllers: [ArtistController],
  providers: [ArtistService],
  exports: [ArtistService],
  imports: [TrackModule, AlbumModule],
})
export class ArtistModule {}
