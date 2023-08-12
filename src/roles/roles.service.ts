import { InjectModel } from '@nestjs/mongoose';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { Roles, RolesDocument } from 'src/shared/models/schemas/roles.schema';
import { StatusDTO } from 'src/shared/dtos/statusparam.dto';
import { UrlValidator } from 'src/shared/validators/urlValidator.dto';
import { Status } from 'src/shared/enums/status.enum';
import { CreateRoleDTO } from '@/shared/models/dtos/role/createrole.dto';
import { UpdateRoleDTO } from '@/shared/models/dtos/role/updaterole.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Roles.name) private readonly roleModel: Model<Roles>,
  ) {}

  private readonly logger = new Logger(RolesService.name);

  async createRole(createRoleDTO: CreateRoleDTO): Promise<Roles> {
    try {
      this.logger.debug('Creating new role');
      const newRole = new this.roleModel(createRoleDTO);
      return newRole.save();
    } catch (e) {
      this.logger.error(`Error creating role: ${e}`);
      throw new InternalServerErrorException('Error creating role');
    }
  }

  async getRoles(query: StatusDTO): Promise<Array<Roles>> {
    try {
      const { status } = query;
      this.logger.debug(
        status ? `Looking roles with status ${status}` : `Looking roles`,
      );
      return status
        ? await this.roleModel.find({ status }).exec()
        : await this.roleModel.find().exec();
    } catch (e) {
      this.logger.error(`Error looking for Roles: ${e}`);
      throw new InternalServerErrorException('Error looking for roles');
    }
  }

  async getRoleById({ id }: UrlValidator): Promise<RolesDocument | null> {
    try {
      this.logger.debug('Looking role by his id');
      const role = await this.roleModel.findById(id).exec();
      return role;
    } catch (e) {
      this.logger.error(`Error looking role: ${e}`);
      throw new InternalServerErrorException('Error looking role');
    }
  }

  async updateRole(
    updateRoleDTO: UpdateRoleDTO,
    { id }: UrlValidator,
  ): Promise<void> {
    try {
      if (await this.validateRole(id)) {
        this.logger.debug('Updating role');
        await this.roleModel.findByIdAndUpdate(id, updateRoleDTO, {
          new: true,
        });
      }
    } catch (e) {
      this.logger.error(`Error updating role: ${e}`);
      throw new InternalServerErrorException('Error updating role');
    }
  }

  async inactivateRole({ id }: UrlValidator): Promise<void> {
    try {
      if (await this.validateRole(id)) {
        this.logger.debug('inactivating role');
        await this.roleModel.findByIdAndUpdate(
          id,
          { status: Status.INACTIVE },
          { new: true },
        );
      }
    } catch (e) {
      this.logger.error(`Error inactivating role: ${e}`);
      throw new InternalServerErrorException('Error inactivating role');
    }
  }

  private async validateRole(id: string): Promise<boolean> {
    try {
      this.logger.debug('Validating Role');
      const validRole = await this.roleModel.findById(id);
      if (!validRole) throw new NotFoundException(`Role ${id} was not found`);
      if (validRole.status !== Status.ACTIVE)
        throw new BadRequestException('Role must be active');

      return true;
    } catch (e) {
      this.logger.error(`Error validating Role: ${e}`);
      if (e instanceof NotFoundException || e instanceof BadRequestException)
        throw e;
      else throw new InternalServerErrorException('Error validating Role');
    }
  }

  async reactiveRole(params: UrlValidator): Promise<void> {
    try {
      const { id } = params;
      const validRole = await this.getRoleById(params);

      if (validRole && validRole.status === Status.INACTIVE) {
        this.logger.debug('Reactivating Role');
        await this.roleModel.findByIdAndUpdate(
          id,
          { status: Status.ACTIVE },
          { new: true },
        );
      } else if (validRole && validRole.status !== Status.INACTIVE) {
        throw new BadRequestException('Role must be inactive');
      } else {
        throw new NotFoundException(`Role ${id} was not found`);
      }
    } catch (e) {
      this.logger.error(`Error reactivating Role: ${e}`);
      if (e instanceof NotFoundException || e instanceof BadRequestException)
        throw e;
      else throw new InternalServerErrorException('Error reactivating Role');
    }
  }

  async validateRoleName(description: string): Promise<RolesDocument> {
    try {
      this.logger.debug('Validating Role');
      const validRole = await this.roleModel.findOne({ description }).exec();
      if (!validRole)
        throw new NotFoundException(
          `Role ${description} was not registered on DB`,
        );
      if (validRole.status !== Status.ACTIVE)
        throw new BadRequestException('Role must be active');

      return validRole;
    } catch (e) {
      this.logger.error(`Error validating Role: ${e}`);
      if (e instanceof NotFoundException || e instanceof BadRequestException)
        throw e;
      else throw new InternalServerErrorException('Error validating Role');
    }
  }
}
