import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';
export declare class FormulationService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: {
        name: string;
        category?: string;
        batchSize?: number;
        unit?: string;
        ownerId: string;
        ingredients: any[];
        processSteps: any[];
    }): Promise<{
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
        version: {
            id: string;
            createdAt: Date;
            data: Prisma.JsonValue;
            versionNumber: string;
            changeReason: string | null;
            isApproved: boolean;
            isLocked: boolean;
            createdById: string;
            formulationId: string;
        };
    }>;
    updateVersion(params: {
        formulationId: string;
        userId: string;
        changeReason: string;
        ingredients: any[];
        processSteps: any[];
        isMajor?: boolean;
    }): Promise<{
        id: string;
        createdAt: Date;
        data: Prisma.JsonValue;
        versionNumber: string;
        changeReason: string | null;
        isApproved: boolean;
        isLocked: boolean;
        createdById: string;
        formulationId: string;
    }>;
    findAll(): Promise<({
        owner: {
            firstName: string;
            lastName: string;
        };
        versions: {
            id: string;
            createdAt: Date;
            data: Prisma.JsonValue;
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
    findOne(id: string): Promise<({
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
            data: Prisma.JsonValue;
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
    }) | null>;
}
