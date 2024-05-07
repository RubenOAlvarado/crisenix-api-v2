import { Prop } from '@nestjs/mongoose';

export class Lodging {
  @Prop()
  city: string;

  @Prop()
  hotel: string;

  @Prop({
    enum: ['Tentativo', 'Previsto', 'Definitivo'],
    index: true,
  })
  status: string;

  @Prop()
  address: string;

  @Prop()
  phone: string;

  @Prop()
  nights: number;

  @Prop()
  checkIn: Date;

  @Prop()
  checkOut: Date;

  @Prop()
  single: number;

  @Prop()
  singleBase: number;

  @Prop()
  doubleBase: number;

  @Prop()
  tripleBase: number;

  @Prop()
  quadrupleBase: number;

  @Prop()
  minor: number;

  @Prop()
  inapam: number;

  constructor(
    city: string,
    hotel: string,
    status: string,
    address: string,
    phone: string,
    nights: number,
    checkIn: Date,
    checkOut: Date,
    single: number,
    singleBase: number,
    doubleBase: number,
    tripleBase: number,
    quadrupleBase: number,
    minor: number,
    inapam: number,
  ) {
    this.city = city;
    this.hotel = hotel;
    this.status = status;
    this.address = address;
    this.phone = phone;
    this.nights = nights;
    this.checkIn = checkIn;
    this.checkOut = checkOut;
    this.single = single;
    this.singleBase = singleBase;
    this.doubleBase = doubleBase;
    this.tripleBase = tripleBase;
    this.quadrupleBase = quadrupleBase;
    this.minor = minor;
    this.inapam = inapam;
  }
}
