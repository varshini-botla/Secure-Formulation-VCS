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
exports.AuditInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const audit_service_1 = require("../audit/audit.service");
let AuditInterceptor = class AuditInterceptor {
    auditService;
    constructor(auditService) {
        this.auditService = auditService;
    }
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const { method, url, user, body } = request;
        return next.handle().pipe((0, operators_1.tap)((data) => {
            if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
                this.auditService.log({
                    userId: user?.userId,
                    action: `${method} ${url}`,
                    entity: this.getEntityFromUrl(url),
                    entityId: data?.id || body?.id,
                    metadata: {
                        body,
                        response: data,
                        ip: request.ip,
                        userAgent: request.headers['user-agent'],
                    },
                });
            }
        }));
    }
    getEntityFromUrl(url) {
        if (url.includes('formulations'))
            return 'Formulation';
        if (url.includes('auth'))
            return 'Auth';
        if (url.includes('ingredients'))
            return 'Ingredient';
        if (url.includes('approvals'))
            return 'Approval';
        if (url.includes('users'))
            return 'User';
        if (url.includes('departments'))
            return 'Department';
        return 'System';
    }
};
exports.AuditInterceptor = AuditInterceptor;
exports.AuditInterceptor = AuditInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [audit_service_1.AuditService])
], AuditInterceptor);
//# sourceMappingURL=audit.interceptor.js.map