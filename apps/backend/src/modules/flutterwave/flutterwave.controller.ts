import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { FlutterwaveService, PayoutRequest, VirtualAccountRequest } from './flutterwave.service';

@Controller('flutterwave')
export class FlutterwaveController {
  constructor(private readonly flutterwave: FlutterwaveService) {}

  @Post('virtual-accounts')
  createVirtualAccount(@Body() input: VirtualAccountRequest) {
    return this.flutterwave.createVirtualAccount(input);
  }

  @Post('payouts')
  createPayout(@Body() input: PayoutRequest) {
    return this.flutterwave.createPayout(input);
  }

  @Get('banks')
  listBanks(@Query('country') country?: string) {
    return this.flutterwave.listBanks(country ?? 'NG');
  }
}
