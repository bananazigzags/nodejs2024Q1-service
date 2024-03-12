import { Module } from '@nestjs/common';
import { AlbumController } from './album.controller';
import { AlbumService } from './album.service';
import { TrackModule } from 'src/track/track.module';
import { DbModule } from 'src/db/db.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [AlbumController],
  providers: [AlbumService],
  imports: [TrackModule, DbModule, PrismaModule],
  exports: [AlbumService],
})
export class AlbumModule {}
