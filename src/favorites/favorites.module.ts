import { Module } from '@nestjs/common';
import { FavoritesController } from './favorites.controller';
import { FavoritesService } from './favorites.service';
import { DbModule } from 'src/db/db.module';

@Module({
  controllers: [FavoritesController],
  providers: [FavoritesService],
  imports: [DbModule],
  exports: [FavoritesService],
})
export class FavoritesModule {}
