import { Status } from '@/shared/enums/status.enum';
import { TransferTypes } from '@/shared/models/schemas/transfertype.schema';
import { handleErrorsOnServices } from '@/shared/utilities/helpers';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class TransfertypeService {
  constructor(
    @InjectModel(TransferTypes.name)
    private readonly transferModel: Model<TransferTypes>,
  ) {}

  async mapTransferTypeNames(names: string[]): Promise<string[]> {
    try {
      if (!names.length) return [];

      const mappedTransferTypes = await Promise.all(
        names.map(async (name) => {
          const transferType = await this.transferModel
            .findOne({ name })
            .lean();

          if (!transferType) {
            const createdtransferType = await this.transferModel.create({
              name,
              status: Status.ACTIVE,
            });
            return createdtransferType._id.toString();
          }

          return transferType._id.toString();
        }),
      );

      return mappedTransferTypes;
    } catch (error) {
      throw handleErrorsOnServices('Error mapping transfer types.', error);
    }
  }
}
