import { Status } from '@/shared/enums/status.enum';
import { TransferTypes } from '@/shared/models/schemas/transfertype.schema';
import { handleErrorsOnServices } from '@/shared/utilities/helpers';
import { UrlValidator } from '@/shared/validators/urlValidator.dto';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';

@Injectable()
export class TransfertypeService {
  constructor(
    @InjectModel(TransferTypes.name)
    private readonly transferModel: Model<TransferTypes>,
  ) {}

  async getTransferType({
    id,
  }: UrlValidator): Promise<TransferTypes & { _id: ObjectId }> {
    try {
      const transferType = (await this.transferModel
        .findById(id)
        .select({ __v: 0, createdAt: 0 })
        .lean()) as TransferTypes & { _id: ObjectId };
      if (!transferType) {
        throw new NotFoundException('Transfer type not found.');
      }
      return transferType;
    } catch (error) {
      throw handleErrorsOnServices('Error getting transfer type.', error);
    }
  }

  async mapTransferTypeNames(names: string[]): Promise<string[]> {
    try {
      if (!names.length) {
        throw new BadRequestException('No transfer types provided.');
      }
      const transferTypes = [];
      for (const name of names) {
        const transferType = await this.transferModel
          .findOne({ name })
          .select({ _id: 1 })
          .lean();
        if (!transferType) {
          throw new NotFoundException(`Transfer type ${name} not found.`);
        }
        transferTypes.push(transferType._id.toString());
      }
      return transferTypes;
    } catch (error) {
      throw handleErrorsOnServices('Error mapping transfer types.', error);
    }
  }

  async insertTransferTypesBunch(transferTypes: string[]): Promise<void> {
    try {
      await this.transferModel.insertMany(
        transferTypes.map((name) => ({ name, status: Status.ACTIVE })),
      );
    } catch (error) {
      throw handleErrorsOnServices('Error inserting transfer types.', error);
    }
  }
}
