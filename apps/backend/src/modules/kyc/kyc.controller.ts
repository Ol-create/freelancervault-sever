import { Controller, Get } from '@nestjs/common';

@Controller('kyc')
export class KycController {
  // TODO(Phase 1): POST /submit, GET /status
  @Get()
  placeholder() {
    return { module: 'kyc', status: 'not implemented yet' };
  }
}
