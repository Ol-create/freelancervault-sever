import { Injectable } from '@nestjs/common';

/**
 * Phase 2 (blocked on bmoni_embedded_sdk's native Keystore/Secure Enclave
 * signing being implemented): wallet address registration (proven via a
 * signMessage ownership challenge), chain-monitoring worker watching
 * stablecoin Transfer events, deposit attribution into the ledger.
 * Placeholder for now.
 */
@Injectable()
export class CryptoService {}
