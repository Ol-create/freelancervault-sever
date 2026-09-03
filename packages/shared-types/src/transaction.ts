import { z } from 'zod';
import { PaymentRailSchema, TransactionSourceSchema } from './payment-rail';

export const TransactionStatusSchema = z.enum([
  'PENDING',
  'COMPLETED',
  'FAILED',
  'REVERSED',
]);
export type TransactionStatus = z.infer<typeof TransactionStatusSchema>;

export const TransactionDirectionSchema = z.enum(['CREDIT', 'DEBIT']);
export type TransactionDirection = z.infer<typeof TransactionDirectionSchema>;

/**
 * Normalized shape for both rails so the unified transaction history (and
 * ledger) never has to special-case Flutterwave vs. on-chain events.
 * `amount` is a decimal string (never a float) to avoid precision loss
 * across the wire and in Postgres numeric columns.
 */
export const TransactionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  rail: PaymentRailSchema,
  source: TransactionSourceSchema,
  direction: TransactionDirectionSchema,
  currency: z.string().min(1),
  amount: z.string(),
  status: TransactionStatusSchema,
  /** Flutterwave transaction reference, or on-chain tx hash. */
  externalReference: z.string().nullable(),
  metadata: z.record(z.string(), z.unknown()).optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
export type Transaction = z.infer<typeof TransactionSchema>;
