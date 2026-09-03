import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FlutterwaveController } from './flutterwave.controller';
import { FlutterwaveService } from './flutterwave.service';

@Module({
  imports: [ConfigModule],
  controllers: [FlutterwaveController],
  providers: [FlutterwaveService],
  exports: [FlutterwaveService],
})
export class FlutterwaveModule {}
