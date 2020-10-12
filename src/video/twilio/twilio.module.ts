import { Module } from '@nestjs/common';
import { TwilioController } from './twilio.controller';
import { TwilioService } from './twilio.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TwilioVideo } from './entity/twilio-video.entity';
import { EventService } from 'src/event/event.service';
import { UserService } from 'src/user/user.service';
import { EventModule } from 'src/event/event.module';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [EventModule, UserModule, TypeOrmModule.forFeature([TwilioVideo]), PassportModule],
  controllers: [TwilioController],
  providers: [TwilioService],
  exports: [TwilioService]
})
export class TwilioModule {}
