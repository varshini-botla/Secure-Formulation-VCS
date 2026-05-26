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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApprovalController = void 0;
const common_1 = require("@nestjs/common");
const approval_service_1 = require("./approval.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const client_1 = require("@prisma/client");
let ApprovalController = class ApprovalController {
    approvalService;
    constructor(approvalService) {
        this.approvalService = approvalService;
    }
    async submit(versionId, req) {
        return this.approvalService.submitForApproval(versionId, req.user.userId);
    }
    async review(versionId, body, req) {
        return this.approvalService.approveOrReject({
            versionId,
            qaId: req.user.userId,
            status: body.status,
            comments: body.comments,
        });
    }
    async getQueue() {
        return this.approvalService.getQueue();
    }
};
exports.ApprovalController = ApprovalController;
__decorate([
    (0, common_1.Post)('submit/:versionId'),
    (0, roles_decorator_1.Roles)(client_1.Role.SCIENTIST, client_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('versionId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ApprovalController.prototype, "submit", null);
__decorate([
    (0, common_1.Post)('review/:versionId'),
    (0, roles_decorator_1.Roles)(client_1.Role.QA, client_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('versionId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ApprovalController.prototype, "review", null);
__decorate([
    (0, common_1.Get)('queue'),
    (0, roles_decorator_1.Roles)(client_1.Role.QA, client_1.Role.ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ApprovalController.prototype, "getQueue", null);
exports.ApprovalController = ApprovalController = __decorate([
    (0, common_1.Controller)('approvals'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [approval_service_1.ApprovalService])
], ApprovalController);
//# sourceMappingURL=approval.controller.js.map