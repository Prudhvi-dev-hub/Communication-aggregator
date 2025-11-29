import { Module } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';
import { WhatsappConsumer } from './whatsapp.consumer';
import { KafkaService } from 'src/kafka/kafka.service';
import { LogsProducer } from 'src/kafka/logs.producer';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [
    WhatsappService,
    WhatsappConsumer,
    KafkaService,
    LogsProducer,
    PrismaService,
  ],
})
export class WhatsappModule {}
