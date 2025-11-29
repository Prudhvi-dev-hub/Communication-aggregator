import { Module } from '@nestjs/common';
import { RouterModule } from './router/router.module';

@Module({
  imports: [RouterModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
