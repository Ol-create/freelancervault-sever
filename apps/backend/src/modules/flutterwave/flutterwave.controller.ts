import { Controller, Get } from '@nestjs/common';

@Controller('flutterwave')
export class FlutterwaveController {
  // TODO(Phase 1): POST /virtual-accounts, POST /payouts, GET /fx-quote
  @Get()
  placeholder() {
    return { module: 'flutterwave', status: 'not implemented yet' };
  }
}
