import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class IngredientService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.ingredient.findMany();
  }

  async findOne(id: string) {
    return this.prisma.ingredient.findUnique({ where: { id } });
  }

  async create(data: any) {
    return this.prisma.ingredient.create({ data });
  }
}
