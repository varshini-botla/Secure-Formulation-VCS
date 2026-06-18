import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class DepartmentService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.department.findMany({
      include: {
        _count: {
          select: { users: true, formulations: true },
        },
      },
    });
  }

  async findOne(id: string) {
    const department = await this.prisma.department.findUnique({
      where: { id },
      include: {
        users: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
        formulations: true,
      },
    });
    if (!department) {
      throw new NotFoundException(`Department with ID ${id} not found`);
    }
    return department;
  }

  async create(data: { name: string }) {
    const existing = await this.prisma.department.findUnique({
      where: { name: data.name },
    });
    if (existing) {
      throw new ConflictException('Department with this name already exists');
    }
    return this.prisma.department.create({ data });
  }

  async update(id: string, data: { name: string }) {
    await this.findOne(id);
    const existing = await this.prisma.department.findFirst({
      where: { name: data.name, NOT: { id } },
    });
    if (existing) {
      throw new ConflictException(
        'Another department with this name already exists',
      );
    }
    return this.prisma.department.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.department.delete({
      where: { id },
    });
  }
}
