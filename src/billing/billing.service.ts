import { Injectable } from '@nestjs/common';
import { Billing } from './entity/billing.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { EventService } from '../event/event.service';

@Injectable()
export class BillingService {
  constructor(@InjectRepository(Billing) private billingRepository: Repository<Billing>,
              private eventService: EventService) {
  }

  async saveBilling(billing: Billing): Promise<Billing> {
    return await this.billingRepository.save(billing);
  }

  async findBillingById(id: number): Promise<Billing> {
    return await this.billingRepository.findOne(id);
  }

  async findBillingRecords(): Promise<Billing[]> {
    return await this.billingRepository.find();
  }

  async findByEventId(eventId: number): Promise<Billing> {
    const event = await this.eventService.findById(eventId);
    return await this.billingRepository.findOne({ event: event });
  }
}
