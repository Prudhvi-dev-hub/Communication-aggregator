import { Injectable } from '@nestjs/common';
import { KafkaService } from './kafka.service';

@Injectable()
export class WhatsappProducer {
  constructor(private kafka: KafkaService) {}

  async publish(payload: any) {
    return this.kafka.producer.send({
      topic: 'send.whatsapp',
      messages: [{ value: JSON.stringify(payload) }],
    });
  }
}
