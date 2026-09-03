import { Injectable } from '@nestjs/common';

/**
 * Single source of truth for balances: append-only ledger entries, derived
 * unified balances and transaction history across both rails (Flutterwave
 * fiat + crypto). All credits/debits from other modules flow through here.
 * Placeholder for now — Phase 1 scopes this to fiat only.
 */
@Injectable()
export class LedgerService {}
