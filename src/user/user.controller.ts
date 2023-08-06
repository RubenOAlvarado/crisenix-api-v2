import {
  Controller,
  Res,
  HttpStatus,
  Post,
  Get,
  Param,
  Body,
  Patch,
  Delete,
  NotFoundException,
  Put,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { UpdateUserDTO } from 'src/shared/models/dtos/user/updateuser.dto';
import { UrlValidator } from 'src/shared/validators/urlValidator.dto';
import { CreateUserDTO } from 'src/shared/models/dtos/user/createuser.dto';
import { UpdateWebUserDTO } from 'src/shared/models/dtos/user/updatewebuser.dto';
import { WebUserDTO } from 'src/shared/models/dtos/user/createwebuser.dto';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiResponse({ status: 201 })
  @Post('create')
  async createWebUser(@Res() res, @Body() webUserDTO: WebUserDTO) {
    const newWebUser = await this.userService.createWebUser(
      webUserDTO,
      'develop',
    );

    return res.status(HttpStatus.CREATED).json({
      status: HttpStatus.CREATED,
      message: 'User created',
      data: newWebUser,
    });
  }

  @ApiResponse({ status: 200 })
  @Get('all')
  async getUsers(@Res() res) {
    const users = await this.userService.getDbUsers();

    if (!users) throw new NotFoundException('No users found!');

    return res.status(HttpStatus.OK).json({
      status: HttpStatus.OK,
      data: users,
    });
  }

  @ApiResponse({ status: 200 })
  @Put(':id')
  async updateWebUser(
    @Res() res,
    @Param() params: UrlValidator,
    @Body() updateWebUserDTO: UpdateWebUserDTO,
  ) {
    const updatedUser = await this.userService.updateWebUser(
      params,
      updateWebUserDTO,
      'develop',
    );

    if (!updatedUser)
      throw new NotFoundException(`User with id ${params.id} not found`);

    return res.status(HttpStatus.OK).json({
      status: HttpStatus.OK,
      message: `User ${params.id} updated`,
      data: updatedUser,
    });
  }

  @ApiResponse({ status: 200 })
  @Delete(':id')
  async deleteWebUser(@Res() res, @Param() params: UrlValidator) {
    await this.userService.deletedWebUser(params, 'develop');

    return res.status(HttpStatus.OK).json({
      status: HttpStatus.OK,
      message: `User ${params.id} deleted`,
    });
  }

  @ApiResponse({ status: 201 })
  @Post('profile/create')
  async createDbUser(@Res() res, @Body() createUserDTO: CreateUserDTO) {
    const newUser = await this.userService.createDbUser(
      createUserDTO,
      'develop',
    );

    return res.status(HttpStatus.CREATED).json({
      status: HttpStatus.CREATED,
      message: 'Profile created',
      data: newUser,
    });
  }

  @ApiResponse({ status: 200 })
  @Get('profile/:id')
  async getUserProfile(@Res() res, @Param() params: UrlValidator) {
    const profile = await this.userService.getDbUserById(params);

    if (!profile)
      throw new NotFoundException(`Profile for user ${params.id} not found`);

    return res.status(HttpStatus.OK).json({
      status: HttpStatus.OK,
      data: profile,
    });
  }

  @ApiResponse({ status: 200 })
  @Get('profileFb/:id')
  async getUserProfileByFbId(@Res() res, @Param('id') id: string) {
    const profile = await this.userService.getDbUserByFbUid(id);

    if (!profile)
      throw new NotFoundException(`Profile for user ${id} not found`);

    return res.status(HttpStatus.OK).json({
      status: HttpStatus.OK,
      data: profile,
    });
  }

  @ApiResponse({ status: 200 })
  @Patch('profile/:id')
  async updateProfile(
    @Res() res,
    @Body() updateUserDTO: UpdateUserDTO,
    @Param() params: UrlValidator,
  ) {
    const updatedUser = await this.userService.updateDbUser(
      params,
      updateUserDTO,
      'develop',
    );

    if (!updatedUser)
      throw new NotFoundException(`Profile for user ${params.id} not found`);

    return res.status(HttpStatus.OK).json({
      status: HttpStatus.OK,
      message: `User ${params.id} updated`,
      data: updatedUser,
    });
  }

  @ApiResponse({ status: 200 })
  @Patch('replaceProfile/:id')
  async replaceProfile(
    @Res() res,
    @Body() updateUserDTO: UpdateUserDTO,
    @Param() params: UrlValidator,
  ) {
    const updatedUser = await this.userService.replaceDbUser(
      params,
      updateUserDTO,
      'develop',
    );

    if (!updatedUser)
      throw new NotFoundException(`Profile for user ${params.id} not found`);

    return res.status(HttpStatus.OK).json({
      status: HttpStatus.OK,
      message: `User ${params.id} updated`,
    });
  }

  @ApiResponse({ status: 200 })
  @Delete('profile/:id')
  async deleteProfile(@Res() res, @Param() params: UrlValidator) {
    await this.userService.deleteDbUser(params, 'develop');

    return res.status(HttpStatus.OK).json({
      status: HttpStatus.OK,
      message: `User ${params.id} deleted`,
    });
  }
}
