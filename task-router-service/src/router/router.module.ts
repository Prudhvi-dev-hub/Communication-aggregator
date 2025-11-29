import { Module } from '@nestjs/common';
import { RouterService } from './router.service';
import { RouterController } from './router.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { KafkaService } from 'src/kafka/kafka.service';
import { EmailProducer } from 'src/kafka/email.producer';
import { SmsProducer } from 'src/kafka/sms.producer';
import { WhatsappProducer } from 'src/kafka/whatsapp.producer';
import { LogsProducer } from 'src/kafka/logs.producer';

@Module({
  controllers: [RouterController],
  providers: [
    RouterService,
    PrismaService,
    KafkaService,
    EmailProducer,
    SmsProducer,
    WhatsappProducer,
    LogsProducer,
  ],
})
export class RouterModule {}
