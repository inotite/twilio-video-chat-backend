import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscriber } from './entity/subscriber.entity';

@Injectable()
export class SubscriberService {

    constructor(@InjectRepository(Subscriber) private subscriberRepository: Repository<Subscriber>){}


    async saveNewSubscription(subscriber: Subscriber): Promise<Subscriber>{
        return await this.subscriberRepository.save(subscriber);
    }

    async findAllSubscriptions(): Promise<Subscriber[]>{
        return await this.subscriberRepository.find()
    }

    async findEventSubscribers(userId: number, eventId: number): Promise<Subscriber>{
        return await this.subscriberRepository.findOne({where: {userId: userId, eventId: eventId}})
    }

    async findASubscription(id: number): Promise<Subscriber>{
        return await this.subscriberRepository.findOne(id);
    }

    async findSubscriptionsByUserId(userId: number): Promise<Subscriber[]>{
        return await this.subscriberRepository.find({where: {userId: userId}});
    }
}
