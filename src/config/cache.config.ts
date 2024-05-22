import { Global, Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { env } from './env.config';

export const cacheConfig = CacheModule.registerAsync({
    isGlobal: true,
    useFactory: async () => ({
        store: await redisStore({
            socket: {
                host: env.REDIS.HOST,
                port: env.REDIS.PORT
            }
        })
    })
});

@Global()
@Module({
    exports: [cacheConfig],
    imports: [cacheConfig]
})
export class GlobalCacheModule {}
