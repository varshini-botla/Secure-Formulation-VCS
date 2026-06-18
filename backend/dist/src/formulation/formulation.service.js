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
exports.FormulationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const client_1 = require("@prisma/client");
let FormulationService = class FormulationService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.$transaction(async (tx) => {
            const formulation = await tx.formulation.create({
                data: {
                    name: data.name,
                    category: data.category,
                    batchSize: data.batchSize,
                    unit: data.unit,
                    ownerId: data.ownerId,
                    status: client_1.FormulationStatus.DRAFT,
                },
            });
            const version = await tx.formulationVersion.create({
                data: {
                    formulationId: formulation.id,
                    versionNumber: '1.0',
                    data: { ingredients: data.ingredients, steps: data.processSteps },
                    createdById: data.ownerId,
                    ingredients: {
                        create: data.ingredients.map((ing) => ({
                            ingredientId: ing.ingredientId,
                            percentage: ing.percentage,
                            weight: ing.weight,
                            unit: ing.unit,
                        })),
                    },
                    processSteps: {
                        create: data.processSteps.map((step, index) => ({
                            stepNumber: index + 1,
                            description: step.description,
                            temperature: step.temperature,
                            pressure: step.pressure,
                            mixingTime: step.mixingTime,
                            phLevel: step.phLevel,
                            notes: step.notes,
                        })),
                    },
                },
            });
            return { formulation, version };
        });
    }
    async updateVersion(params) {
        const { formulationId, userId, changeReason, ingredients, processSteps, isMajor, } = params;
        const lastVersion = await this.prisma.formulationVersion.findFirst({
            where: { formulationId },
            orderBy: { createdAt: 'desc' },
        });
        if (!lastVersion)
            throw new common_1.NotFoundException('No versions found');
        const [major, minor] = lastVersion.versionNumber.split('.').map(Number);
        const nextVersion = isMajor ? `${major + 1}.0` : `${major}.${minor + 1}`;
        await this.prisma.formulation.update({
            where: { id: formulationId },
            data: { status: client_1.FormulationStatus.DRAFT },
        });
        return this.prisma.formulationVersion.create({
            data: {
                formulationId,
                versionNumber: nextVersion,
                changeReason,
                createdById: userId,
                data: { ingredients, steps: processSteps },
                ingredients: {
                    create: ingredients.map((ing) => ({
                        ingredientId: ing.ingredientId,
                        percentage: ing.percentage,
                        weight: ing.weight,
                        unit: ing.unit,
                    })),
                },
                processSteps: {
                    create: processSteps.map((step, index) => ({
                        stepNumber: index + 1,
                        description: step.description,
                        temperature: step.temperature,
                        pressure: step.pressure,
                        mixingTime: step.mixingTime,
                        phLevel: step.phLevel,
                        notes: step.notes,
                    })),
                },
            },
        });
    }
    async update(id, data) {
        return this.prisma.formulation.update({
            where: { id },
            data,
        });
    }
    async remove(id) {
        return this.prisma.formulation.delete({
            where: { id },
        });
    }
    async findAll() {
        return this.prisma.formulation.findMany({
            include: {
                owner: { select: { firstName: true, lastName: true } },
                versions: {
                    orderBy: { createdAt: 'desc' },
                },
            },
            orderBy: { updatedAt: 'desc' },
        });
    }
    async findOne(id) {
        return this.prisma.formulation.findUnique({
            where: { id },
            include: {
                owner: true,
                versions: {
                    orderBy: { createdAt: 'desc' },
                    include: {
                        ingredients: { include: { ingredient: true } },
                        processSteps: true,
                        attachments: true,
                    },
                },
            },
        });
    }
};
exports.FormulationService = FormulationService;
exports.FormulationService = FormulationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FormulationService);
//# sourceMappingURL=formulation.service.js.map