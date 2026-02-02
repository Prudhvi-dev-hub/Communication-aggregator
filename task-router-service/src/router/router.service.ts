import { Injectable } from '@nestjs/common';
import { EmailProducer } from 'src/kafka/email.producer';
import { LogsProducer } from 'src/kafka/logs.producer';
import { SmsProducer } from 'src/kafka/sms.producer';
import { WhatsappProducer } from 'src/kafka/whatsapp.producer';
import { PrismaService } from 'src/prisma/prisma.service';
import { SendMessageDto } from './dto/create-message.dto';
import { ChannelEnum } from './enums/router.enum';
import { uuid as UUID } from 'uuidv4';

@Injectable()
export class RouterService {
  constructor(
    private prisma: PrismaService,
    private emailProducer: EmailProducer,
    private smsProducer: SmsProducer,
    private whatsappProducer: WhatsappProducer,
    private logsProducer: LogsProducer,
  ) { }

  async routeMessage(dto: SendMessageDto) {
    // 1. Deduplication (prevent same message more than once)
    const existing = await this.prisma.messageRequest.findFirst({
      where: {
        to: dto.to,
        body: dto.body,
        channel: dto.channel,
      },
    });

    if (existing) {
      await this.logsProducer.publish({
        event: 'router.duplicate',
        details: dto,
      });
      return { message: 'Duplicate message ignored' };
    }

    const requestId = UUID();

    // 2. Save request (for history + dedupe)
    const record = await this.prisma.messageRequest.create({
      data: { ...dto, requestId },
    });

    // 3. Routing logic
    switch (dto.channel) {
      case ChannelEnum.EMAIL:
        await this.emailProducer.publish(record);
        break;
      case ChannelEnum.SMS:
        await this.smsProducer.publish(record);
        break;
      case ChannelEnum.WHATSAPP:
        await this.whatsappProducer.publish(record);
        break;
    }

    // 4. Log event
    await this.logsProducer.publish({
      event: 'router.sent',
      details: record,
    });

    return { message: 'Message forwarded', requestId };
  }
}

