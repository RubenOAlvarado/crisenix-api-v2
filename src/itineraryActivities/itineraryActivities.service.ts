import { ItineraryActivityStatus } from '@/shared/enums/itineraries/itinerary.status.enum';
import { CreateItineraryActivityDto } from '@/shared/models/dtos/request/itineraryActivity/createitineraryactivity.dto';
import { ItineraryActivityStatusDto } from '@/shared/models/dtos/request/itineraryActivity/itinerarystatus.dto';
import { UpdateItineraryActivityDto } from '@/shared/models/dtos/request/itineraryActivity/updateitinerary.dto';
import { QueryDTO } from '@/shared/models/dtos/searcher/query.dto';
import { IdValidator } from '@/shared/models/dtos/validators/id.validator';
import { ItineraryActivities } from '@/shared/models/schemas/itineraryActivities.schema';
import {
  createPaginatedObject,
  handleErrorsOnServices,
} from '@/shared/utilities/helpers';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ItineraryActivitiesService {
  constructor(
    @InjectModel(ItineraryActivities.name)
    private readonly activitiesModel: Model<ItineraryActivities>,
  ) {}

  async create(createActivityDto: CreateItineraryActivityDto) {
    try {
      const createdActivity = new this.activitiesModel(createActivityDto);
      return await createdActivity.save();
    } catch (error) {
      throw handleErrorsOnServices(
        'Something went wrong creating activity.',
        error,
      );
    }
  }

  async findAll({ page, limit, status }: QueryDTO) {
    try {
      const query = status ? { status } : {};
      const docs = await this.activitiesModel
        .find(query)
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .lean();
      if (!docs.length) throw new NotFoundException('Activities not found.');
      const total = await this.activitiesModel.countDocuments(query).exec();
      return createPaginatedObject(docs, total, page, limit);
    } catch (error) {
      throw handleErrorsOnServices(
        'Something went wrong finding activities.',
        error,
      );
    }
  }

  async findOne({ id }: IdValidator) {
    try {
      const activity = await this.activitiesModel.findById(id);
      if (!activity) throw new NotFoundException('Activity not found.');
      return activity;
    } catch (error) {
      throw handleErrorsOnServices(
        'Something went wrong finding activity.',
        error,
      );
    }
  }

  async update(
    { id }: IdValidator,
    updateItineraryActivityDto: UpdateItineraryActivityDto,
  ) {
    try {
      const updatedActivity = await this.activitiesModel.findByIdAndUpdate(
        id,
        updateItineraryActivityDto,
        { new: true },
      );
      if (!updatedActivity) throw new NotFoundException('Activity not found.');
      return updatedActivity;
    } catch (error) {
      throw handleErrorsOnServices(
        'Something went wrong updating activity.',
        error,
      );
    }
  }

  async changeStatus(
    { id }: IdValidator,
    { status }: ItineraryActivityStatusDto,
  ) {
    try {
      const itineraryToUpdate = await this.validateItineraryActivity(
        id,
        status,
      );
      itineraryToUpdate.status = status;
      return await itineraryToUpdate.save();
    } catch (error) {
      throw handleErrorsOnServices(
        'Something went wrong updating activity status.',
        error,
      );
    }
  }

  private async validateItineraryActivity(
    id: string,
    status: ItineraryActivityStatus,
  ) {
    const itinerary = await this.activitiesModel.findById(id);
    if (!itinerary) {
      throw new NotFoundException('Activity not found.');
    }

    switch (status) {
      case ItineraryActivityStatus.ACTIVE:
        if (itinerary.status !== ItineraryActivityStatus.INACTIVE) {
          throw new NotFoundException('Activity status must be inactive.');
        }
        break;
      case ItineraryActivityStatus.INACTIVE:
        if (itinerary.status !== ItineraryActivityStatus.ACTIVE) {
          throw new NotFoundException('Activity status must be active.');
        }
        break;
      case ItineraryActivityStatus.CANCELED:
        if (itinerary.status !== ItineraryActivityStatus.ACTIVE) {
          throw new NotFoundException(
            'Activity status must be active to be cancelled.',
          );
        }
        break;
      case ItineraryActivityStatus.INPROGRESS:
        if (itinerary.status !== ItineraryActivityStatus.ACTIVE) {
          throw new NotFoundException(
            'Activity status must be active to be in progress.',
          );
        }
        break;
      default:
        throw new NotFoundException('Invalid activity status.');
    }

    return itinerary;
  }
}
