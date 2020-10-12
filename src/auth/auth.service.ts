import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from 'src/user/entity/user.entity';
import * as sgMail from '@sendgrid/mail';
import { UserDto } from './user.dto';

sgMail.setApiKey(process.env.SG_API_KEY);

@Injectable()
export class AuthService {

  private user: User;

  constructor(
    private jwtService: JwtService,
    private usersService: UserService) {
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(email);
    if (user && (await AuthService.passwordsAreEqual(user.password, pass))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }


  async login(user: any): Promise<any> {
    const authUser = await this.usersService.findOne(user.email);
    const payload = { sub: authUser.id, email: authUser.email, role: authUser.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(user: User): Promise<any> {
    this.user = await this.usersService.saveUser(user);

    return this.login(this.user);
  }

  private static async passwordsAreEqual(
    hashedPassword: string,
    plainPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  async forgotPasswordEmail(email: string) {
    const user = await this.usersService.findOne(email);

    if (user) {
      const msg = {
        to: email,
        from: 'support@joinaroom.live',
        subject: 'Password Reset Request',
        text: 'You have requested to reset your password. \n Please follow the following link to reset \n https://staging.joinaroom.live/main/password-reset?email=' + email,
        html: '<strong><p>You have requested to reset your password.</p>' +
          '<p>Please follow the following link to reset</p>' +
          '<p><a href="https://staging.joinaroom.live/main/password-reset?email=' + email + '">here</a></p></strong>',
      };

      return sgMail
        .send(msg)
        .then(response => {
          return true;
        }, error => {
          if (error.response) {
            console.error(error.response.body);
            throw new HttpException({
              status: HttpStatus.BAD_REQUEST,
              error: error.response.body.errors[0].message,
              timestamp: new Date().toISOString(),
              path: 'auth/forgot/password',
            }, HttpStatus.BAD_REQUEST);
          }
        });
    } else {
      throw new HttpException({
        status: HttpStatus.UNAUTHORIZED,
        eror: 'Sorry that user doesn\'t exist on our service',
        timestamp: new Date().toISOString(),
        path: 'auth/reset/password',
      }, HttpStatus.UNAUTHORIZED);
    }

  }

  async resetPassword(userDto: UserDto) {
    const user = await this.usersService.findOne(userDto.email);

    if (user) {
      user.password = await bcrypt.hash(userDto.password, 10);
      await this.usersService.saveUser(user);
      return true;
    } else {
      throw new HttpException({
        status: HttpStatus.UNAUTHORIZED,
        eror: 'Sorry that user doesn\'t exist on our service',
        timestamp: new Date().toISOString(),
        path: 'auth/reset/password',
      }, HttpStatus.UNAUTHORIZED);

    }
  }

}
