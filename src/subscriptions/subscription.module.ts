import { Module } from '@nestjs/common';
import { PlanController } from './controllers/plan.controller';
import { PlanService } from './services/plan.service';
import { SubscriptionService } from './services/subscription.service';

@Module({
  providers: [SubscriptionService, PlanService],
  exports: [SubscriptionService, PlanService,],
  controllers: [PlanController],
})
export class SubscriptionModule {}
