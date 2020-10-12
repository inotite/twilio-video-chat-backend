import { Controller, Get, Param, Post, Body, UseGuards, Request } from '@nestjs/common';
import { EventService } from './event.service';
import { Event } from 'src/event/entity/events.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('events')
export class EventController {

    constructor(private eventService: EventService){}

    @Get()
    async findAllEvents(@Request() request): Promise<any>{
        return await this.eventService.findAllEvents();
    }
    
    @UseGuards(JwtAuthGuard)
    @Get('/my-events')
    async findMyEvents(@Request() req): Promise<any>{
        return await this.eventService.findMyEvents(req.user.userId)
    }

    @UseGuards(JwtAuthGuard)
    @Get('/all-payment-events')
    async findAllPaymentEvents(@Request() req): Promise<any>{
        return await this.eventService.findPaymentEvents(req.user.userId)
    }

    @Get(':id')
    async findEventById(@Param('id') id: number): Promise<Event>{
        return await this.eventService.findById(id);
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    async createEvent(@Body() event: Event, @Request() req): Promise<Event>{                
        return await this.eventService.createEvent(event, req.user.userId);
    }
}
