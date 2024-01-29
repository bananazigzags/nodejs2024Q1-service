import { OmitType, PartialType, PickType } from '@nestjs/mapped-types';
import {
  IsUUID,
  IsString,
  IsInt,
  IsNotEmpty,
  ValidateIf,
} from 'class-validator';

export class Album {
  @IsUUID()
  id: string; // uuid v4

  @IsNotEmpty()
  name: string;

  @IsInt()
  @IsNotEmpty()
  year: number;

  @IsString()
  @ValidateIf((_, value) => value !== null)
  artistId: string | null; // refers to Artist
}

export class CreateAlbumDto extends OmitType(Album, ['id'] as const) {}

export class UpdateAlbumDto extends PartialType(CreateAlbumDto) {}

export class AlbumId extends PickType(Album, ['id'] as const) {}
