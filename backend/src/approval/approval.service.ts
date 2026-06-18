import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { FormulationStatus, Role } from '@prisma/client';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class ApprovalService {
  constructor(
    private prisma: PrismaService,
    private notificationService: NotificationService,
  ) {}

  async submitForApproval(versionId: string, scientistId: string) {
    const version = await this.prisma.formulationVersion.findUnique({
      where: { id: versionId },
      include: { formulation: { include: { owner: true } } },
    });

    if (!version) throw new NotFoundException('Version not found');

    // Update formulation status
    await this.prisma.formulation.update({
      where: { id: version.formulationId },
      data: { status: FormulationStatus.SUBMITTED },
    });

    // Notify all QA users
    const qas = await this.prisma.user.findMany({
      where: { role: Role.QA },
    });

    const scientistName = `${version.formulation.owner.firstName} ${version.formulation.owner.lastName}`;
    for (const qa of qas) {
      await this.notificationService.create({
        userId: qa.id,
        message: `Formulation "${version.formulation.name}" (v${version.versionNumber}) submitted for approval by ${scientistName}.`,
        type: 'APPROVAL_REQUEST',
      });
    }

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
      include: { formulation: { include: { owner: true } } },
    });

    if (!version) throw new NotFoundException('Version not found');

    const qaUser = await this.prisma.user.findUnique({ where: { id: qaId } });
    const qaName = qaUser ? `${qaUser.firstName} ${qaUser.lastName}` : 'QA';

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

    // Notify the scientist (owner)
    await this.notificationService.create({
      userId: version.formulation.ownerId,
      message: `Your formulation "${version.formulation.name}" (v${version.versionNumber}) was ${status} by ${qaName}.${comments ? ` Reason: ${comments}` : ''}`,
      type:
        status === FormulationStatus.APPROVED
          ? 'VERSION_APPROVED'
          : 'VERSION_REJECTED',
    });

    return approval;
  }

  async getQueue() {
    return this.prisma.formulation.findMany({
      where: {
        status: {
          in: [FormulationStatus.SUBMITTED, FormulationStatus.UNDER_REVIEW],
        },
      },
      include: {
        owner: { select: { firstName: true, lastName: true } },
        versions: {
          orderBy: { createdAt: 'desc' },
          include: {
            ingredients: { include: { ingredient: true } },
            processSteps: true,
          },
        },
      },
    });
  }
}
