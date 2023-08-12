import { IsMongoId, IsNotEmpty, IsObject, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEventLogDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsMongoId()
  serviceId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  service: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  move: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  user: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsObject()
  registry: any;

  constructor(
    serviceId: string,
    service: string,
    move: string,
    user: string,
    registry: any,
  ) {
    this.serviceId = serviceId;
    this.service = service;
    this.move = move;
    this.user = user;
    this.registry = registry;
  }
}
