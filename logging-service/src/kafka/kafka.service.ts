import { Injectable, OnModuleInit } from '@nestjs/common';
import { Kafka, Consumer } from 'kafkajs';

@Injectable()
export class KafkaService implements OnModuleInit {
  public consumer: Consumer;

  constructor() {
    const kafka = new Kafka({
      brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
    });

    this.consumer = kafka.consumer({
      groupId: 'logging-service',
    });
  }

  async onModuleInit() {
    await this.consumer.connect();
    console.log('🔥 Logging Service: Kafka consumer connected');
  }
}
