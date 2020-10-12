import { Module } from '@nestjs/common';
import { SubscriberService } from './subscriber.service';
import { SubscriberController } from './subscriber.controller';
import { UserModule } from 'src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscriber } from './entity/subscriber.entity';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([Subscriber])],
  providers: [SubscriberService],
  controllers: [SubscriberController],
  exports: [SubscriberService]
})
export class SubscriberModule {}
