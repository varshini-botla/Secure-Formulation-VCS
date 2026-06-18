import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { FormulationStatus, Prisma } from '@prisma/client';

@Injectable()
export class FormulationService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    name: string;
    category?: string;
    batchSize?: number;
    unit?: string;
    ownerId: string;
    ingredients: any[];
    processSteps: any[];
  }) {
    return this.prisma.$transaction(async (tx) => {
      const formulation = await tx.formulation.create({
        data: {
          name: data.name,
          category: data.category,
          batchSize: data.batchSize,
          unit: data.unit,
          ownerId: data.ownerId,
          status: FormulationStatus.DRAFT,
        },
      });

      const version = await tx.formulationVersion.create({
        data: {
          formulationId: formulation.id,
          versionNumber: '1.0',
          data: { ingredients: data.ingredients, steps: data.processSteps },
          createdById: data.ownerId,
          ingredients: {
            create: data.ingredients.map((ing) => ({
              ingredientId: ing.ingredientId,
              percentage: ing.percentage,
              weight: ing.weight,
              unit: ing.unit,
            })),
          },
          processSteps: {
            create: data.processSteps.map((step, index) => ({
              stepNumber: index + 1,
              description: step.description,
              temperature: step.temperature,
              pressure: step.pressure,
              mixingTime: step.mixingTime,
              phLevel: step.phLevel,
              notes: step.notes,
            })),
          },
        },
      });

      return { formulation, version };
    });
  }

  async updateVersion(params: {
    formulationId: string;
    userId: string;
    changeReason: string;
    ingredients: any[];
    processSteps: any[];
    isMajor?: boolean;
  }) {
    const {
      formulationId,
      userId,
      changeReason,
      ingredients,
      processSteps,
      isMajor,
    } = params;

    const lastVersion = await this.prisma.formulationVersion.findFirst({
      where: { formulationId },
      orderBy: { createdAt: 'desc' },
    });

    if (!lastVersion) throw new NotFoundException('No versions found');

    // Calculate next version number
    const [major, minor] = lastVersion.versionNumber.split('.').map(Number);
    const nextVersion = isMajor ? `${major + 1}.0` : `${major}.${minor + 1}`;

    // Reset formulation status to DRAFT when a new version is created
    await this.prisma.formulation.update({
      where: { id: formulationId },
      data: { status: FormulationStatus.DRAFT },
    });

    return this.prisma.formulationVersion.create({
      data: {
        formulationId,
        versionNumber: nextVersion,
        changeReason,
        createdById: userId,
        data: { ingredients, steps: processSteps },
        ingredients: {
          create: ingredients.map((ing) => ({
            ingredientId: ing.ingredientId,
            percentage: ing.percentage,
            weight: ing.weight,
            unit: ing.unit,
          })),
        },
        processSteps: {
          create: processSteps.map((step, index) => ({
            stepNumber: index + 1,
            description: step.description,
            temperature: step.temperature,
            pressure: step.pressure,
            mixingTime: step.mixingTime,
            phLevel: step.phLevel,
            notes: step.notes,
          })),
        },
      },
    });
  }

  async update(
    id: string,
    data: {
      name?: string;
      category?: string;
      batchSize?: number;
      unit?: string;
      status?: FormulationStatus;
    },
  ) {
    return this.prisma.formulation.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.formulation.delete({
      where: { id },
    });
  }

  async findAll() {
    return this.prisma.formulation.findMany({
      include: {
        owner: { select: { firstName: true, lastName: true } },
        versions: {
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.formulation.findUnique({
      where: { id },
      include: {
        owner: true,
        versions: {
          orderBy: { createdAt: 'desc' },
          include: {
            ingredients: { include: { ingredient: true } },
            processSteps: true,
            attachments: true,
          },
        },
      },
    });
  }
}
