import { Controller, Get } from '@nestjs/common';

@Controller('ledger')
export class LedgerController {
  // TODO(Phase 1): GET /balances, GET /transactions
  @Get()
  placeholder() {
    return { module: 'ledger', status: 'not implemented yet' };
  }
}
