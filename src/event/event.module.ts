import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entity/events.entity';
import { JwtStrategy } from 'src/auth/strategy/jwt.strategy';
import { EventController } from './event.controller';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [PassportModule, UserModule, TypeOrmModule.forFeature([Event])],
  providers: [EventService, JwtStrategy],
  controllers: [EventController],
  exports: [EventService],
})
export class EventModule {
}
