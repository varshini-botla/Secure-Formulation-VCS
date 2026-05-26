import { PrismaService } from '../prisma.service';
import { FormulationStatus } from '@prisma/client';
export declare class ApprovalService {
    private prisma;
    constructor(prisma: PrismaService);
    submitForApproval(versionId: string, scientistId: string): Promise<{
        formulation: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            departmentId: string | null;
            unit: string | null;
            status: import(".prisma/client").$Enums.FormulationStatus;
            category: string | null;
            batchSize: number | null;
            ownerId: string;
        };
    } & {
        id: string;
        createdAt: Date;
        data: import("@prisma/client/runtime/library").JsonValue;
        versionNumber: string;
        changeReason: string | null;
        isApproved: boolean;
        isLocked: boolean;
        createdById: string;
        formulationId: string;
    }>;
    approveOrReject(params: {
        versionId: string;
        qaId: string;
        status: FormulationStatus;
        comments?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.FormulationStatus;
        versionId: string;
        qaId: string;
        comments: string | null;
    }>;
    getQueue(): Promise<({
        owner: {
            firstName: string;
            lastName: string;
        };
        versions: {
            id: string;
            createdAt: Date;
            data: import("@prisma/client/runtime/library").JsonValue;
            versionNumber: string;
            changeReason: string | null;
            isApproved: boolean;
            isLocked: boolean;
            createdById: string;
            formulationId: string;
        }[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        departmentId: string | null;
        unit: string | null;
        status: import(".prisma/client").$Enums.FormulationStatus;
        category: string | null;
        batchSize: number | null;
        ownerId: string;
    })[]>;
}
