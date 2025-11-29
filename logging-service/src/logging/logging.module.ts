import { Module } from '@nestjs/common';
import { KafkaService } from '../kafka/kafka.service';
import { LogsConsumer } from '../kafka/logs.consumer';
import { ElasticService } from '../elastic-search/elastic.service';

@Module({
  providers: [KafkaService, LogsConsumer, ElasticService],
})
export class LoggingModule {}
