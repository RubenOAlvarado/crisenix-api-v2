import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ResponseOriginCityDTO } from '../originCity/responseorigincity.dto';
import { ResponseAboardPointDTO } from '../aboardpoint/responseaboardpoint.dto';

export class ResponsePassengerDTO {
  @ApiProperty({
    description: 'Passenger id',
    example: '123',
  })
  _id: string;

  @ApiProperty({
    description: 'Passenger room number',
    example: '123',
  })
  room: string;

  @ApiProperty({
    description: 'Passenger name',
    example: 'John',
  })
  name: string;

  @ApiProperty({
    description: 'Passenger last name',
    example: 'Doe',
  })
  lastName: string;

  @ApiPropertyOptional({
    description: 'Passenger second last name',
    example: 'Doe',
  })
  secondLastName?: string;

  @ApiProperty({
    description: 'Passenger origin city',
  })
  originCity: ResponseOriginCityDTO;

  @ApiProperty({
    description: 'Passenger aboard point',
  })
  aboardPoint: ResponseAboardPointDTO;

  @ApiProperty({
    description: 'Payed price by the passenger',
  })
  // TODO: create response price dto
  price: string;

  @ApiPropertyOptional({
    description: 'Passenger passport photo url if required',
  })
  passportPhotoUrl?: string;

  @ApiPropertyOptional({
    description: 'Passenger visa photo url if required',
  })
  visaPhoto?: string;

  @ApiPropertyOptional({
    description: 'Passenger seat number if required',
    example: '1A',
  })
  seat?: string;

  constructor(
    _id: string,
    name: string,
    lastName: string,
    originCity: ResponseOriginCityDTO,
    aboardPoint: ResponseAboardPointDTO,
    price: string,
    room: string,
  ) {
    this._id = _id;
    this.name = name;
    this.lastName = lastName;
    this.originCity = originCity;
    this.aboardPoint = aboardPoint;
    this.price = price;
    this.room = room;
  }
}
