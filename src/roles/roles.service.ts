import { InjectModel } from '@nestjs/mongoose';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { Roles } from 'src/shared/models/schemas/roles.schema';
import { StatusDTO } from '@/shared/models/dtos/searcher/statusparam.dto';
import { IdValidator } from '@/shared/models/dtos/validators/id.validator';
import { Status } from 'src/shared/enums/status.enum';
import { RolesLean } from '@/shared/types/roles/roles.lean.type';
import { handleErrorsOnServices } from '@/shared/utilities/helpers';
import { CreateRoleDTO } from '@/shared/models/dtos/request/role/createrole.dto';
import { UpdateRoleDTO } from '@/shared/models/dtos/request/role/updaterole.dto';
import { DescriptionDTO } from '@/shared/models/dtos/request/role/findByDescription.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Roles.name) private readonly roleModel: Model<Roles>,
  ) {}

  private async validateRole(id: string, status: string = Status.ACTIVE) {
    const role = await this.roleModel.findById(id);
    if (!role) throw new NotFoundException('Role not found.');
    if (status === Status.INACTIVE && role.status !== Status.ACTIVE)
      throw new BadRequestException('Role is already inactive.');
    if (status === Status.ACTIVE && role.status !== Status.INACTIVE)
      throw new BadRequestException('Role is already active.');

    return role;
  }

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

  async getRoleById({ id }: IdValidator): Promise<RolesLean> {
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
    { id }: IdValidator,
  ): Promise<void> {
    try {
      const updatedRole = await this.roleModel.findByIdAndUpdate(
        id,
        updateRoleDTO,
        {
          new: true,
        },
      );
      if (!updatedRole) throw new NotFoundException(`Role not found.`);
    } catch (e) {
      throw handleErrorsOnServices('Something went wrong updating role.', e);
    }
  }

  async changeStatus({ id }: IdValidator, { status }: StatusDTO) {
    try {
      const roleToUpdate = await this.validateRole(id, status);
      roleToUpdate.status =
        status === Status.ACTIVE ? Status.ACTIVE : Status.INACTIVE;
      await roleToUpdate.save();
    } catch (e) {
      throw handleErrorsOnServices('Something went wrong validating Role.', e);
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
