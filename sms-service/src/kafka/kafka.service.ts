import { Injectable, OnModuleInit } from '@nestjs/common';
import { Kafka } from 'kafkajs';

@Injectable()
export class KafkaService implements OnModuleInit {
  public consumer;
  public producer;

  constructor() {
    const kafka = new Kafka({
      brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
    });

    this.producer = kafka.producer();
    this.consumer = kafka.consumer({ groupId: 'sms-service' });
  }

  async onModuleInit() {
    await this.producer.connect();
    console.log('📡 SMS Service Kafka Producer connected');

    await this.consumer.connect();
    console.log('📡 SMS Service Kafka Consumer connected');
  }
}
