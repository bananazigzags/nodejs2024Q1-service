import { OmitType, PartialType, PickType } from '@nestjs/mapped-types';
import { IsUUID, IsString, IsNotEmpty, IsBoolean } from 'class-validator';

export class Artist {
  @IsUUID(4)
  id: string; // uuid v4

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsBoolean()
  grammy: boolean;
}

export class CreateArtostDto extends OmitType(Artist, ['id'] as const) {}

export class UpdateArtistDto extends PartialType(CreateArtostDto) {}

export class ArtistId extends PickType(Artist, ['id'] as const) {}
