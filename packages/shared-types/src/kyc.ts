import { z } from 'zod';

export const KycStatusSchema = z.enum([
  'NOT_STARTED',
  'PENDING',
  'APPROVED',
  'REJECTED',
]);
export type KycStatus = z.infer<typeof KycStatusSchema>;
