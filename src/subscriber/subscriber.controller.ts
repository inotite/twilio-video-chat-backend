import { Controller, Get, UseGuards, Param, Request, Post, Body } from '@nestjs/common';
import { SubscriberService } from './subscriber.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Subscriber } from './entity/subscriber.entity';

@Controller('subscribers')
export class SubscriberController {
    constructor(private subscriberService: SubscriberService){}

    @UseGuards(JwtAuthGuard)
    @Get()
    async findAllSubscriptions(): Promise<Subscriber[]>{
        return await this.subscriberService.findAllSubscriptions();
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async findASubscription(@Param('id') id: number): Promise<Subscriber>{
        return await this.subscriberService.findASubscription(id);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':eventId/event')
    async findEventSubscribers(@Request() req, @Param('eventId') eventId: number): Promise<Subscriber>{
        return await this.subscriberService.findEventSubscribers(req.userId, eventId);
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    async saveMySubscription(@Body() subscriber: Subscriber, @Request() req): Promise<Subscriber>{
        subscriber.userId = req.userId;
        return await this.subscriberService.saveNewSubscription(subscriber);
    }
}
