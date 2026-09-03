import { Module } from '@nestjs/common';

/**
 * Phase 1: POST /webhooks/flutterwave — must verify the `verif-hash` header
 * against FLW_SECRET_HASH on a raw (unparsed) body before trusting the
 * payload, respond 200 fast, and process asynchronously via a queue. This
 * is the highest-risk correctness/security surface in the backend.
 */
@Module({})
export class WebhooksModule {}
