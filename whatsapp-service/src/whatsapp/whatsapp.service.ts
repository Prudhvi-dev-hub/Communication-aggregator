import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LogsProducer } from '../kafka/logs.producer';

@Injectable()
export class WhatsappService {
  private readonly logger = new Logger(WhatsappService.name);
  private readonly maxRetries = 3;

  constructor(
    private prisma: PrismaService,
    private logsProducer: LogsProducer,
  ) {}

  async processMessage(payload: any) {
    const record = await this.prisma.whatsapp.create({
      data: {
        requestId: payload.requestId,
        to: payload.to,
        body: payload.body,
      },
    });

    await this.logsProducer.publish({
      event: 'whatsapp.received',
      details: record,
      timestamp: new Date().toISOString(),
    });

    await this.attemptSend(record);
  }

  private async attemptSend(record) {
    for (let i = 0; i <= this.maxRetries; i++) {
      await this.logsProducer.publish({
        event: 'whatsapp.attempt',
        attempt: i + 1,
        details: record,
        timestamp: new Date().toISOString(),
      });

      const success = this.simulateSend();

      if (success) {
        await this.prisma.whatsapp.update({
          where: { requestId: record.requestId },
          data: { status: 'sent' },
        });

        await this.logsProducer.publish({
          event: 'whatsapp.sent',
          details: record,
          timestamp: new Date().toISOString(),
        });

        return;
      }

      await this.prisma.whatsapp.update({
        where: { requestId: record.requestId },
        data: { retryCount: i + 1 },
      });

      if (i === this.maxRetries - 1) {
        await this.logsProducer.publish({
          event: 'whatsapp.failed',
          details: record,
          timestamp: new Date().toISOString(),
        });

        return;
      }
    }
  }

  private simulateSend(): boolean {
    return Math.random() > 0.4; // 60% chance success
  }
}
