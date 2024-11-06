import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Tours } from './tour.schema';
import { Classifications } from './classification.schema';

@Schema({
  timestamps: true,
})
export class Itineraries {
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Tours' }] })
  tour: Tours;

  @Prop({ type: String, required: true })
  activityName: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Classifications' }] })
  classification: Classifications;

  @Prop({ type: Boolean, default: false })
  hasAdditionalCost: boolean;

  @Prop({
    type: Number,
    required: false,
    validate: {
      validator: function (this: Itineraries, value: boolean | undefined) {
        return this.hasAdditionalCost ? value !== null : true;
      },
      message: 'Additional cost is required when hasAdditionalCost is true',
    },
  })
  additionalCost?: number;

  @Prop({ type: Date, required: true })
  startDate: Date;

  @Prop({ type: String, required: true })
  startTime: string;

  @Prop({ type: Date, required: true })
  endDate: Date;

  @Prop({ type: String, required: true })
  endTime: string;

  constructor(
    tour: Tours,
    activityName: string,
    classification: Classifications,
    hasAdditionalCost: boolean,
    additionalCost: number,
    startDate: Date,
    startTime: string,
    endDate: Date,
    endTime: string,
  ) {
    this.tour = tour;
    this.activityName = activityName;
    this.classification = classification;
    this.hasAdditionalCost = hasAdditionalCost;
    this.additionalCost = additionalCost;
    this.startDate = startDate;
    this.startTime = startTime;
    this.endDate = endDate;
    this.endTime = endTime;
  }
}

export type ItineraryDocument = HydratedDocument<Itineraries>;
export const ItinerarySchema = SchemaFactory.createForClass(Itineraries);
