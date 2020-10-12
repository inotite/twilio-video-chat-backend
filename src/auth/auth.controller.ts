import { Body, Controller, Get, HttpException, HttpStatus, Post, Query, UseGuards, Request } from '@nestjs/common';
import { User } from 'src/user/entity/user.entity';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { UserDto } from './user.dto';
import { UserService } from 'src/user/user.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {

  constructor(private authService: AuthService, private userService: UserService) {
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Body() user: UserDto): Promise<any> {
    return await this.authService.login(user);
  }

  @Post('/register')
  async register(@Body() user: User): Promise<any> {
    const sameUser = await this.userService.findOne(user.email);

    if (sameUser) {
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: 'Error: User already exists, Please login',
        timestamp: new Date().toISOString(),
        path: 'auth/register',
      }, HttpStatus.BAD_REQUEST);
    }
    return await this.authService.register(user);
  }


  @Get('/forgot/password')
  async forgotPassword(@Query('email') email: string) {
    return this.authService.forgotPasswordEmail(email);
  }

  @Post('reset/password')
  async resetPassword(@Body() userDto: UserDto) {
    return this.authService.resetPassword(userDto);
  }


}
