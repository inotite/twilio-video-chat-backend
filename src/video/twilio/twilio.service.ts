import { Injectable } from '@nestjs/common';
import * as twilio from 'twilio';
import { TwilioVideo } from './entity/twilio-video.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { EventService } from 'src/event/event.service';

const AccessToken = twilio.jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;

@Injectable()
export class TwilioService {

  constructor(
    @InjectRepository(TwilioVideo) videoRepository: Repository<TwilioVideo>,
    private userService: UserService,
    private eventService: EventService,
  ) {
  }

  async generateAccessToken(twilioVideo: TwilioVideo): Promise<any> {
    const user = await this.userService.findUserById(twilioVideo.userId);
    const event = await this.eventService.findById(twilioVideo.eventId);

    if (user && event && user.username !== null) {
      const accessToken = new AccessToken(
        process.env.TWILIO_SID,
        process.env.API_KEY_SID,
        process.env.API_KEY_SECRET,
        { identity: user.username },
      );
      const grant = new VideoGrant({ room: event.eventName });
      accessToken.addGrant(grant);
      const twilioAccessToken = accessToken.toJwt();

      return { twilioToken: twilioAccessToken };
    }

    return null;
  }
}
