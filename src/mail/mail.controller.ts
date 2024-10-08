import { Body, Controller, Post } from '@nestjs/common';
import { MailService } from './mail.service';
import { Public } from 'src/decorators/public.decorator';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Public()
  @Post('/send-recover-email')
  async sendRecoverPasswordEmail(
    @Body('email') email: string
  ): Promise<{ message: string }> {
    await this.mailService.sendRecoverPasswordEmail(email);
    return {
      message: 'The password recovery email has been sent.',
    };
  }
}
