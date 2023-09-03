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
import { DescriptionDTO } from '@/shared/models/dtos/role/findByDescription.dto';

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
      this.logger.error(`Something went wrong creating role: ${e}`);
      throw new InternalServerErrorException(
        'Something went wrong creating role.',
      );
    }
  }

  async getRoles({ status }: StatusDTO): Promise<Array<Roles>> {
    try {
      this.logger.debug(
        status ? `Looking roles with status ${status}` : `Looking roles`,
      );
      const roles = status
        ? await this.roleModel
            .find({ status })
            .select({ __v: 0, createdAt: 0 })
            .exec()
        : await this.roleModel.find().select({ __v: 0, createdAt: 0 }).exec();
      if (!roles) throw new NotFoundException('No roles registered.');
      return roles;
    } catch (e) {
      this.logger.error(`Something went wrong looking roles: ${e}`);
      if (e instanceof NotFoundException) throw e;
      throw new InternalServerErrorException(
        'Something went wrong looking roles.',
      );
    }
  }

  async getRoleById({ id }: UrlValidator): Promise<RolesDocument> {
    try {
      this.logger.debug('Looking role by his id');
      const role = await this.roleModel
        .findById(id)
        .select({ __v: 0, createdAt: 0 })
        .exec();
      if (!role) throw new NotFoundException(`Role not found.`);
      return role;
    } catch (e) {
      this.logger.error(`Something went wrong while looking role by id: ${e}`);
      if (e instanceof NotFoundException) throw e;
      throw new InternalServerErrorException(
        'Something went wrong while looking role by id.',
      );
    }
  }

  async updateRole(
    updateRoleDTO: UpdateRoleDTO,
    { id }: UrlValidator,
  ): Promise<Roles> {
    try {
      if (await this.validateRole(id)) {
        this.logger.debug('Updating role');
        const updatedRole = await this.roleModel.findByIdAndUpdate(
          id,
          updateRoleDTO,
          {
            new: true,
          },
        );
        if (updatedRole) return updatedRole;
        else throw new NotFoundException(`Role not found.`);
      }
      return {} as Roles;
    } catch (e) {
      this.logger.error(`Something went wrong updating role: ${e}`);
      throw new InternalServerErrorException(
        'Something went wrong updating role.',
      );
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
      if (!validRole) throw new NotFoundException(`Role not found.`);
      if (validRole.status !== Status.ACTIVE)
        throw new BadRequestException('Role must be in active status.');

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
        this.logger.debug('Reactivating role');
        await this.roleModel.findByIdAndUpdate(
          id,
          { status: Status.ACTIVE },
          { new: true },
        );
      } else if (validRole && validRole.status !== Status.INACTIVE) {
        throw new BadRequestException('Role already active.');
      } else {
        throw new NotFoundException(`Role not found`);
      }
    } catch (e) {
      this.logger.error(`Something went wrong reactivating role: ${e}`);
      if (e instanceof NotFoundException || e instanceof BadRequestException)
        throw e;
      else
        throw new InternalServerErrorException(
          'Something went wrong reactivating role.',
        );
    }
  }

  async getRoleByDescription({
    description,
  }: DescriptionDTO): Promise<RolesDocument> {
    try {
      this.logger.debug('Looking role by description.');
      const validRole = await this.roleModel
        .findOne({ description })
        .select({ __v: 0, createdAt: 0 })
        .exec();
      if (!validRole)
        throw new NotFoundException(
          `Role ${description} was not registered on DB`,
        );
      if (validRole.status !== Status.ACTIVE)
        throw new BadRequestException('Role must be in active status.');

      return validRole;
    } catch (e) {
      this.logger.error(`Something went wrong looking role description: ${e}`);
      if (e instanceof NotFoundException || e instanceof BadRequestException)
        throw e;
      else
        throw new InternalServerErrorException(
          'Something went wrong looking role description.',
        );
    }
  }
}
