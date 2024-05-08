import { Module } from '@nestjs/common';
import { CacheModule, CacheInterceptor } from '@nestjs/cache-manager';
import { HttpModule } from '@nestjs/axios';
import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';

@Module({
    imports: [
        HttpModule.register({ timeout: 5000 }),
        CacheModule.register({ ttl: 15000, max: 20 })
    ],
    controllers: [WeatherController],
    providers: [WeatherService]
})
export class WeatherModule { }
