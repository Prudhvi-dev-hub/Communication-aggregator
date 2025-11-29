import { Injectable, OnModuleInit } from '@nestjs/common';
import { Kafka, Producer } from 'kafkajs';

@Injectable()
export class KafkaService implements OnModuleInit {
  public producer: Producer;

  constructor() {
    const kafka = new Kafka({
      brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
    });

    this.producer = kafka.producer();
  }

  async onModuleInit() {
    await this.producer.connect();
    console.log('🔥 Router: Kafka Producer Connected');
  }
}
