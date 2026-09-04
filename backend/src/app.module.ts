import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService, PartnersInitService } from './app.service';
import { UsersModule } from './users/users.module';
import { User } from './users/user.entity';
import { Partner } from './partners/partner.entity';
import { AuthModule } from './auth/auth.module';
import { TransactionsModule } from './transactions/transactions.module';
import { PartnersModule } from './partners/partners.module';
import { HealthController } from './health/health.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(
      {
        isGlobal: true,
        envFilePath : '.env'
      }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST', 'db'),
        port: configService.get<number>('DB_PORT', 3306),
        username: configService.get<string>('DB_USER', 'root'),
        password: configService.get<string>('DB_PASSWORD', 'root'),
        database: configService.get<string>('DB_NAME', 'survivor'),
        entities: [User, Partner],
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    TypeOrmModule.forFeature([User, Partner]),
    UsersModule,
    AuthModule,
    TransactionsModule,
    PartnersModule,
  ],
  controllers: [AppController, HealthController],
  providers: [
    AppService,
    PartnersInitService
  ],
})
export class AppModule {}