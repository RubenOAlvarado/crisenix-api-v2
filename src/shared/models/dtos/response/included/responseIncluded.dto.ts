import { Entry } from '@/shared/enums/entry.enum';
import { HotelStatus } from '@/shared/enums/hotelstatus.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Types } from 'mongoose';

export class ResponseIncludedDTO {
  @ApiPropertyOptional()
  @Expose()
  _id?: Types.ObjectId;

  @ApiProperty()
  @Expose()
  concept: string;

  @ApiProperty()
  @Expose()
  included: string;

  @ApiProperty()
  @Expose()
  publish: string;

  @ApiProperty()
  @Expose()
  entry: Entry;

  @ApiProperty()
  @Expose()
  status: string;

  @ApiPropertyOptional()
  @Expose()
  city?: string;

  @ApiPropertyOptional()
  @Expose()
  hotel?: string;

  @ApiPropertyOptional()
  @Expose()
  hotelStatus?: HotelStatus;

  @ApiPropertyOptional()
  @Expose()
  hotelAddress?: string;

  @ApiPropertyOptional()
  @Expose()
  phone?: string;

  @ApiPropertyOptional()
  @Expose()
  nights?: number;

  @ApiPropertyOptional()
  @Expose()
  checkIn?: Date;

  @ApiPropertyOptional()
  @Expose()
  checkOut?: Date;

  @ApiPropertyOptional()
  @Expose()
  single?: number;

  @ApiPropertyOptional()
  @Expose()
  singleBase?: number;

  @ApiPropertyOptional()
  @Expose()
  doubleBase?: number;

  @ApiPropertyOptional()
  @Expose()
  tripleBase?: number;

  @ApiPropertyOptional()
  @Expose()
  quadrupleBase?: number;

  @ApiPropertyOptional()
  @Expose()
  minor?: number;

  @ApiPropertyOptional()
  @Expose()
  inpam?: number;

  constructor(
    concept: string,
    included: string,
    publish: string,
    entry: Entry,
    status: string,
  ) {
    this.concept = concept;
    this.included = included;
    this.publish = publish;
    this.entry = entry;
    this.status = status;
  }
}
