import { PrismaService } from '../prisma.service';
export declare class AuditService {
    private prisma;
    constructor(prisma: PrismaService);
    log(data: {
        userId?: string;
        action: string;
        entity: string;
        entityId?: string;
        metadata?: any;
    }): Promise<{
        id: string;
        createdAt: Date;
        userId: string | null;
        action: string;
        entity: string;
        entityId: string | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    findAll(): Promise<({
        user: {
            email: string;
            firstName: string;
            lastName: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        userId: string | null;
        action: string;
        entity: string;
        entityId: string | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
    })[]>;
}
