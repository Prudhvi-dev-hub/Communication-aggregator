import { Injectable, OnModuleInit } from '@nestjs/common';
import { KafkaService } from '../kafka/kafka.service';
import { WhatsappService } from './whatsapp.service';

@Injectable()
export class WhatsappConsumer implements OnModuleInit {
  constructor(
    private kafka: KafkaService,
    private whatsappService: WhatsappService,
  ) {}

  async onModuleInit() {
    await this.kafka.consumer.subscribe({
      topic: 'send.whatsapp',
      fromBeginning: false,
    });

    await this.kafka.consumer.run({
      eachMessage: async ({ message }) => {
        const payload = JSON.parse(message.value.toString());
        await this.whatsappService.processMessage(payload);
      },
    });

    console.log('📩 Whatsapp Consumer subscribed to send.whatsapp');
  }
}
