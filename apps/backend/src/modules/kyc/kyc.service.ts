import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

export type KycSubmission = {
  userId: string;
  legalFirstName: string;
  legalLastName: string;
  dateOfBirth: string;
  country: string;
  identityType: 'BVN' | 'NIN' | 'PASSPORT' | 'NATIONAL_ID' | 'DRIVERS_LICENSE';
  identityNumber: string;
  documentReference?: string;
  selfieReference?: string;
};

type KycCase = Omit<KycSubmission, 'identityNumber'> & {
  id: string;
  status: 'PENDING';
  submittedAt: string;
  /** Never return an ID number to the app after intake. */
  identityNumberLastFour: string;
};

/**
 * Vendor-neutral KYC intake. This module deliberately accepts only references
 * to documents uploaded directly to the chosen KYC provider; it must not
 * accept or retain document image bytes in the FreelancerVault API.
 *
 * The current scaffold uses an in-memory store until the team selects a KYC
 * provider and adds the shared persistence layer. It is safe for local demos,
 * but is intentionally not presented as durable compliance storage.
 */
@Injectable()
export class KycService {
  private readonly cases = new Map<string, KycCase>();

  submit(input: KycSubmission): KycCase {
    this.validate(input);
    const id = `kyc_${randomUUID()}`;
    const record: KycCase = {
      id,
      userId: input.userId,
      legalFirstName: input.legalFirstName.trim(),
      legalLastName: input.legalLastName.trim(),
      dateOfBirth: input.dateOfBirth,
      country: input.country,
      identityType: input.identityType,
      documentReference: input.documentReference,
      selfieReference: input.selfieReference,
      identityNumberLastFour: input.identityNumber.slice(-4),
      status: 'PENDING',
      submittedAt: new Date().toISOString(),
    };
    this.cases.set(id, record);
    return record;
  }

  getStatus(id: string): KycCase {
    const record = this.cases.get(id);
    if (!record) throw new NotFoundException('KYC submission was not found');
    return record;
  }

  private validate(input: KycSubmission) {
    if (!input.userId.trim()) throw new BadRequestException('userId is required');
    if (!input.legalFirstName.trim() || !input.legalLastName.trim()) throw new BadRequestException('legal first and last names are required');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(input.dateOfBirth) || Number.isNaN(Date.parse(input.dateOfBirth))) {
      throw new BadRequestException('dateOfBirth must be an ISO date (YYYY-MM-DD)');
    }
    if (!/^[A-Z]{2}$/.test(input.country)) throw new BadRequestException('country must be an ISO 3166-1 alpha-2 code');
    if (input.identityNumber.trim().length < 4) throw new BadRequestException('identityNumber is invalid');
    if (!input.documentReference || !input.selfieReference) {
      throw new BadRequestException('documentReference and selfieReference from the KYC provider are required');
    }
  }
}
