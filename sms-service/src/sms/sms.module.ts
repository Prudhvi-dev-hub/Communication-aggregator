import { Module } from '@nestjs/common';
import { SmsService } from './sms.service';
import { SmsConsumer } from './sms.consumer';
import { PrismaService } from '../prisma/prisma.service';
import { KafkaService } from '../kafka/kafka.service';
import { LogsProducer } from '../kafka/logs.producer';

@Module({
  providers: [
    SmsService,
    SmsConsumer,
    PrismaService,
    KafkaService,
    LogsProducer,
  ],
})
export class SmsModule {}
