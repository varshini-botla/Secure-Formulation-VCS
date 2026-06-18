import { ApprovalService } from './approval.service';
export declare class ApprovalController {
    private approvalService;
    constructor(approvalService: ApprovalService);
    submit(versionId: string, req: any): Promise<{
        formulation: {
            owner: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                password: string;
                firstName: string;
                lastName: string;
                role: import(".prisma/client").$Enums.Role;
                departmentId: string | null;
            };
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
        versions: ({
            ingredients: ({
                ingredient: {
                    id: string;
                    name: string;
                    createdAt: Date;
                    updatedAt: Date;
                    code: string;
                    description: string | null;
                    unit: string;
                };
            } & {
                id: string;
                unit: string;
                percentage: number | null;
                weight: number | null;
                ingredientId: string;
                formulationVersionId: string;
            })[];
            processSteps: {
                id: string;
                description: string;
                stepNumber: number;
                temperature: number | null;
                pressure: number | null;
                mixingTime: number | null;
                phLevel: number | null;
                notes: string | null;
                formulationVersionId: string;
            }[];
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
        })[];
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
