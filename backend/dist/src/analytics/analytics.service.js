"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const client_1 = require("@prisma/client");
let AnalyticsService = class AnalyticsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDashboardData() {
        const totalFormulations = await this.prisma.formulation.count();
        const pendingApprovals = await this.prisma.formulation.count({
            where: {
                status: {
                    in: [client_1.FormulationStatus.SUBMITTED, client_1.FormulationStatus.UNDER_REVIEW],
                },
            },
        });
        const approvedVersions = await this.prisma.formulationVersion.count({
            where: { isApproved: true },
        });
        const complianceRisks = await this.prisma.formulation.count({
            where: { status: client_1.FormulationStatus.REJECTED },
        });
        const recentAuditLogs = await this.prisma.auditLog.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: { firstName: true, lastName: true, role: true },
                },
            },
        });
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
        const velocityMap = {};
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
            .reverse();
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
    formatTimeAgo(date) {
        const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
        let interval = Math.floor(seconds / 31536000);
        if (interval >= 1)
            return `${interval}y ago`;
        interval = Math.floor(seconds / 2592000);
        if (interval >= 1)
            return `${interval}mo ago`;
        interval = Math.floor(seconds / 86400);
        if (interval >= 1)
            return `${interval}d ago`;
        interval = Math.floor(seconds / 3600);
        if (interval >= 1)
            return `${interval}h ago`;
        interval = Math.floor(seconds / 60);
        if (interval >= 1)
            return `${interval}m ago`;
        return 'just now';
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map