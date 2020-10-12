import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApprovePayment } from './entity/approve-payment.entity';
import { Event } from '../../event/entity/events.entity';

@Injectable()
export class PaymentsService {
  @InjectRepository(ApprovePayment) private approvePaymentsRepository: Repository<ApprovePayment>;

  async savePaymentRequests(approvePayment: ApprovePayment): Promise<ApprovePayment> {
    return await this.approvePaymentsRepository.save(approvePayment);
  }

  async findAllPaymentRequests(): Promise<ApprovePayment[]> {
    return await this.approvePaymentsRepository.find();
  }

  async findPaymentRequestByEventId(eventId: number): Promise<ApprovePayment> {
    const event = new Event();
    event.id = eventId;
    return await this.approvePaymentsRepository.findOne({ where: { event: event } });
  }
}
