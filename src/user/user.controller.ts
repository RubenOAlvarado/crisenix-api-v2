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
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { IdValidator } from '@/shared/models/dtos/validators/id.validator';
import { ApiPaginatedResponse } from '@/shared/decorators/api-paginated.response.dto';
import { PaginationDTO } from '@/shared/models/dtos/searcher/pagination.dto';
import { ResponseWebUserDTO } from '@/shared/models/dtos/response/user/response-webuser.dto';
import { WebUserDTO } from '@/shared/models/dtos/request/user/createwebuser.dto';
import { UpdateWebUserDTO } from '@/shared/models/dtos/request/user/updatewebuser.dto';
import { UpdateUserDTO } from '@/shared/models/dtos/request/user/updateuser.dto';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiOperation({ summary: 'Create a new user' })
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
  @Post()
  @ApiBody({
    description: 'User object',
    type: WebUserDTO,
  })
  async createWebUser(@Body() webUserDTO: WebUserDTO) {
    return await this.userService.createWebUser(webUserDTO);
  }

  @ApiOperation({ summary: 'Get all users' })
  @ApiPaginatedResponse(ResponseWebUserDTO)
  @ApiNotFoundResponse({
    description: 'No users found!',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong finding the users profiles.',
  })
  @Get()
  async getUsers(@Query() query: PaginationDTO) {
    return await this.userService.getDbUsers(query);
  }

  @ApiOperation({ summary: 'Update a user profile' })
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
    @Param() params: IdValidator,
    @Body() updateWebUserDTO: UpdateWebUserDTO,
  ) {
    return await this.userService.updateWebUser(params, updateWebUserDTO);
  }

  @ApiOperation({ summary: 'Delete a user' })
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
  async deleteWebUser(@Param() params: IdValidator) {
    await this.userService.deletedWebUser(params);
    return 'The user has been successfully deleted.';
  }

  @ApiOperation({ summary: 'Get a user profile by his id' })
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
  async getProfiles(@Param() params: IdValidator) {
    return await this.userService.getWebUser(params);
  }

  // app endpoints
  @ApiOperation({ summary: 'Get a user profile by his id' })
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
  async getUserProfile(@Param() params: IdValidator) {
    return await this.userService.getDbUserById(params);
  }

  @ApiOperation({ summary: 'Get a user profile by his firebase id' })
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

  @ApiOperation({ summary: 'Update a user profile' })
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
    @Param() params: IdValidator,
  ) {
    return await this.userService.updateDbUser(params, updateUserDTO);
  }

  @ApiOperation({ summary: 'Delete a user profile' })
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
  async deleteProfile(@Param() params: IdValidator) {
    await this.userService.deleteDbUser(params);
    return 'The user profile has been successfully deleted.';
  }

  /* @Get('test')
  async test(@Request() req: any) {
    return req.user;
  } */
}
