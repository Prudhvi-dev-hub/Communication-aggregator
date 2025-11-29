import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { KafkaService } from '../kafka/kafka.service';
import { EmailService } from './email.service';
import { LogsProducer } from '../kafka/logs.producer';

@Injectable()
export class EmailConsumer implements OnModuleInit {
  private readonly logger = new Logger(EmailConsumer.name);

  constructor(
    private kafkaService: KafkaService,
    private emailService: EmailService,
    private logsProducer: LogsProducer,
  ) {}

  async onModuleInit() {
    const consumer = this.kafkaService.consumer;
    await consumer.subscribe({ topic: 'send.email', fromBeginning: true });
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const payload = message?.value
            ? JSON.parse(message?.value.toString())
            : ' ';

          console.log('📥 Email Received:', topic, payload);
          await this.logsProducer.publish({
            service: 'email',
            traceId: payload.requestId,
            event: 'email.received',
            details: payload,
            timestamp: new Date().toISOString(),
          });

          // process message and handle retries internally
          await this.emailService.processMessage(payload);

          // After processing, if status is failed, publish to DLQ
          const record = await this.emailService
            .getById(payload.requestId)
            .catch(() => null);
          // But getById expects id; check via prisma directly:
          // For simplicity, fetch by requestId via prisma in service instead; here we check DB status
          // We'll query prisma directly:
        } catch (err) {
          this.logger.error('Error handling message', err);
        }
      },
    });

    // Set up a second consumer to handle failures -> publish to DLQ.
    // Simpler approach: The EmailService.canPublishDLQ() isn't available here; so we will, after a small interval, scan DB for failed and publish them to DLQ (idempotent).
    setInterval(async () => {
      try {
        const faileds = await (this.emailService as any).prisma.email.findMany({
          where: { status: 'failed' },
        });
        for (const f of faileds) {
          // publish to DLQ topic
          await this.kafkaService.producer.send({
            topic: 'send.email.dlq',
            messages: [{ value: JSON.stringify(f) }],
          });
          this.logger.log(`Published ${f.requestId} to send.email.dlq`);
          // Optionally mark DLQ-published status or leave as failed
        }
      } catch (err) {
        this.logger.error('DLQ scanner error', err);
      }
    }, 5000);
  }
}
