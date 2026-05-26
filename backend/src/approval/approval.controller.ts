import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApprovalService } from './approval.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role, FormulationStatus } from '@prisma/client';

@Controller('approvals')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ApprovalController {
  constructor(private approvalService: ApprovalService) {}

  @Post('submit/:versionId')
  @Roles(Role.SCIENTIST, Role.ADMIN)
  async submit(@Param('versionId') versionId: string, @Request() req) {
    return this.approvalService.submitForApproval(versionId, req.user.userId);
  }

  @Post('review/:versionId')
  @Roles(Role.QA, Role.ADMIN)
  async review(@Param('versionId') versionId: string, @Body() body, @Request() req) {
    return this.approvalService.approveOrReject({
      versionId,
      qaId: req.user.userId,
      status: body.status, // APPROVED or REJECTED
      comments: body.comments,
    });
  }

  @Get('queue')
  @Roles(Role.QA, Role.ADMIN)
  async getQueue() {
    return this.approvalService.getQueue();
  }
}
