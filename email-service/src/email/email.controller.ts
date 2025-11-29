import { Controller, Get, Param } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller()
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Get('health')
  health() {
    return { status: 'email-service-running' };
  }

  @Get('emails')
  list() {
    return this.emailService.listAll();
  }

  @Get('emails/:id')
  getById(@Param('id') id: string) {
    return this.emailService.getById(id);
  }
}
