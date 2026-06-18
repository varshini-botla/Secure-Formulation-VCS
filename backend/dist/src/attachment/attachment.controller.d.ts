import { AttachmentService } from './attachment.service';
export declare class AttachmentController {
    private attachmentService;
    constructor(attachmentService: AttachmentService);
    uploadFile(versionId: string, file: any): Promise<{
        id: string;
        fileName: string;
        fileUrl: string;
        fileType: string;
        uploadedAt: Date;
        versionId: string;
    }>;
    serveFile(fileName: string, res: any): Promise<void>;
    downloadFile(id: string, res: any): Promise<void>;
}
