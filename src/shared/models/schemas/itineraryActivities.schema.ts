import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Classifications } from './classification.schema';
import { ItineraryActivityStatus } from '@/shared/enums/itineraries/itinerary.status.enum';

@Schema({
  timestamps: true,
})
export class ItineraryActivities {
  @Prop({ type: String, required: true })
  activityName: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Classifications' }] })
  classification: Classifications | Types.ObjectId;

  @Prop({ type: Boolean, default: false })
  hasAdditionalCost: boolean;

  @Prop({
    type: Number,
    required: false,
    validate: {
      validator: function (
        this: ItineraryActivities,
        value: boolean | undefined,
      ) {
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

  @Prop({
    type: String,
    default: ItineraryActivityStatus.ACTIVE,
    enum: ItineraryActivityStatus,
  })
  status: ItineraryActivityStatus;

  constructor(
    activityName: string,
    classification: Classifications,
    hasAdditionalCost: boolean,
    additionalCost: number,
    startDate: Date,
    startTime: string,
    endDate: Date,
    endTime: string,
    status: ItineraryActivityStatus,
  ) {
    this.activityName = activityName;
    this.classification = classification;
    this.hasAdditionalCost = hasAdditionalCost;
    this.additionalCost = additionalCost;
    this.startDate = startDate;
    this.startTime = startTime;
    this.endDate = endDate;
    this.endTime = endTime;
    this.status = status;
  }
}

export type ItineraryActivitiesDocument = HydratedDocument<ItineraryActivities>;
export const ItineraryActivitiesSchema =
  SchemaFactory.createForClass(ItineraryActivities);
