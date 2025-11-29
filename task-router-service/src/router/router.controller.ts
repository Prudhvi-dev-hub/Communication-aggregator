import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { RouterService } from './router.service';
import { SendMessageDto } from './dto/create-message.dto';

@Controller('route')
export class RouterController {
  constructor(private routerService: RouterService) {}

  @Post()
  async send(@Body(new ValidationPipe()) body: SendMessageDto) {
    return this.routerService.routeMessage(body);
  }
}
