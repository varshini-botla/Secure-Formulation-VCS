import { PrismaService } from '../prisma.service';
export declare class NotificationService {
    private prisma;
    constructor(prisma: PrismaService);
    findAllForUser(userId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        message: string;
        type: string;
        isRead: boolean;
    }[]>;
    create(data: {
        userId: string;
        message: string;
        type: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        message: string;
        type: string;
        isRead: boolean;
    }>;
    markAsRead(id: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        message: string;
        type: string;
        isRead: boolean;
    }>;
    markAllAsRead(userId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
}
