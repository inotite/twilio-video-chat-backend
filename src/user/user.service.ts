import { Injectable, Inject } from '@nestjs/common';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {

    constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

    async findOne(email: string): Promise<User> {
      return await this.userRepository.findOne({where: {email}, select: ['id', 'email', 'username', 'password', 'role']});
    }

    async userExists(username: string): Promise<boolean> {
      const user =  await this.userRepository.findOne({where: {username: username}});
      
      if(user){
        return true;
      }else{
        return false;
      }
    }

    async saveUser(user: User): Promise<User | undefined>{
      const entity = Object.assign(new User(), user);
      return this.userRepository.save(entity);
    }

    async findAllUsers(): Promise<User[]>{
      return await this.userRepository.find();
    }

    async findUserById(id: number): Promise<User | undefined>{
      return await this.userRepository.findOne(id);
    }
}
