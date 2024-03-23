import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Patch,
  Delete,
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
import { UserService } from './user.service';
import { UpdateUserDTO } from 'src/shared/models/dtos/user/updateuser.dto';
import { UrlValidator } from 'src/shared/validators/urlValidator.dto';
import { UpdateWebUserDTO } from 'src/shared/models/dtos/user/updatewebuser.dto';
import { WebUserDTO } from 'src/shared/models/dtos/user/createwebuser.dto';
import { ApiPaginatedResponse } from '@/shared/decorators/api-paginated.response.dto';
import { PaginationDTO } from '@/shared/dtos/pagination.dto';
import { ResponseWebUserDTO } from '@/shared/models/dtos/user/response-webuser.dto';

@ApiTags('User')
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiCreatedResponse({
    description: 'The user has been successfully created.',
    type: ResponseWebUserDTO,
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
    type: WebUserDTO,
  })
  async createWebUser(@Body() webUserDTO: WebUserDTO) {
    return await this.userService.createWebUser(webUserDTO, 'develop');
  }

  @ApiPaginatedResponse(ResponseWebUserDTO)
  @ApiNotFoundResponse({
    description: 'No users found!',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong finding the users profiles.',
  })
  @Get('all')
  async getUsers(@Query() query: PaginationDTO) {
    return await this.userService.getDbUsers(query);
  }

  @ApiOkResponse({
    description: 'The user has been updated succesfully.',
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
    await this.userService.updateWebUser(params, updateWebUserDTO, 'develop');
    return 'The user has been updated succesfully.';
  }

  @ApiOkResponse({
    description: 'The user has been successfully deleted.',
    type: String,
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
    return 'The user has been successfully deleted.';
  }

  @ApiOkResponse({
    description: 'The user profile have been succesfully found.',
    type: ResponseWebUserDTO,
  })
  @ApiNotFoundResponse({
    description: 'No user profile found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong finding the user profiles.',
  })
  @Get(':id')
  async getProfiles(@Param() params: UrlValidator) {
    return await this.userService.getWebUser(params);
  }

  // app endpoints
  @ApiOkResponse({
    description: 'The user profile has been found.',
    type: ResponseWebUserDTO,
  })
  @ApiNotFoundResponse({
    description: `Profile for user not found.`,
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong finding the user profile.',
  })
  @Get('profile/:id')
  async getUserProfile(@Param() params: UrlValidator) {
    return await this.userService.getDbUserById(params);
  }

  @ApiOkResponse({
    description: 'The user profile has been found by his firebase id.',
    type: ResponseWebUserDTO,
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
    return await this.userService.getDbUserByFbUid(id);
  }

  @ApiOkResponse({
    description: 'The user profiles have been succesfully updated.',
  })
  @ApiNotFoundResponse({
    description: 'No user profile found.',
  })
  @Patch('profile/:id')
  @ApiBody({
    description: 'User object',
    type: UpdateUserDTO,
  })
  async updateProfile(
    @Body() updateUserDTO: UpdateUserDTO,
    @Param() params: UrlValidator,
  ) {
    await this.userService.updateDbUser(params, updateUserDTO, 'develop');
    return 'The user profiles have been succesfully updated.';
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
    return 'The user profile has been successfully deleted.';
  }

  /* @Get('test')
  async test(@Request() req: any) {
    return req.user;
  } */
}
