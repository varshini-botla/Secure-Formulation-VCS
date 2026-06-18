import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { FormulationStatus } from '@prisma/client';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getDashboardData() {
    const totalFormulations = await this.prisma.formulation.count();

    const pendingApprovals = await this.prisma.formulation.count({
      where: {
        status: {
          in: [FormulationStatus.SUBMITTED, FormulationStatus.UNDER_REVIEW],
        },
      },
    });

    const approvedVersions = await this.prisma.formulationVersion.count({
      where: { isApproved: true },
    });

    const complianceRisks = await this.prisma.formulation.count({
      where: { status: FormulationStatus.REJECTED },
    });

    // Recent Audit Logs
    const recentAuditLogs = await this.prisma.auditLog.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { firstName: true, lastName: true, role: true },
        },
      },
    });

    // Formulation Velocity (last 6 months)
    // We fetch versions from the last 6 months and group them by month.
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const versions = await this.prisma.formulationVersion.findMany({
      where: {
        createdAt: { gte: sixMonthsAgo },
      },
      select: { createdAt: true },
    });

    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const velocityMap: { [key: string]: number } = {};

    // Initialize map for the last 6 months
    for (let i = 0; i < 6; i++) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const label = months[d.getMonth()];
      velocityMap[label] = 0;
    }

    versions.forEach((v) => {
      const label = months[v.createdAt.getMonth()];
      if (velocityMap[label] !== undefined) {
        velocityMap[label]++;
      }
    });

    const velocityData = Object.keys(velocityMap)
      .map((name) => ({ name, count: velocityMap[name] }))
      .reverse(); // Standard chronological order

    return {
      stats: {
        total: totalFormulations,
        pending: pendingApprovals,
        approved: approvedVersions,
        risks: complianceRisks,
      },
      recentActivity: recentAuditLogs.map((log) => ({
        id: log.id,
        user: log.user
          ? `${log.user.firstName} ${log.user.lastName}`
          : 'System',
        action: log.action,
        target: log.entity,
        time: this.formatTimeAgo(log.createdAt),
        status: log.action.includes('APPROVED')
          ? 'APPROVED'
          : log.action.includes('SUBMIT')
            ? 'SUBMITTED'
            : 'DRAFT',
      })),
      chartData: velocityData,
    };
  }

  private formatTimeAgo(date: Date): string {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = Math.floor(seconds / 31536000);

    if (interval >= 1) return `${interval}y ago`;
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) return `${interval}mo ago`;
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return `${interval}d ago`;
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return `${interval}h ago`;
    interval = Math.floor(seconds / 60);
    if (interval >= 1) return `${interval}m ago`;
    return 'just now';
  }
}
