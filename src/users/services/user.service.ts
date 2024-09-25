import { Injectable, NotFoundException } from '@nestjs/common';
import { Node, types, Transaction } from 'neo4j-driver'
import { Neo4jService } from '../../neo4j/services/neo4j.service';
import { User } from '../entities/user.entity';
import { STATUS_ACTIVE } from '../../subscriptions/services/subscription.service';
import { Subscription } from '../../subscriptions/entities/subscription.entity';
import { compare, hash } from 'bcrypt';
import { CreateUserDto } from '~users/dtos/create-user.dto';

@Injectable()
export class UserService {

    constructor(
        private readonly neo4jService: Neo4jService,
    ) {}

    async hash(plain: string): Promise<string> {
        return hash(plain, 10)
    }

    async compare(plain: string, encrypted: string): Promise<boolean> {
        return compare(plain, encrypted)
    }

    private hydrate(res): User {
        if ( !res.records.length ) {
            return undefined
        }

        const user = res.records[0].get('u')
        const subscription = res.records[0].get('subscription')

        return new User(
            user,
            subscription ? new Subscription(subscription.subscription, subscription.plan) : undefined
        )
    }

    async findByEmail(email: string): Promise<User | undefined> {
        const res = await this.neo4jService.read(`
            MATCH (u:User {email: $email})
            RETURN u,
                [ (u)-[:PURCHASED]->(s)-[:FOR_PLAN]->(p) WHERE s.expiresAt > datetime() AND s.status = $status | {subscription: s, plan: p } ][0] As subscription
        `, { email, status: STATUS_ACTIVE })

        return this.hydrate(res)
    }

    async create(databaseOrTransaction: string | Transaction, createUserDto: CreateUserDto): Promise<User> {
        const res = await this.neo4jService.write(`
            CREATE (u:User)
            SET u += $properties, u.id = randomUUID()
            RETURN u,
                [ (u)-[:PURCHASED]->(s)-[:FOR_PLAN]->(p) WHERE s.expiresAt > datetime() AND s.status = $status | {subscription: s, plan: p } ][0] As subscription
        `, {
            properties: {
                ...createUserDto,
                dateOfBirth: new Date(createUserDto.dateOfBirth),
                password: await this.hash(createUserDto.password),
            },
            status: STATUS_ACTIVE,
        }, databaseOrTransaction)

        return this.hydrate(res)
    }

}
