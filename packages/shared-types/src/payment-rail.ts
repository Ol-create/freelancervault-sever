import { z } from 'zod';

/** How a freelancer received or is holding money. */
export const PaymentRailSchema = z.enum(['FLUTTERWAVE', 'CRYPTO']);
export type PaymentRail = z.infer<typeof PaymentRailSchema>;

/**
 * Where a ledger entry originated. Distinct from PaymentRail because a
 * single rail can produce multiple transaction shapes (e.g. FLUTTERWAVE
 * covers both inbound collections and outbound payouts).
 */
export const TransactionSourceSchema = z.enum([
  'FLUTTERWAVE_COLLECTION',
  'FLUTTERWAVE_PAYOUT',
  'CRYPTO_DEPOSIT',
  'CRYPTO_WITHDRAWAL',
  'CONVERSION',
]);
export type TransactionSource = z.infer<typeof TransactionSourceSchema>;
