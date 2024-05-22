import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { AppController } from '~app.controller';
import { AppService } from '~app.service';
import { GlobalCacheModule } from '~config/cache.config';
import { databaseConfig } from '~config/database.config';
import { i18nConfig } from '~config/i18n.config';
import { HttpExceptionFilter } from '~core/filters/http-exception.filter';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Neo4jModule } from '~neo4j/neo4j.module';
import { UserModule } from '~users/user.module';
import { SubscriptionModule } from '~subscriptions/subscription.module';
import { Neo4jConfig } from '~neo4j/interfaces/neo4j-config.interface';
import { AuthModule } from 'auth/auth.module';

@Module({
    imports: [
        // databaseConfig,
        i18nConfig,
        // GlobalCacheModule,
        ConfigModule.forRoot({
            isGlobal: true
        }),
        Neo4jModule.forRootAsync({
            imports: [ ConfigModule ],
            inject: [ ConfigService ],
            useFactory: (configService: ConfigService) : Neo4jConfig => ({
                scheme: configService.get('NEO4J_SCHEME'),
                host: configService.get('NEO4J_HOST'),
                port: configService.get('NEO4J_PORT'),
                username: configService.get('NEO4J_USERNAME'),
                password: configService.get('NEO4J_PASSWORD'),
                database: configService.get('NEO4J_DATABASE'),
            })
        }),
        UserModule,
        SubscriptionModule,
        AuthModule
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_FILTER,
            useClass: HttpExceptionFilter
        }
    ]
})
export class AppModule {}
