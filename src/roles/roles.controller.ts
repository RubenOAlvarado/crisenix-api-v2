import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  // ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RolesService } from './roles.service';
import { StatusDTO } from 'src/shared/dtos/statusparam.dto';
import { UrlValidator } from 'src/shared/validators/urlValidator.dto';
import { ResponseRoleDTO } from '@/shared/models/dtos/response/role/response-role.dto';
import { CreateRoleDTO } from '@/shared/models/dtos/request/role/createrole.dto';
import { UpdateRoleDTO } from '@/shared/models/dtos/request/role/updaterole.dto';
import { DescriptionDTO } from '@/shared/models/dtos/request/role/findByDescription.dto';
import { Public } from '@/auth/public.decorator';

@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  constructor(private rolesService: RolesService) {}

  @ApiCreatedResponse({
    type: ResponseRoleDTO,
    description: 'Role created successfully.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong creating role.',
  })
  @Post()
  @Public()
  @ApiBody({ type: CreateRoleDTO })
  async createRole(@Body() createRoleDTO: CreateRoleDTO) {
    return await this.rolesService.createRole(createRoleDTO);
  }

  @ApiOkResponse({
    type: ResponseRoleDTO,
    isArray: true,
    description: 'Roles found successfully.',
  })
  @ApiNotFoundResponse({ description: 'No roles registered.' })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong looking roles.',
  })
  @Public()
  @Get()
  async getAllRoles(@Query() query: StatusDTO) {
    return await this.rolesService.getRoles(query);
  }

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
  async findRole(@Param() params: UrlValidator) {
    return await this.rolesService.getRoleById(params);
  }

  @ApiOkResponse({
    type: ResponseRoleDTO,
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
    @Param() params: UrlValidator,
  ) {
    return await this.rolesService.updateRole(updateRoleDTO, params);
  }

  @ApiOkResponse({
    type: String,
    description: 'Role updated successfully.',
  })
  @ApiNotFoundResponse({ description: 'Role not found.' })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong updating role.',
  })
  @ApiBadRequestResponse({ description: 'Role already inactive.' })
  @Delete(':id')
  async inactiveRole(@Param() params: UrlValidator) {
    await this.rolesService.inactivateRole(params);
    return 'Role inactivated successfully.';
  }

  @ApiOkResponse({
    type: String,
    description: 'Role reactivated successfully.',
  })
  @ApiNotFoundResponse({ description: 'Role not found.' })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong reactivating role.',
  })
  @ApiBadRequestResponse({ description: 'Role already active.' })
  @Patch('reactivate/:id')
  async reactivateRole(@Param() params: UrlValidator) {
    await this.rolesService.reactiveRole(params);

    return 'Role reactivated successfully.';
  }

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
