import { InjectModel } from '@nestjs/mongoose';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { Roles } from 'src/shared/models/schemas/roles.schema';
import { StatusDTO } from 'src/shared/dtos/statusparam.dto';
import { UrlValidator } from 'src/shared/validators/urlValidator.dto';
import { Status } from 'src/shared/enums/status.enum';
import { RolesLean } from '@/shared/interfaces/roles/roles.lean.interface';
import { handleErrorsOnServices } from '@/shared/utilities/helpers';
import { CreateRoleDTO } from '@/shared/models/dtos/request/role/createrole.dto';
import { UpdateRoleDTO } from '@/shared/models/dtos/request/role/updaterole.dto';
import { DescriptionDTO } from '@/shared/models/dtos/request/role/findByDescription.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Roles.name) private readonly roleModel: Model<Roles>,
  ) {}

  async createRole(createRoleDTO: CreateRoleDTO): Promise<Roles> {
    try {
      const newRole = new this.roleModel(createRoleDTO);
      return newRole.save();
    } catch (e) {
      throw handleErrorsOnServices('Something went wrong creating role.', e);
    }
  }

  async getRoles({ status }: StatusDTO): Promise<Array<RolesLean>> {
    try {
      const query = status ? { status } : {};
      const roles = await this.roleModel
        .find(query)
        .select({ __v: 0, createdAt: 0 })
        .lean()
        .exec();
      if (!roles) throw new NotFoundException('No roles registered.');
      return roles;
    } catch (e) {
      throw handleErrorsOnServices('Something went wrong looking roles.', e);
    }
  }

  async getRoleById({ id }: UrlValidator): Promise<RolesLean> {
    try {
      const role = await this.roleModel
        .findById(id)
        .select({ __v: 0, createdAt: 0 })
        .lean()
        .exec();
      if (!role) throw new NotFoundException(`Role not found.`);
      return role;
    } catch (e) {
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
      throw new InternalServerErrorException('Error inactivating role');
    }
  }

  private async validateRole(id: string): Promise<boolean> {
    try {
      const validRole = await this.roleModel.findById(id);
      if (!validRole) throw new NotFoundException(`Role not found.`);
      if (validRole.status !== Status.ACTIVE)
        throw new BadRequestException('Role must be in active status.');

      return true;
    } catch (e) {
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
      throw handleErrorsOnServices('Error looking up role description.', error);
    }
  }
}
