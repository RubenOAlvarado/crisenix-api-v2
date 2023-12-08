import { Status } from '@/shared/enums/status.enum';
import { TranslationTypes } from '@/shared/models/schemas/translationtype.schema';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class TranslationtypeService {
  constructor(
    @InjectModel(TranslationTypes.name)
    private readonly translationModel: Model<TranslationTypes>,
  ) {}

  private readonly logger = new Logger(TranslationtypeService.name);

  async mapTranslationTypeNames(
    names: string[],
  ): Promise<string[] | undefined> {
    try {
      this.logger.debug(`mapping from name to object id`);
      if (!names.length) return undefined;
      const mappedTranslationTypes = names.map(async (name) => {
        const translationType = await this.translationModel
          .findOne({ name })
          .lean();
        if (!translationType) {
          const createdTranslationType = await this.translationModel.create({
            name,
            status: Status.ACTIVE,
          });
          return createdTranslationType._id.toString();
        }
        return translationType._id.toString();
      });
      return await Promise.all(mappedTranslationTypes);
    } catch (error) {
      this.logger.error(`Error mapping from name to object id: ${error}`);
      throw new InternalServerErrorException(
        'Error mapping from name to object id',
      );
    }
  }
}
