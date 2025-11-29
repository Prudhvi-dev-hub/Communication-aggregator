import { Injectable, OnModuleInit } from '@nestjs/common';
import { KafkaService } from '../kafka/kafka.service';
import { SmsService } from './sms.service';

@Injectable()
export class SmsConsumer implements OnModuleInit {
  constructor(
    private kafka: KafkaService,
    private smsService: SmsService,
  ) {}

  async onModuleInit() {
    await this.kafka.consumer.subscribe({
      topic: 'send.sms',
      fromBeginning: false,
    });

    await this.kafka.consumer.run({
      eachMessage: async ({ message }) => {
        const payload = JSON.parse(message.value.toString());
        await this.smsService.processMessage(payload);
      },
    });

    console.log('📩 SMS Consumer subscribed to send.sms');
  }
}
