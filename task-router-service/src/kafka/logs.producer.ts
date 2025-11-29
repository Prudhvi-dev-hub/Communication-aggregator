import { Injectable } from '@nestjs/common';
import { KafkaService } from './kafka.service';

@Injectable()
export class LogsProducer {
  constructor(private kafka: KafkaService) {}

  async publish(payload: any) {
    return this.kafka.producer.send({
      topic: 'logs.router',
      messages: [{ value: JSON.stringify(payload) }],
    });
  }
}
