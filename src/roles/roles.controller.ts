import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { RolesService } from './roles.service';
import { StatusDTO } from '@/shared/models/dtos/searcher/statusparam.dto';
import { IdValidator } from '@/shared/models/dtos/validators/id.validator';
import { ResponseRoleDTO } from '@/shared/models/dtos/response/role/response-role.dto';
import { CreateRoleDTO } from '@/shared/models/dtos/request/role/createrole.dto';
import { UpdateRoleDTO } from '@/shared/models/dtos/request/role/updaterole.dto';
import { DescriptionDTO } from '@/shared/models/dtos/request/role/findByDescription.dto';
import { Public } from '@/auth/public.decorator';

@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  constructor(private rolesService: RolesService) {}

  @ApiOperation({ summary: 'Create a new role' })
  @ApiCreatedResponse({
    type: ResponseRoleDTO,
    description: 'Role created successfully.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong creating role.',
  })
  @Post()
  @ApiBody({ type: CreateRoleDTO })
  async createRole(@Body() createRoleDTO: CreateRoleDTO) {
    return await this.rolesService.createRole(createRoleDTO);
  }

  @ApiOperation({ summary: 'Get all roles' })
  @ApiOkResponse({
    type: ResponseRoleDTO,
    isArray: true,
    description: 'Roles found successfully.',
  })
  @ApiNotFoundResponse({ description: 'No roles registered.' })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong looking roles.',
  })
  @Get()
  async getAllRoles(@Query() query: StatusDTO) {
    return await this.rolesService.getRoles(query);
  }

  @ApiOperation({ summary: 'Get a role by id' })
  @ApiOkResponse({
    type: ResponseRoleDTO,
    description: 'Role found successfully.',
  })
  @ApiNotFoundResponse({ description: 'Role not found.' })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong looking role.',
  })
  @Public()
  @Get(':id')
  async findRole(@Param() params: IdValidator) {
    return await this.rolesService.getRoleById(params);
  }

  @ApiOperation({ summary: 'Update a role' })
  @ApiOkResponse({
    type: String,
    description: 'Role updated successfully.',
  })
  @ApiNotFoundResponse({ description: 'Role not found.' })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong updating role.',
  })
  @Put(':id')
  @ApiBody({ type: UpdateRoleDTO })
  async updateRole(
    @Body() updateRoleDTO: UpdateRoleDTO,
    @Param() params: IdValidator,
  ) {
    await this.rolesService.updateRole(updateRoleDTO, params);
    return 'Role updated successfully.';
  }

  @ApiOperation({ summary: 'Change the status of a role' })
  @ApiOkResponse({
    type: String,
    description: 'Role updated successfully.',
  })
  @ApiNotFoundResponse({ description: 'Role not found.' })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong updating role.',
  })
  @ApiBadRequestResponse({ description: 'Role already inactive.' })
  @Patch(':id/changes-status')
  async changeStatus(@Param() params: IdValidator, @Query() query: StatusDTO) {
    await this.rolesService.changeStatus(params, query);
    return 'Role inactivated successfully.';
  }

  @ApiOperation({ summary: 'Get a role by description' })
  @ApiOkResponse({
    type: ResponseRoleDTO,
    description: 'Role found successfully.',
  })
  @ApiNotFoundResponse({ description: 'Role not found.' })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong looking role description.',
  })
  @ApiBadRequestResponse({ description: 'Role must be in active status.' })
  @Get('search/:description')
  async findRoleByDescription(@Param() params: DescriptionDTO) {
    return await this.rolesService.getRoleByDescription(params);
  }
}
