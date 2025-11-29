import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { PrismaService } from '../prisma/prisma.service';
import { KafkaService } from '../kafka/kafka.service';
import { LogsProducer } from '../kafka/logs.producer';
import { EmailConsumer } from './email.consumer';

@Module({
  controllers: [EmailController],
  providers: [
    EmailService,
    PrismaService,
    KafkaService,
    LogsProducer,
    EmailConsumer,
  ],
})
export class EmailModule {}
