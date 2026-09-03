import { z } from 'zod';
import { PaymentRailSchema } from './payment-rail';

/** One row of the unified balance view: a currency/asset held on a given rail. */
export const BalanceSchema = z.object({
  currency: z.string().min(1),
  rail: PaymentRailSchema,
  amount: z.string(),
});
export type Balance = z.infer<typeof BalanceSchema>;

export const BalancesResponseSchema = z.array(BalanceSchema);
export type BalancesResponse = z.infer<typeof BalancesResponseSchema>;
