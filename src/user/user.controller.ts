import {
  Controller,
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

  @ApiResponse({ status: HttpStatus.CREATED })
  @Post('create')
  async createWebUser(@Body() webUserDTO: WebUserDTO) {
    const newWebUser = await this.userService.createWebUser(
      webUserDTO,
      'develop',
    );

    return newWebUser;
  }

  @ApiResponse({ status: HttpStatus.OK })
  @Get('all')
  async getUsers() {
    const users = await this.userService.getDbUsers();

    if (!users) throw new NotFoundException('No users found!');

    return users;
  }

  @ApiResponse({ status: HttpStatus.OK })
  @Put(':id')
  async updateWebUser(
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

    return updatedUser;
  }

  @ApiResponse({ status: HttpStatus.OK })
  @Delete(':id')
  async deleteWebUser(@Param() params: UrlValidator) {
    await this.userService.deletedWebUser(params, 'develop');
  }

  @ApiResponse({ status: HttpStatus.CREATED })
  @Post('profile/create')
  async createDbUser(@Body() createUserDTO: CreateUserDTO) {
    const newUser = await this.userService.createDbUser(
      createUserDTO,
      'develop',
    );

    return newUser;
  }

  @ApiResponse({ status: HttpStatus.OK })
  @Get('profile/:id')
  async getUserProfile(@Param() params: UrlValidator) {
    const profile = await this.userService.getDbUserById(params);

    if (!profile)
      throw new NotFoundException(`Profile for user ${params.id} not found`);

    return profile;
  }

  @ApiResponse({ status: HttpStatus.OK })
  @Get('profileFb/:id')
  async getUserProfileByFbId(@Param('id') id: string) {
    const profile = await this.userService.getDbUserByFbUid(id);

    if (!profile)
      throw new NotFoundException(`Profile for user ${id} not found`);

    return profile;
  }

  @ApiResponse({ status: HttpStatus.OK })
  @Patch('profile/:id')
  async updateProfile(
    @Body() updateUserDTO: UpdateUserDTO,
    @Param() params: UrlValidator,
  ) {
    await this.userService.updateDbUser(params, updateUserDTO, 'develop');
  }

  @ApiResponse({ status: HttpStatus.OK })
  @Patch('replaceProfile/:id')
  async replaceProfile(
    @Body() updateUserDTO: UpdateUserDTO,
    @Param() params: UrlValidator,
  ) {
    await this.userService.replaceDbUser(params, updateUserDTO, 'develop');
  }

  @ApiResponse({ status: HttpStatus.OK })
  @Delete('profile/:id')
  async deleteProfile(@Param() params: UrlValidator) {
    await this.userService.deleteDbUser(params, 'develop');
  }
}
