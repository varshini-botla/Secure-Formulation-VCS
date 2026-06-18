import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { FormulationModule } from './formulation/formulation.module';
import { AuditModule } from './audit/audit.module';
import { IngredientModule } from './ingredient/ingredient.module';
import { NotificationModule } from './notification/notification.module';
import { AttachmentModule } from './attachment/attachment.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { DepartmentModule } from './department/department.module';

import { AuditInterceptor } from './audit/audit.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ApprovalModule } from './approval/approval.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UserModule,
    FormulationModule,
    AuditModule,
    IngredientModule,
    ApprovalModule,
    NotificationModule,
    AttachmentModule,
    AnalyticsModule,
    DepartmentModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditInterceptor,
    },
  ],
})
export class AppModule {}
