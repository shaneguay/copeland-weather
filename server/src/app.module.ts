import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WeatherModule } from './weather/weather.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

/**
 * For this take-home project, I'm just having the same Nest server 'host' the
 * accompanying client React App from its /dist folder.  This is to remove the need
 * to run a second client hosting server just for this simple project.
 * Normally, if its just a simple SPA React (with no SSR required), I'd just host in
 * an simple S3 bucket.
 */

@Module({
  imports: [
    WeatherModule,
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRoot({
      serveRoot: '/',
      rootPath: join(__dirname, '../..', 'client/dist')
    })
  ]
})
export class AppModule { }
