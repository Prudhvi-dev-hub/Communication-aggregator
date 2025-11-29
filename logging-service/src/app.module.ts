import { Module } from '@nestjs/common';
import { LoggingModule } from './logging/logging.module';

@Module({
  imports: [LoggingModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
