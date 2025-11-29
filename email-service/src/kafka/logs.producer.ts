import { Injectable } from '@nestjs/common';
import { KafkaService } from './kafka.service';

@Injectable()
export class LogsProducer {
  constructor(private readonly kafkaService: KafkaService) {}

  async publish(log: any) {
    await this.kafkaService.producer.send({
      topic: 'logs.delivery.email',
      messages: [{ value: JSON.stringify(log) }],
    });
  }
}
