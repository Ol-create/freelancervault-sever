import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthController } from './health/health.controller';
import { AuthModule } from './modules/auth/auth.module';
import { KycModule } from './modules/kyc/kyc.module';
import { FlutterwaveModule } from './modules/flutterwave/flutterwave.module';
import { CryptoModule } from './modules/crypto/crypto.module';
import { LedgerModule } from './modules/ledger/ledger.module';
import { FxModule } from './modules/fx/fx.module';
import { UsersModule } from './modules/users/users.module';
import { WebhooksModule } from './webhooks/webhooks.module';
import { JobsModule } from './jobs/jobs.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    KycModule,
    FlutterwaveModule,
    CryptoModule,
    LedgerModule,
    FxModule,
    UsersModule,
    WebhooksModule,
    JobsModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
