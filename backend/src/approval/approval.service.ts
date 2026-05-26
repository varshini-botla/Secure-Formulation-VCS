import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { FormulationStatus } from '@prisma/client';

@Injectable()
export class ApprovalService {
  constructor(private prisma: PrismaService) {}

  async submitForApproval(versionId: string, scientistId: string) {
    const version = await this.prisma.formulationVersion.findUnique({
      where: { id: versionId },
      include: { formulation: true },
    });

    if (!version) throw new NotFoundException('Version not found');

    // Update formulation status
    await this.prisma.formulation.update({
      where: { id: version.formulationId },
      data: { status: FormulationStatus.SUBMITTED },
    });

    return version;
  }

  async approveOrReject(params: {
    versionId: string;
    qaId: string;
    status: FormulationStatus;
    comments?: string;
  }) {
    const { versionId, qaId, status, comments } = params;

    const version = await this.prisma.formulationVersion.findUnique({
      where: { id: versionId },
      include: { formulation: true },
    });

    if (!version) throw new NotFoundException('Version not found');

    // Update formulation status
    await this.prisma.formulation.update({
      where: { id: version.formulationId },
      data: { status: status },
    });

    // Create approval record
    const approval = await this.prisma.approval.create({
      data: {
        versionId,
        qaId,
        status,
        comments,
      },
    });

    // If approved, lock the version
    if (status === FormulationStatus.APPROVED) {
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
        status: { in: [FormulationStatus.SUBMITTED, FormulationStatus.UNDER_REVIEW] },
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
}
