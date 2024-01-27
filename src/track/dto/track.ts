import { OmitType, PartialType, PickType } from '@nestjs/mapped-types';
import {
  IsUUID,
  IsString,
  IsInt,
  IsNotEmpty,
  ValidateIf,
} from 'class-validator';

export class Track {
  @IsUUID(4)
  id: string; // uuid v4

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @ValidateIf((_, value) => value !== null)
  artistId: string | null; // refers to Artist

  @IsString()
  @ValidateIf((_, value) => value !== null)
  albumId: string | null; // refers to Album

  @IsInt()
  @IsNotEmpty()
  duration: number; // integer number
}

export class CreateTrackDto extends OmitType(Track, ['id'] as const) {}

export class UpdateTrackDto extends PartialType(CreateTrackDto) {}

export class TrackId extends PickType(Track, ['id'] as const) {}
