import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { IngredientService } from './ingredient.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@Controller('ingredients')
@UseGuards(JwtAuthGuard, RolesGuard)
export class IngredientController {
  constructor(private ingredientService: IngredientService) {}

  @Get()
  async findAll() {
    return this.ingredientService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.ingredientService.findOne(id);
  }

  @Post()
  @Roles(Role.SCIENTIST, Role.ADMIN)
  async create(@Body() data) {
    return this.ingredientService.create(data);
  }

  @Put(':id')
  @Roles(Role.SCIENTIST, Role.ADMIN)
  async update(@Param('id') id: string, @Body() data) {
    return this.ingredientService.update(id, data);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  async remove(@Param('id') id: string) {
    return this.ingredientService.remove(id);
  }
}
