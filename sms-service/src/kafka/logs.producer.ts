import { Injectable } from '@nestjs/common';
import { KafkaService } from './kafka.service';

@Injectable()
export class LogsProducer {
  constructor(private kafka: KafkaService) {}

  async publish(log: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    await this.kafka.producer.send({
      topic: 'logs.delivery.sms',
      messages: [{ value: JSON.stringify(log) }],
    });
  }
}
