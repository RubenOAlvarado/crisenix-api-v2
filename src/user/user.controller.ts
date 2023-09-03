import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Patch,
  Delete,
  NotFoundException,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { UpdateUserDTO } from 'src/shared/models/dtos/user/updateuser.dto';
import { UrlValidator } from 'src/shared/validators/urlValidator.dto';
import { CreateUserDTO } from 'src/shared/models/dtos/user/createuser.dto';
import { UpdateWebUserDTO } from 'src/shared/models/dtos/user/updatewebuser.dto';
import { WebUserDTO } from 'src/shared/models/dtos/user/createwebuser.dto';
import { User } from '@/shared/models/schemas/user.schema';
import { FirebaseAuthGuard } from '@/auth/firebase-auth.guard';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiCreatedResponse({
    description: 'The user has been successfully created.',
    type: WebUserDTO,
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong creating the user.',
  })
  @ApiBadRequestResponse({
    description: 'Password is required in order to register user on firebase.',
  })
  @Post('create')
  @ApiBody({
    description: 'User object',
    type: CreateUserDTO,
  })
  @UseGuards(FirebaseAuthGuard)
  async createWebUser(@Body() webUserDTO: WebUserDTO) {
    return await this.userService.createWebUser(webUserDTO, 'develop');
  }

  @ApiNotFoundResponse({
    description: 'No users found!',
  })
  @ApiOkResponse({
    description: 'The users have been found.',
    type: [WebUserDTO],
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong finding the users profiles.',
  })
  @Get('all')
  @UseGuards(FirebaseAuthGuard)
  async getUsers() {
    const users = await this.userService.getDbUsers();

    if (!users) throw new NotFoundException('No users found!');

    return users;
  }

  @ApiOkResponse({
    description: 'The user has been updated succesfully.',
    type: WebUserDTO,
  })
  @ApiNotFoundResponse({
    description: 'User profile not found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong updating the user profile.',
  })
  @Put(':id')
  @ApiBody({
    description: 'User object',
    type: UpdateWebUserDTO,
  })
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
      throw new NotFoundException(
        `User profile with id ${params.id} not found.`,
      );

    return updatedUser;
  }

  @ApiOkResponse({
    description: 'The user has been successfully deleted.',
  })
  @ApiNotFoundResponse({
    description: 'User not found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong deleting the user.',
  })
  @Delete(':id')
  async deleteWebUser(@Param() params: UrlValidator) {
    await this.userService.deletedWebUser(params, 'develop');
  }

  @ApiCreatedResponse({
    description: 'The user has been successfully created in database.',
    type: CreateUserDTO,
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong creating the user in database.',
  })
  @ApiBadRequestResponse({
    description: 'Sended role not found.',
  })
  @Post('profile/create')
  @ApiBody({
    description: 'User object',
    type: CreateUserDTO,
  })
  async createDbUser(@Body() createUserDTO: CreateUserDTO) {
    const newUser = await this.userService.createDbUser(
      createUserDTO,
      'develop',
    );

    return newUser;
  }

  @ApiOkResponse({
    description: 'The user profile has been found.',
    type: User,
  })
  @ApiNotFoundResponse({
    description: `Profile for user not found.`,
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong finding the user profile.',
  })
  @Get('profile/:id')
  async getUserProfile(@Param() params: UrlValidator) {
    const profile = await this.userService.getDbUserById(params);

    if (!profile)
      throw new NotFoundException(`Profile for user ${params.id} not found.`);

    return profile;
  }

  @ApiOkResponse({
    description: 'The user profile has been found by his firebase id.',
    type: User,
  })
  @ApiNotFoundResponse({
    description: `Any profile match given firebase id.`,
  })
  @ApiInternalServerErrorResponse({
    description:
      'Something went wrong finding the user profile by his firebase id.',
  })
  @Get('profileFb/:id')
  async getUserProfileByFbId(@Param('id') id: string) {
    const profile = await this.userService.getDbUserByFbUid(id);

    if (!profile)
      throw new NotFoundException(`Profile for user ${id} not found`);

    return profile;
  }

  @ApiOkResponse({
    description: 'The user profiles have been succesfully updated.',
  })
  @ApiNotFoundResponse({
    description: 'No user profile found.',
  })
  @Patch('profile/:id')
  async updateProfile(
    @Body() updateUserDTO: UpdateUserDTO,
    @Param() params: UrlValidator,
  ) {
    await this.userService.updateDbUser(params, updateUserDTO, 'develop');
  }

  @ApiOkResponse({
    description: 'The user profiles have been succesfully updated.',
  })
  @ApiNotFoundResponse({
    description: 'No user profile found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong updating the user profile.',
  })
  @Patch('replaceProfile/:id')
  @ApiBody({
    description: 'User object',
    type: UpdateUserDTO,
  })
  async replaceProfile(
    @Body() updateUserDTO: UpdateUserDTO,
    @Param() params: UrlValidator,
  ) {
    await this.userService.replaceDbUser(params, updateUserDTO, 'develop');
  }

  @ApiOkResponse({
    description: 'The user profile has been successfully deleted.',
  })
  @ApiNotFoundResponse({
    description: 'User profile not found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong deleting the user profile.',
  })
  @Delete('profile/:id')
  async deleteProfile(@Param() params: UrlValidator) {
    await this.userService.deleteDbUser(params, 'develop');
  }
}
