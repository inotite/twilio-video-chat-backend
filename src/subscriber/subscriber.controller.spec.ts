import { Test, TestingModule } from '@nestjs/testing';
import { SubscriberController } from './subscriber.controller';

describe('Subscriber Controller', () => {
  let controller: SubscriberController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubscriberController],
    }).compile();

    controller = module.get<SubscriberController>(SubscriberController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
