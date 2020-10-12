import { Controller, Get, UseGuards, Param } from '@nestjs/common';
import { BillingService } from './billing.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Billing } from './entity/billing.entity';

@Controller('billing')
export class BillingController {
    constructor(private billingService: BillingService){}

    @UseGuards(JwtAuthGuard)
    @Get()
    async findAllBillings():Promise<Billing[]>{
        return await this.billingService.findBillingRecords();
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async findBillingById(@Param('id') id: number): Promise<Billing>{
        return await this.billingService.findBillingById(id);
    }

    @UseGuards(JwtAuthGuard)
    @Get('events/:eventId')
    async findByEventId(@Param('eventId') eventId: number): Promise<Billing>{
        return await this.billingService.findByEventId(eventId);
    }
}
