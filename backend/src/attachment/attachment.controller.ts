import {
  Controller,
  Post,
  Get,
  Param,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Res,
  NotFoundException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AttachmentService } from './attachment.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Response } from 'express';
import * as path from 'path';

@Controller('attachments')
export class AttachmentController {
  constructor(private attachmentService: AttachmentService) {}

  @Post('upload/:versionId')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @Param('versionId') versionId: string,
    @UploadedFile() file: any,
  ) {
    if (!file) {
      throw new NotFoundException('No file uploaded');
    }
    return this.attachmentService.uploadFile(versionId, file);
  }

  @Get('serve/:fileName')
  async serveFile(@Param('fileName') fileName: string, @Res() res: any) {
    try {
      const stream = await this.attachmentService.getFileStream(fileName);
      // Simple mime-type guessing based on file extension
      const ext = path.extname(fileName).toLowerCase();
      let contentType = 'application/octet-stream';
      if (ext === '.pdf') contentType = 'application/pdf';
      else if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
      else if (ext === '.png') contentType = 'image/png';
      else if (ext === '.txt') contentType = 'text/plain';
      else if (ext === '.json') contentType = 'application/json';

      res.setHeader('Content-Type', contentType);
      stream.pipe(res);
    } catch (err) {
      throw new NotFoundException('File not found');
    }
  }

  @Get('download/:id')
  @UseGuards(JwtAuthGuard)
  async downloadFile(@Param('id') id: string, @Res() res: any) {
    const attachment = await this.attachmentService.getAttachment(id);
    const fileNameOnDisk = path.basename(attachment.fileUrl);
    try {
      const stream = await this.attachmentService.getFileStream(fileNameOnDisk);
      res.setHeader('Content-Type', attachment.fileType);
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${attachment.fileName}"`,
      );
      stream.pipe(res);
    } catch (err) {
      throw new NotFoundException('File not found');
    }
  }
}
