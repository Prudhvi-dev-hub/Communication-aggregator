import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Kafka, Producer, Consumer } from 'kafkajs';

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  private kafka: Kafka;
  public producer: Producer;
  public consumer: Consumer;

  constructor() {
    const brokers = process.env.KAFKA_BROKERS?.split(',') || ['localhost:9092'];
    this.kafka = new Kafka({ clientId: 'email-service', brokers });
    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({ groupId: 'email-service-group' });
  }

  async onModuleInit() {
    await this.producer.connect();
    console.log('🔥 Kafka producer connected');

    await this.consumer.connect();
    console.log('🔥 Kafka consumer connected');
  }

  async onModuleDestroy() {
    await this.consumer.disconnect();
    await this.producer.disconnect();
  }
}
