import { Module } from '@nestjs/common';
import { VideoService } from './video.service';
import { VideoController } from './video.controller';
import { TwilioModule } from './twilio/twilio.module';
import { PassportModule } from '@nestjs/passport';

@Module({
  providers: [VideoService],
  controllers: [VideoController],
  imports: [TwilioModule, PassportModule]
})
export class VideoModule {}
