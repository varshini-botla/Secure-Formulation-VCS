import { AnalyticsService } from './analytics.service';
export declare class AnalyticsController {
    private analyticsService;
    constructor(analyticsService: AnalyticsService);
    getDashboard(): Promise<{
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
}
