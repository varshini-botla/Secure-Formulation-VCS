import { ApprovalService } from './approval.service';
export declare class ApprovalController {
    private approvalService;
    constructor(approvalService: ApprovalService);
    submit(versionId: string, req: any): Promise<{
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
    review(versionId: string, body: any, req: any): Promise<{
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
