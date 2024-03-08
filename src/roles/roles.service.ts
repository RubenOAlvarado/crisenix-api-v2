import { InjectModel } from '@nestjs/mongoose';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { Roles } from 'src/shared/models/schemas/roles.schema';
import { StatusDTO } from 'src/shared/dtos/statusparam.dto';
import { UrlValidator } from 'src/shared/validators/urlValidator.dto';
import { Status } from 'src/shared/enums/status.enum';
import { CreateRoleDTO } from '@/shared/models/dtos/role/createrole.dto';
import { UpdateRoleDTO } from '@/shared/models/dtos/role/updaterole.dto';
import { DescriptionDTO } from '@/shared/models/dtos/role/findByDescription.dto';
import { RolesLean } from '@/shared/interfaces/roles/roles.lean.interface';
import { handleErrorsOnServices } from '@/shared/utilities/helpers';

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

  async getRoles({ status }: StatusDTO): Promise<Array<RolesLean>> {
    try {
      this.logger.debug(
        status ? `Looking roles with status ${status}` : `Looking roles`,
      );
      const query = status ? { status } : {};
      const roles = await this.roleModel
        .find(query)
        .select({ __v: 0, createdAt: 0 })
        .lean();
      if (!roles) throw new NotFoundException('No roles registered.');
      return roles;
    } catch (e) {
      this.logger.error(`Something went wrong looking roles: ${e}`);
      throw handleErrorsOnServices('Something went wrong looking roles.', e);
    }
  }

  async getRoleById({ id }: UrlValidator): Promise<RolesLean> {
    try {
      this.logger.debug('Looking role by his id');
      const role = await this.roleModel
        .findById(id)
        .select({ __v: 0, createdAt: 0 })
        .lean();
      if (!role) throw new NotFoundException(`Role not found.`);
      return role;
    } catch (e) {
      this.logger.error(`Something went wrong while looking role by id: ${e}`);
      throw handleErrorsOnServices(
        'Something went wrong while looking role by id.',
        e,
      );
    }
  }

  async updateRole(
    updateRoleDTO: UpdateRoleDTO,
    { id }: UrlValidator,
  ): Promise<Roles | undefined> {
    try {
      if (await this.validateRole(id)) {
        const updatedRole = await this.roleModel.findByIdAndUpdate(
          id,
          updateRoleDTO,
          {
            new: true,
          },
        );
        if (!updatedRole) throw new NotFoundException(`Role not found.`);
        return updatedRole;
      }
      return;
    } catch (e) {
      this.logger.error(`Something went wrong updating role: ${e}`);
      throw handleErrorsOnServices('Something went wrong updating role.', e);
    }
  }

  async inactivateRole({ id }: UrlValidator): Promise<void> {
    try {
      if (await this.validateRole(id)) {
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
      throw handleErrorsOnServices('Something went wrong validating Role.', e);
    }
  }

  async reactiveRole({ id }: UrlValidator): Promise<void> {
    try {
      const validRole = await this.getRoleById({ id });

      if (validRole) {
        if (validRole.status === Status.INACTIVE) {
          await this.roleModel.findByIdAndUpdate(
            id,
            { status: Status.ACTIVE },
            { new: true },
          );
        } else {
          throw new BadRequestException('Role already active.');
        }
      } else {
        throw new NotFoundException(`Role not found`);
      }
    } catch (e) {
      this.logger.error(`Something went wrong reactivating role: ${e}`);
      throw handleErrorsOnServices(
        'Something went wrong reactivating Role.',
        e,
      );
    }
  }

  async getRoleByDescription({
    description,
  }: DescriptionDTO): Promise<RolesLean> {
    try {
      const validRole = await this.roleModel
        .findOne({ description, status: Status.ACTIVE })
        .select({ __v: 0, createdAt: 0 })
        .lean();

      if (!validRole)
        throw new NotFoundException(
          `Role ${description} was not registered on DB.`,
        );

      return validRole;
    } catch (error) {
      const errorMessage = `Error looking up role description: ${error}`;
      this.logger.error(errorMessage);
      throw handleErrorsOnServices('Error looking up role description.', error);
    }
  }
}
