import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { IngredientService } from './ingredient.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('ingredients')
@UseGuards(JwtAuthGuard)
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
  async create(@Body() data) {
    return this.ingredientService.create(data);
  }
}
