import {
  Controller,
  Get,
  Put,
  Patch,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @Get()
  async findAll(@Request() req) {
    return this.notificationService.findAllForUser(req.user.userId);
  }

  @Put('read-all')
  async readAll(@Request() req) {
    return this.notificationService.markAllAsRead(req.user.userId);
  }

  @Put(':id/read')
  async read(@Param('id') id: string, @Request() req) {
    return this.notificationService.markAsRead(id, req.user.userId);
  }
}
