import { CreateEntryDTO } from '@/shared/models/dtos/request/entry/createentry.dto';
import { Entries, EntryDocument } from '@/shared/models/schemas/entry.schema';
import { handleErrorsOnServices } from '@/shared/utilities/helpers';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class EntriesService {
  constructor(
    @InjectModel(Entries.name) private readonly entriesModel: Model<Entries>,
  ) {}

  async create(createEntryDto: CreateEntryDTO) {
    try {
      const createdEntry = new this.entriesModel(createEntryDto);
      return await createdEntry.save();
    } catch (error) {
      throw handleErrorsOnServices('Error creating entry.', error);
    }
  }

  async findByDescription(
    description: string,
  ): Promise<EntryDocument | null | undefined> {
    try {
      return await this.entriesModel.findOne({ description });
    } catch (error) {
      throw handleErrorsOnServices('Error finding entry by name.', error);
    }
  }
}
