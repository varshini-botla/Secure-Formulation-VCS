import { PrismaService } from '../prisma.service';
export declare class AnalyticsService {
    private prisma;
    constructor(prisma: PrismaService);
    getDashboardData(): Promise<{
        stats: {
            total: number;
            pending: number;
            approved: number;
            risks: number;
        };
        recentActivity: {
            id: string;
            user: string;
            action: string;
            target: string;
            time: string;
            status: string;
        }[];
        chartData: {
            name: string;
            count: number;
        }[];
    }>;
    private formatTimeAgo;
}
