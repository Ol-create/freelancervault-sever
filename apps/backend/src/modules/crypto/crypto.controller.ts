import { Controller, Get } from '@nestjs/common';

@Controller('crypto')
export class CryptoController {
  // TODO(Phase 2): POST /wallet/register-address, GET /deposit-address,
  // POST /withdrawals/prepare, POST /withdrawals/submit
  @Get()
  placeholder() {
    return { module: 'crypto', status: 'not implemented yet' };
  }
}
