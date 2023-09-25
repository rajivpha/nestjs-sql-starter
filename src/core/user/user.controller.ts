import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseMessage } from '@src/decorators/response-message.decorator';
import { CurrentUserPayload } from '@src/interfaces/common.interface';
import { GetTokenData } from '@src/decorators/get-token-data.decorator';
import { GetCurrentUser } from '@src/decorators/get-current-user.decorator';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth()
  @Get()
  findAll(
    @GetTokenData('sub') userId: number,
    @GetCurrentUser() currentUser: CurrentUserPayload
  ) {
    return this.userService.findAll();
  }

  @ApiBearerAuth()
  @Put('profile')
  update(@GetTokenData('sub') userId: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(userId, updateUserDto);
  }
  @ApiBearerAuth()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }

  //   @ApiOperation({ summary: "Create Sub User" })
  //   @Post()
  //   @ApiResponse({
  //     status: 200,
  //     type: SubUserDetailResponse,
  //   })
  //   async addSubUser(
  //     @GetTokenData("sub") userId: number,
  //     @Body() addSubUserDto: AddSubUserDto,
  //   ) {
  //     return await this.userService.addSubUser(userId, addSubUserDto);
  //   }

  //   @ApiOperation({ summary: "Fetch All Sub User" })
  //   @ApiResponse({
  //     status: 200,
  //     type: SubUserFindAllResp,
  //   })
  //   @Get()
  //   async findAllSubUsers(
  //     @GetTokenData("sub") userId: number,
  //     @Query() params: SubUserParams,
  //   ) {
  //     return await this.userService.findAllSubUsers(userId, params);
  //   }

  //   @ApiOperation({ summary: "Fetch Sub User Detail" })
  //   @ApiResponse({
  //     status: 200,
  //     type: SubUserDetailResponse,
  //   })
  //   @Get(":subUserId")
  //   async findOneSubUser(
  //     @GetTokenData("sub") userId: number,
  //     @Param("subUserId") subUserId: number,
  //   ) {
  //     return await this.userService.findOneSubUser(userId, subUserId);
  //   }

  @ApiOperation({ summary: 'Change SUb user account status (Active/deactive)' })
  @Put(':userId')
  async changeAccountStatus(
    @GetTokenData('sub') sub: string,
    @Param('userId') userId: string
  ) {
    return await this.userService.changeAccountStatus(userId);
  }

  //   @ApiOperation({ summary: "Delete SUb user account status (Active/deactive)" })
  //   @Delete(":subUserId")
  //   async deleteSubUser(
  //     @GetTokenData("sub") userId: number,
  //     @Param("subUserId") subUserId: number,
  //   ) {
  //     return await this.userService.deleteSubUser(userId, subUserId);
  //   }
}
