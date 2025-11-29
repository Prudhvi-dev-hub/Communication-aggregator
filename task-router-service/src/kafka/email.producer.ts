import { Injectable } from '@nestjs/common';
import { KafkaService } from './kafka.service';

@Injectable()
export class EmailProducer {
  constructor(private kafka: KafkaService) {}

  async publish(payload: any) {
    return this.kafka.producer.send({
      topic: 'send.email',
      messages: [{ value: JSON.stringify(payload) }],
    });
  }
}
