import { BadRequestException, Injectable, NotImplementedException } from '@nestjs/common';

export type FxQuoteRequest = {
  fromCurrency: string;
  toCurrency: string;
  amount: number;
};

/**
 * Conversion is intentionally feature-gated. A quote without an approved
 * counterparty, spread policy, and settlement path must never be invented or
 * shown as executable money movement.
 */
@Injectable()
export class FxService {
  requestQuote(input: FxQuoteRequest) {
    const fromCurrency = input.fromCurrency.toUpperCase();
    const toCurrency = input.toCurrency.toUpperCase();
    if (!/^[A-Z]{3}$/.test(fromCurrency) || !/^[A-Z]{3}$/.test(toCurrency)) {
      throw new BadRequestException('Currencies must be ISO 4217 three-letter codes');
    }
    if (fromCurrency === toCurrency) throw new BadRequestException('Currencies must differ');
    if (!Number.isFinite(input.amount) || input.amount <= 0) throw new BadRequestException('amount must be greater than zero');
    throw new NotImplementedException({
      message: 'FX is not enabled: a licensed counterparty and settlement design are required before executable quotes can be offered.',
      requestedPair: `${fromCurrency}/${toCurrency}`,
    });
  }
}
