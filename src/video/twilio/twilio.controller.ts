import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { TwilioService } from './twilio.service';
import { TwilioVideo } from './entity/twilio-video.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('twilio-api')
export class TwilioController {
    constructor(private twilioService: TwilioService){}

    @UseGuards(JwtAuthGuard)
    @Post('access-token')
    async requestAccessToken(@Body() twilioVideo: TwilioVideo){
        return await this.twilioService.generateAccessToken(twilioVideo); 
    }
    
}
