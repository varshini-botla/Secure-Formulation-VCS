import { Module } from '@nestjs/common';
import { ApprovalService } from './approval.service';
import { ApprovalController } from './approval.controller';
import { PrismaModule } from '../prisma.module';
import { NotificationModule } from '../notification/notification.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [PrismaModule, NotificationModule, UserModule],
  providers: [ApprovalService],
  controllers: [ApprovalController],
})
export class ApprovalModule {}
