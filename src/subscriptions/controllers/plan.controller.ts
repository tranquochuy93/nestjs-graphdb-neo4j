import { Controller, Get } from "@nestjs/common";
import { PlanService } from "../services/plan.service";
import { Plan } from "neo4j-driver";

@Controller('plans')
export class PlanController {

    constructor(private readonly planService: PlanService) {}

    @Get('/')
    async getList() {
        const plans = await this.planService.getPlans();
        return plans => plans.map(p => p.toJson())
    }

}