import { Module } from '@nestjs/common';
import { FlutterwaveController } from './flutterwave.controller';
import { FlutterwaveService } from './flutterwave.service';

@Module({
  controllers: [FlutterwaveController],
  providers: [FlutterwaveService],
  exports: [FlutterwaveService],
})
export class FlutterwaveModule {}
