import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LogsProducer } from '../kafka/logs.producer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly MAX_RETRIES = 3;

  constructor(
    private prisma: PrismaService,
    private logsProducer: LogsProducer,
  ) {}

  async listAll() {
    return this.prisma.email.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async getById(id: string) {
    return this.prisma.email.findUnique({ where: { id } });
  }

  async processMessage(payload: any) {
    const { requestId, to, subject, body } = payload;
    // Deduplication: if requestId exists and was sent, skip
    const existing = await this.prisma.email.findUnique({
      where: { requestId },
    });
    if (existing) {
      // If already processed as sent, ignore duplicates
      if (existing.status === 'sent') {
        await this.logsProducer.publish({
          service: 'email',
          traceId: requestId,
          event: 'email.duplicate',
          details: { requestId },
          timestamp: new Date().toISOString(),
        });
        return;
      }
      // else continue processing existing record
    } else {
      await this.prisma.email.create({
        data: {
          requestId,
          to,
          subject,
          body,
          retryCount: 0,
          status: 'pending',
        },
      });
    }

    // Run the send flow with retries
    await this.attemptSend(requestId);
  }

  private async attemptSend(requestId: string) {
    const rec = await this.prisma.email.findUnique({ where: { requestId } });
    if (!rec) return;

    let retryCount = rec.retryCount;

    while (retryCount < this.MAX_RETRIES && rec.status !== 'sent') {
      await this.logsProducer.publish({
        service: 'email',
        traceId: requestId,
        event: 'email.attempt',
        details: { attempt: retryCount + 1 },
        timestamp: new Date().toISOString(),
      });

      const success = await this.simulateSend(rec);
      if (success) {
        await this.prisma.email.update({
          where: { requestId },
          data: { status: 'sent', retryCount: retryCount },
        });
        await this.logsProducer.publish({
          service: 'email',
          traceId: requestId,
          event: 'email.sent',
          details: { requestId, to: rec.to },
          timestamp: new Date().toISOString(),
        });
        return;
      } else {
        retryCount++;
        await this.prisma.email.update({
          where: { requestId },
          data: { retryCount },
        });
        await this.logsProducer.publish({
          service: 'email',
          traceId: requestId,
          event: 'email.retry',
          details: { attempt: retryCount },
          timestamp: new Date().toISOString(),
        });
      }
    }

    // After retries exhausted
    if (retryCount >= this.MAX_RETRIES) {
      await this.prisma.email.update({
        where: { requestId },
        data: { status: 'failed' },
      });
      await this.logsProducer.publish({
        service: 'email',
        traceId: requestId,
        event: 'email.failed',
        details: { requestId },
        timestamp: new Date().toISOString(),
      });

      // publish to DLQ
      await this.logsProducer.publish({
        service: 'email',
        traceId: requestId,
        event: 'email.publish_dlq',
        details: { requestId },
        timestamp: new Date().toISOString(),
      });
      // actual DLQ publish will be done by EmailConsumer (it has access to kafka producer)
    }
  }

  // Simulate sending; 20% chance of failure
  private async simulateSend(rec: any): Promise<boolean> {
    // Insert a small delay to simulate network & processing
    await new Promise((r) => setTimeout(r, 300));
    const success = Math.random() >= 0.2;
    this.logger.log(
      `Simulated send for ${rec.requestId} -> ${success ? 'SUCCESS' : 'FAIL'}`,
    );
    return success;
  }
}
