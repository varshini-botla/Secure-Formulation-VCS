import { NotificationService } from './notification.service';
export declare class NotificationController {
    private notificationService;
    constructor(notificationService: NotificationService);
    findAll(req: any): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        message: string;
        type: string;
        isRead: boolean;
    }[]>;
    readAll(req: any): Promise<import(".prisma/client").Prisma.BatchPayload>;
    read(id: string, req: any): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        message: string;
        type: string;
        isRead: boolean;
    }>;
}
