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
exports.ApprovalService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const client_1 = require("@prisma/client");
let ApprovalService = class ApprovalService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async submitForApproval(versionId, scientistId) {
        const version = await this.prisma.formulationVersion.findUnique({
            where: { id: versionId },
            include: { formulation: true },
        });
        if (!version)
            throw new common_1.NotFoundException('Version not found');
        await this.prisma.formulation.update({
            where: { id: version.formulationId },
            data: { status: client_1.FormulationStatus.SUBMITTED },
        });
        return version;
    }
    async approveOrReject(params) {
        const { versionId, qaId, status, comments } = params;
        const version = await this.prisma.formulationVersion.findUnique({
            where: { id: versionId },
            include: { formulation: true },
        });
        if (!version)
            throw new common_1.NotFoundException('Version not found');
        await this.prisma.formulation.update({
            where: { id: version.formulationId },
            data: { status: status },
        });
        const approval = await this.prisma.approval.create({
            data: {
                versionId,
                qaId,
                status,
                comments,
            },
        });
        if (status === client_1.FormulationStatus.APPROVED) {
            await this.prisma.formulationVersion.update({
                where: { id: versionId },
                data: { isApproved: true, isLocked: true },
            });
        }
        return approval;
    }
    async getQueue() {
        return this.prisma.formulation.findMany({
            where: {
                status: { in: [client_1.FormulationStatus.SUBMITTED, client_1.FormulationStatus.UNDER_REVIEW] },
            },
            include: {
                owner: { select: { firstName: true, lastName: true } },
                versions: {
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                },
            },
        });
    }
};
exports.ApprovalService = ApprovalService;
exports.ApprovalService = ApprovalService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ApprovalService);
//# sourceMappingURL=approval.service.js.map