import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { RolesService } from './roles.service';
import { CreateCatalogDTO } from 'src/shared/models/dtos/catalogs/createCatalog.dto';
import { StatusDTO } from 'src/shared/dtos/statusparam.dto';
import { UrlValidator } from 'src/shared/validators/urlValidator.dto';
import { UpdateCatalogDTO } from 'src/shared/models/dtos/catalogs/updateCatalog.dto';

@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  constructor(private rolesService: RolesService) {}

  @ApiResponse({ status: HttpStatus.CREATED })
  @Post('create')
  async createRole(@Body() createRoleDTO: CreateCatalogDTO, @Res() res) {
    const newRole = await this.rolesService.createRole(createRoleDTO);

    return res.status(HttpStatus.CREATED).json({
      status: HttpStatus.CREATED,
      message: 'Role created',
      data: newRole,
    });
  }

  @ApiResponse({ status: HttpStatus.OK })
  @Get()
  async getAllRoles(@Res() res, @Query() query?: StatusDTO) {
    const roles = await this.rolesService.getRoles(query);

    if (!roles) throw new NotFoundException('No Roles registered');

    return res.status(HttpStatus.OK).json({
      status: HttpStatus.OK,
      data: roles,
    });
  }

  @ApiResponse({ status: HttpStatus.OK })
  @Get(':id')
  async findRole(@Res() res, @Param() params: UrlValidator) {
    const role = await this.rolesService.getRoleById(params);

    if (!role)
      throw new NotFoundException(`Role with id: ${params.id} doesn't exist`);

    return res.status(HttpStatus.OK).json({
      status: HttpStatus.OK,
      message: `Role with id: ${params.id} found`,
      data: role,
    });
  }

  @ApiResponse({ status: HttpStatus.OK })
  @Put(':id')
  async updateRole(
    @Body() updateRoleDTO: UpdateCatalogDTO,
    @Param() params: UrlValidator,
    @Res() res,
  ) {
    const updatedRole = await this.rolesService.updateRole(
      updateRoleDTO,
      params,
    );

    return res.status(HttpStatus.OK).json({
      status: HttpStatus.OK,
      message: `Role ${updatedRole.description} updated`,
      data: updatedRole,
    });
  }

  @ApiResponse({ status: HttpStatus.OK })
  @Delete(':id')
  async inactiveRole(@Res() res, @Param() params: UrlValidator) {
    await this.rolesService.inactivateRole(params);

    return res.status(HttpStatus.OK).json({
      status: HttpStatus.OK,
      message: `Role with id: ${params.id} was inactivated`,
    });
  }

  @ApiResponse({ status: HttpStatus.OK })
  @Patch('reactivate/:id')
  async reactivateRole(@Res() res, @Param() params: UrlValidator) {
    const reactivatedRole = await this.rolesService.reactiveRole(params);

    return res.status(HttpStatus.OK).json({
      status: HttpStatus.OK,
      reactivatedRole,
    });
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
