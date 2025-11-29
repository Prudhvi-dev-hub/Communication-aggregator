import { Injectable } from '@nestjs/common';
import { KafkaService } from './kafka.service';

@Injectable()
export class LogsProducer {
  constructor(private kafka: KafkaService) {}

  async publish(log: any) {
    await this.kafka.producer.send({
      topic: 'logs.delivery.whatsapp',
      messages: [{ value: JSON.stringify(log) }],
    });
  }
}
