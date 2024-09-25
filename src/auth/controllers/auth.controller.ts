import { Controller, Post, Body, UseGuards, Request, Get, UseInterceptors, UsePipes, ValidationPipe, Put, Delete, BadRequestException } from '@nestjs/common';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { AuthService } from '../services/auth.service';
import { Transaction } from 'neo4j-driver';
import { Neo4jTransactionInterceptor } from '~neo4j/interceptors/neo4j-transaction.interceptor';
import { STATUS_ACTIVE, SubscriptionService } from '~subscriptions/services/subscription.service';
import { UserService } from '~users/services/user.service';
import { CreateUserDto } from '~users/dtos/create-user.dto';

@Controller('auth')
export class AuthController {

    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService,
        private readonly subscriptionService: SubscriptionService
    ) { }

    @UseInterceptors(Neo4jTransactionInterceptor)
    @UsePipes(ValidationPipe)
    @Post('register')
    async postRegister(@Body() createUserDto: CreateUserDto, @Request() req) {
        const transaction: Transaction = req.transaction

        const user = await this.userService.create(
            transaction,
            createUserDto
        )

        await this.subscriptionService.createSubscription(transaction, user, '1', 7, STATUS_ACTIVE)

        const { access_token } = await this.authService.createToken(user)

        return {
            ...user.toJson(),
            access_token
        }
    }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async postLogin(@Request() request) {
        const user = request.user
        const { access_token } = await this.authService.createToken(request.user)

        return {
            ...user.toJson(),
            access_token
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get('user')
    async getUser(@Request() request) {
        const { access_token } = await this.authService.createToken(request.user)

        return {
            ...request.user.toJson(),
            access_token,
        }
    }

    @UseGuards(JwtAuthGuard)
    @Delete('user/subscription')
    async cancelSubscription(@Request() request) {
        if ( !request.user.subscription ) throw new BadRequestException('No active subscriptions for this user')

        await this.subscriptionService.cancelSubscription(request.user.subscription.id)

        return true
    }
}
