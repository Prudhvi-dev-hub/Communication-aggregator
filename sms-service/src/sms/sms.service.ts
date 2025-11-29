import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LogsProducer } from '../kafka/logs.producer';

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);
  private readonly maxRetries = 3;

  constructor(
    private prisma: PrismaService,
    private logsProducer: LogsProducer,
  ) {}

  async processMessage(payload: any) {
    const record = await this.prisma.sms.create({
      data: {
        requestId: payload.requestId,
        to: payload.to,
        body: payload.body,
      },
    });

    await this.logsProducer.publish({
      event: 'sms.received',
      details: record,
      timestamp: new Date().toISOString(),
    });

    await this.attemptSend(record);
  }

  private async attemptSend(record) {
    for (let i = 0; i <= this.maxRetries; i++) {
      await this.logsProducer.publish({
        event: 'sms.attempt',
        attempt: i + 1,
        details: record,
        timestamp: new Date().toISOString(),
      });

      const success = await this.simulateSend(record);

      if (success) {
        await this.prisma.sms.update({
          where: { requestId: record.requestId },
          data: { status: 'sent' },
        });

        await this.logsProducer.publish({
          event: 'sms.sent',
          details: record,
          timestamp: new Date().toISOString(),
        });

        return;
      }

      await this.prisma.sms.update({
        where: { requestId: record.requestId },
        data: { retryCount: i + 1 },
      });

      if (i === this.maxRetries - 1) {
        await this.logsProducer.publish({
          event: 'sms.failed',
          details: record,
          timestamp: new Date().toISOString(),
        });

        return;
      }
    }
  }

  private async simulateSend(rec: any): Promise<boolean> {
    // Insert a small delay to simulate network & processing
    await new Promise((r) => setTimeout(r, 300));
    const success = Math.random() >= 0.4;
    this.logger.log(
      `Simulated send for ${rec.requestId} -> ${success ? 'SUCCESS' : 'FAIL'}`,
    );
    return success;
  }
}
