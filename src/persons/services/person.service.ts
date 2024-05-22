import { Injectable } from '@nestjs/common';
import { Transaction } from 'neo4j-driver'
import { Neo4jService } from '../../neo4j/services/neo4j.service';
import { Person } from '~persons/entities/person.entity';

@Injectable()
export class PersonService {

    constructor(
        private readonly neo4jService: Neo4jService,
    ) {}

    private hydrate(res): Person {
        if ( !res.records.length ) {
            return undefined
        }

        const person = res.records[0].get('p')

        return new Person(
            person,
        )
    }

    async findByName(name: string): Promise<Person | undefined> {
        const res = await this.neo4jService.read(`
            MATCH (p:Person {name: $name})
            RETURN p
        `, { name })

        return this.hydrate(res)
    }

    async create(databaseOrTransaction: string | Transaction, name: string, gender: string, number: string): Promise<Person> {
        const res = await this.neo4jService.write(`
            CREATE (p:Person)
            SET p += $properties, p.id = randomUUID()
            RETURN u
        `, {
            properties: {
               name,
               gender,
               number
            },
        }, databaseOrTransaction)

        return this.hydrate(res)
    }
}
