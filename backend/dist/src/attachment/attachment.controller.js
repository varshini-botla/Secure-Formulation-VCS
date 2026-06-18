"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttachmentController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const attachment_service_1 = require("./attachment.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const path = __importStar(require("path"));
let AttachmentController = class AttachmentController {
    attachmentService;
    constructor(attachmentService) {
        this.attachmentService = attachmentService;
    }
    async uploadFile(versionId, file) {
        if (!file) {
            throw new common_1.NotFoundException('No file uploaded');
        }
        return this.attachmentService.uploadFile(versionId, file);
    }
    async serveFile(fileName, res) {
        try {
            const stream = await this.attachmentService.getFileStream(fileName);
            const ext = path.extname(fileName).toLowerCase();
            let contentType = 'application/octet-stream';
            if (ext === '.pdf')
                contentType = 'application/pdf';
            else if (ext === '.jpg' || ext === '.jpeg')
                contentType = 'image/jpeg';
            else if (ext === '.png')
                contentType = 'image/png';
            else if (ext === '.txt')
                contentType = 'text/plain';
            else if (ext === '.json')
                contentType = 'application/json';
            res.setHeader('Content-Type', contentType);
            stream.pipe(res);
        }
        catch (err) {
            throw new common_1.NotFoundException('File not found');
        }
    }
    async downloadFile(id, res) {
        const attachment = await this.attachmentService.getAttachment(id);
        const fileNameOnDisk = path.basename(attachment.fileUrl);
        try {
            const stream = await this.attachmentService.getFileStream(fileNameOnDisk);
            res.setHeader('Content-Type', attachment.fileType);
            res.setHeader('Content-Disposition', `attachment; filename="${attachment.fileName}"`);
            stream.pipe(res);
        }
        catch (err) {
            throw new common_1.NotFoundException('File not found');
        }
    }
};
exports.AttachmentController = AttachmentController;
__decorate([
    (0, common_1.Post)('upload/:versionId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.Param)('versionId')),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AttachmentController.prototype, "uploadFile", null);
__decorate([
    (0, common_1.Get)('serve/:fileName'),
    __param(0, (0, common_1.Param)('fileName')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AttachmentController.prototype, "serveFile", null);
__decorate([
    (0, common_1.Get)('download/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AttachmentController.prototype, "downloadFile", null);
exports.AttachmentController = AttachmentController = __decorate([
    (0, common_1.Controller)('attachments'),
    __metadata("design:paramtypes", [attachment_service_1.AttachmentService])
], AttachmentController);
//# sourceMappingURL=attachment.controller.js.map