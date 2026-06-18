import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class AttachmentService {
  private uploadDir = path.join(__dirname, '..', '..', 'uploads');

  constructor(private prisma: PrismaService) {
    // Ensure upload directory exists
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async uploadFile(versionId: string, file: any) {
    const version = await this.prisma.formulationVersion.findUnique({
      where: { id: versionId },
    });
    if (!version) {
      throw new NotFoundException('Formulation version not found');
    }

    const uniqueId = Math.random().toString(36).substring(2, 15);
    const fileName = `${uniqueId}-${file.originalname}`;
    const filePath = path.join(this.uploadDir, fileName);

    // Save file locally
    fs.writeFileSync(filePath, file.buffer);

    // Create attachment record
    return this.prisma.attachment.create({
      data: {
        versionId,
        fileName: file.originalname,
        fileUrl: `/attachments/serve/${fileName}`, // URL path that frontend can fetch/download
        fileType: file.mimetype,
      },
    });
  }

  async getAttachment(id: string) {
    const attachment = await this.prisma.attachment.findUnique({
      where: { id },
    });
    if (!attachment) {
      throw new NotFoundException('Attachment not found');
    }
    return attachment;
  }

  async getFileStream(fileName: string) {
    const filePath = path.join(this.uploadDir, fileName);
    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('File not found on disk');
    }
    return fs.createReadStream(filePath);
  }
}
