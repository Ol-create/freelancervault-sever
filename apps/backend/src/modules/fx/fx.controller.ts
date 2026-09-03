import { Body, Controller, Post } from '@nestjs/common';
import { FxQuoteRequest, FxService } from './fx.service';

@Controller('fx')
export class FxController {
  constructor(private readonly fx: FxService) {}

  @Post('quotes')
  quote(@Body() input: FxQuoteRequest) {
    return this.fx.requestQuote(input);
  }
}
