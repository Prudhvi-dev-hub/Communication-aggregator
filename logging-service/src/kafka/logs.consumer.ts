import { Injectable, OnModuleInit } from '@nestjs/common';
import { KafkaService } from './kafka.service';
import { ElasticService } from '../elastic-search/elastic.service';

@Injectable()
export class LogsConsumer implements OnModuleInit {
  constructor(
    private kafka: KafkaService,
    private elastic: ElasticService,
  ) {}

  async onModuleInit() {
    await this.kafka.consumer.subscribe({
      topic: /logs\./,
      fromBeginning: false,
    });

    await this.kafka.consumer.run({
      eachMessage: async ({ topic, message }) => {
        const log = message.value ? JSON.parse(message.value.toString()) : '';

        console.log('📥 Log Received:', topic, log);

        // index name = logs.router, logs.email, logs.sms etc
        await this.elastic.indexLog(topic, log);
      },
    });

    console.log('📡 LogsConsumer is now listening to logs.* topics');
  }
}
