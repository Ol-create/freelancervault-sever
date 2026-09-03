import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { KycService, KycSubmission } from './kyc.service';

@Controller('kyc')
export class KycController {
  constructor(private readonly kyc: KycService) {}

  @Post('submissions')
  submit(@Body() input: KycSubmission) {
    return this.kyc.submit(input);
  }

  @Get('submissions/:id')
  status(@Param('id') id: string) {
    return this.kyc.getStatus(id);
  }
}
