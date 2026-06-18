import { PrismaService } from '../prisma.service';
import * as fs from 'fs';
export declare class AttachmentService {
    private prisma;
    private uploadDir;
    constructor(prisma: PrismaService);
    uploadFile(versionId: string, file: any): Promise<{
        id: string;
        fileName: string;
        fileUrl: string;
        fileType: string;
        uploadedAt: Date;
        versionId: string;
    }>;
    getAttachment(id: string): Promise<{
        id: string;
        fileName: string;
        fileUrl: string;
        fileType: string;
        uploadedAt: Date;
        versionId: string;
    }>;
    getFileStream(fileName: string): Promise<fs.ReadStream>;
}
