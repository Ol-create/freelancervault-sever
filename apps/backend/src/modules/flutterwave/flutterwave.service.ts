import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'node:crypto';

export type VirtualAccountRequest = {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  currency: 'NGN' | 'GHS';
  accountType: 'static' | 'dynamic';
  amount?: number;
  expirySeconds?: number;
  narration?: string;
  bankCode?: string;
  bvn?: string;
  nin?: string;
};

export type PayoutRequest = {
  amount: number;
  currency: 'NGN' | 'GHS';
  accountBank: string;
  accountNumber: string;
  beneficiaryName: string;
  narration?: string;
  reference?: string;
};

/**
 * Owns outbound calls to Flutterwave only. Webhook authentication and ledger
 * posting deliberately remain outside this module: a provider response is
 * never evidence that money has settled.
 */
@Injectable()
export class FlutterwaveService {
  private readonly baseUrl: string;

  constructor(private readonly config: ConfigService) {
    this.baseUrl = (this.config.get<string>('FLW_API_BASE_URL') ?? 'https://api.flutterwave.com/v3').replace(/\/$/, '');
  }

  async createVirtualAccount(input: VirtualAccountRequest) {
    this.validateVirtualAccount(input);
    const reference = `fv-va-${randomUUID()}`;
    const body: Record<string, unknown> = {
      email: input.email,
      firstname: input.firstName,
      lastname: input.lastName,
      phonenumber: input.phoneNumber,
      currency: input.currency,
      amount: input.accountType === 'static' ? 0 : input.amount,
      tx_ref: reference,
      is_permanent: input.accountType === 'static',
      narration: input.narration ?? `${input.firstName} ${input.lastName}`,
      bank_code: input.bankCode ?? '090567',
      bvn: input.bvn,
      nin: input.nin,
      expires: input.accountType === 'dynamic' ? input.expirySeconds : undefined,
    };

    const response = await this.request('/virtual-account-numbers', 'POST', body, reference);
    return { reference, provider: 'flutterwave', account: response };
  }

  async createPayout(input: PayoutRequest) {
    if (!Number.isFinite(input.amount) || input.amount <= 0) {
      throw new BadRequestException('amount must be greater than zero');
    }
    if (!/^\d{10,18}$/.test(input.accountNumber)) {
      throw new BadRequestException('accountNumber must contain 10 to 18 digits');
    }

    const reference = input.reference ?? `fv-po-${randomUUID()}`;
    const response = await this.request('/transfers', 'POST', {
      account_bank: input.accountBank,
      account_number: input.accountNumber,
      amount: input.amount,
      currency: input.currency,
      narration: input.narration ?? 'FreelancerVault withdrawal',
      beneficiary_name: input.beneficiaryName,
      reference,
      debit_currency: input.currency,
    }, reference);
    return { reference, provider: 'flutterwave', payout: response };
  }

  async listBanks(country = 'NG') {
    if (!/^[A-Z]{2}$/.test(country)) {
      throw new BadRequestException('country must be a two-letter ISO country code');
    }
    return this.request(`/banks/${country}`, 'GET');
  }

  private validateVirtualAccount(input: VirtualAccountRequest) {
    if (!/^\S+@\S+\.\S+$/.test(input.email)) throw new BadRequestException('email is invalid');
    if (!input.firstName.trim() || !input.lastName.trim()) throw new BadRequestException('firstName and lastName are required');
    if (input.accountType === 'dynamic' && (!Number.isFinite(input.amount) || (input.amount ?? 0) <= 0)) {
      throw new BadRequestException('dynamic accounts require an amount greater than zero');
    }
    if (input.accountType === 'dynamic' && input.expirySeconds !== undefined && (input.expirySeconds < 60 || input.expirySeconds > 5_270_401)) {
      throw new BadRequestException('expirySeconds must be between 60 and 5270401');
    }
    if (input.accountType === 'static' && input.currency === 'NGN' && !input.bvn && !input.nin) {
      throw new BadRequestException('static NGN accounts require either bvn or nin');
    }
  }

  private async request(path: string, method: 'GET' | 'POST', body?: unknown, idempotencyKey?: string): Promise<unknown> {
    const secretKey = this.config.get<string>('FLW_SECRET_KEY');
    if (!secretKey || secretKey.includes('xxxxxxxx')) {
      throw new ServiceUnavailableException('Flutterwave is not configured; set FLW_SECRET_KEY');
    }
    let response: Response;
    try {
      response = await fetch(`${this.baseUrl}${path}`, {
        method,
        headers: {
          Authorization: `Bearer ${secretKey}`,
          Accept: 'application/json',
          ...(body ? { 'Content-Type': 'application/json' } : {}),
          ...(idempotencyKey ? { 'X-Idempotency-Key': idempotencyKey } : {}),
        },
        ...(body ? { body: JSON.stringify(body) } : {}),
      });
    } catch {
      throw new BadGatewayException('Flutterwave could not be reached');
    }
    const payload: unknown = await response.json().catch(() => ({ message: 'Non-JSON provider response' }));
    if (!response.ok) {
      throw new BadGatewayException({ message: 'Flutterwave rejected the request', providerStatus: response.status, providerResponse: payload });
    }
    return payload;
  }
}
