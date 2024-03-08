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
  ApiBearerAuth,
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
import { CreateRoleDTO } from '@/shared/models/dtos/role/createrole.dto';
import { UpdateRoleDTO } from '@/shared/models/dtos/role/updaterole.dto';
import { Roles } from '@/shared/models/schemas/roles.schema';
import { DescriptionDTO } from '@/shared/models/dtos/role/findByDescription.dto';

@ApiTags('Roles')
@ApiBearerAuth()
@Controller('roles')
export class RolesController {
  constructor(private rolesService: RolesService) {}

  @ApiCreatedResponse({
    type: CreateRoleDTO,
    description: 'Role created successfully.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong creating role.',
  })
  @Post('create')
  @ApiBody({ type: CreateRoleDTO })
  async createRole(@Body() createRoleDTO: CreateRoleDTO) {
    return await this.rolesService.createRole(createRoleDTO);
  }

  @ApiOkResponse({
    type: CreateRoleDTO,
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

  @ApiOkResponse({
    type: CreateRoleDTO,
    description: 'Role found successfully.',
  })
  @ApiNotFoundResponse({ description: 'Role not found.' })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong looking role.',
  })
  @Get(':id')
  async findRole(@Param() params: UrlValidator) {
    return await this.rolesService.getRoleById(params);
  }

  @ApiOkResponse({
    type: CreateRoleDTO,
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
    type: Roles,
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

  /* @ApiResponse({ status: 201 })
  @Post('load')
  @UseInterceptors(
    FileInterceptor('file', {
      dest: './uploads',
      fileFilter: excelFileFilter,
    }),
  )
  async loadCatalog(@UploadedFile() file, @Res() res) {
    const loaded = await this.rolesService.loadCatalog(file);

    return res.status(HttpStatus.CREATED).json({
      message: 'Roles loaded',
      loaded,
    });
  } */
}
