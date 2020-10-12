import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Welcome to JoinARoom for more info go to www.joinaroom.com';
  }
}
