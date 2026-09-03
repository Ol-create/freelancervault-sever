import { Controller, Get } from '@nestjs/common';

@Controller('fx')
export class FxController {
  // TODO(Phase 3): POST /quote, POST /convert
  @Get()
  placeholder() {
    return { module: 'fx', status: 'not implemented yet' };
  }
}
