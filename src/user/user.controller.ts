import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entity/user.entity';

@Controller('users')
export class UserController {
    constructor(private userService: UserService){}


    @Get()
    async findAllUsers():Promise<User[]>{
        return await this.userService.findAllUsers();
    }

    @Get('/user-exists/:username')
    async userExists(@Param('username') username:string): Promise<boolean>{
        return await this.userService.userExists(username);
    }

    @Get(':id')
    async findUserById(@Param('id')id:number): Promise<User>{
        return await this.userService.findUserById(id);
    }

    @Get(':email')
    async findUserByEmail(@Param('email') email:string): Promise<User>{
        return await this.userService.findOne(email);
    }

    @Post()
    async updateUserInfo(@Body() user: User): Promise<User>{
        return await this.userService.saveUser(user);
    }
}
