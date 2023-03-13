import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MailerModule } from '@nestjs-modules/mailer';
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static';

import { User } from './user/user.model'
import { FAQ } from './faq/faq.model'
import { Specialization } from './specialization/specialization.model'
import { Traffic } from './traffic/traffic.model'
import { Operator } from './operator/operator.model'
import { Call } from './call/call.model'
import { Review } from './review/review.model'
import { Favorite } from './favorite/favorite.model'
import { Client } from './client/client.model'
import { Bonus } from './bonus/bonus.model'
import { Notification } from './notification/notification.model'
import { Payment } from './payment/payment.model'
import { Withdrawals } from './withdrawals/withdrawals.model'

import { AppGateway } from './app.gateway'

import { UserModule } from './user/user.module'
import { AuthModule } from './auth/auth.module'
import { FAQModule } from './faq/faq.module'
import { GatewayModule }  from './gateway/gateway.module'
import { SpecializationModule } from './specialization/specialization.module'
import { TrafficModule } from './traffic/traffic.module'
import { OperatorModule } from './operator/operator.module'
import { MailModule } from './mailer/mail.module'
import { CallModule } from './call/call.module'
import { ReviewModule } from './review/review.module'
import { FavoriteModule } from './favorite/favorite.module'
import { ClientModule } from './client/client.module'
import { BonusModule } from './bonus/bonus.module'
import { NotificationModule } from './notification/notification.module'
import { AnalyticsModule } from './analytics/analytics.module'
import { PaymentModule } from './payment/payment.module'
import { WithdrawalsModule } from './withdrawals/withdrawals.module'

import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env`,
    }),
    MulterModule.register({
      dest: './uploads'
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'), 
    }),
    MailerModule.forRoot({
      transport: {
        service: process.env.MAILER_SERVICE,
        auth: {
          user: process.env.MAILER_USER,
          pass: process.env.MAILER_PASSWORD,
        },
      },
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      database: process.env.POSTGRES_DB,
      host: process.env.POSTGRES_HOST,
      port: +process.env.POSTGRES_PORT,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRESS_PASSWORD,
      synchronize: true,
      migrationsRun: true, 
      entities: [
        User,
        FAQ,
        Specialization,
        Traffic,
        Operator,
        Call,
        Review,
        Favorite,
        Client,
        Bonus,
        Notification,
        Payment,
        Withdrawals
      ],
      subscribers: ['dist/subscriber/*.js'],
      migrations: ['dist/migration/*.js'],
    }),
    
    GatewayModule,
    UserModule,
    AuthModule,
    FAQModule,
    SpecializationModule,
    TrafficModule,
    OperatorModule,
    MailModule,
    CallModule,
    ReviewModule,
    FavoriteModule,
    ClientModule,
    BonusModule,
    NotificationModule,
    AnalyticsModule,
    PaymentModule,
    WithdrawalsModule
  ],
  providers: [AppModule, AppGateway],
})
export class AppModule {}
