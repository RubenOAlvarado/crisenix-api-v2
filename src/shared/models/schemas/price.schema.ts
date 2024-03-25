import { Prop } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { OriginCity } from './origincity.schema';

export class Prices {
  // ref: 'OriginCity'
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'OriginCity',
    required: true,
  })
  city: OriginCity;

  @Prop({ required: true, enum: ['MXN', 'USD'], default: 'MXN' })
  currency: string;

  @Prop()
  general?: number;

  @Prop()
  singleBase?: number;

  @Prop()
  doubleBase?: number;

  @Prop()
  tripleBase?: number;

  @Prop()
  quadrupleBase?: number;

  @Prop()
  minor?: number;

  @Prop()
  inapam?: number;

  @Prop({ enum: ['Activo', 'Inactivo'], default: 'Activo' })
  status: string;

  @Prop({ default: Date.now })
  createdAt?: Date;

  constructor(
    city: OriginCity,
    currency: string,
    general: number,
    singleBase: number,
    doubleBase: number,
    tripleBase: number,
    quadrupleBase: number,
    minor: number,
    inapam: number,
    status: string,
  ) {
    this.city = city;
    this.currency = currency;
    this.general = general;
    this.singleBase = singleBase;
    this.doubleBase = doubleBase;
    this.tripleBase = tripleBase;
    this.quadrupleBase = quadrupleBase;
    this.minor = minor;
    this.inapam = inapam;
    this.status = status;
  }
}
