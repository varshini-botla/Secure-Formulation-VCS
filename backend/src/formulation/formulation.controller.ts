import { Controller, Get, Post, Body, Param, UseGuards, Request, Put } from '@nestjs/common';
import { FormulationService } from './formulation.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@Controller('formulations')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FormulationController {
  constructor(private formulationService: FormulationService) {}

  @Post()
  @Roles(Role.SCIENTIST, Role.ADMIN)
  async create(@Body() createDto, @Request() req) {
    return this.formulationService.create({
      ...createDto,
      ownerId: req.user.userId,
    });
  }

  @Get()
  async findAll() {
    return this.formulationService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.formulationService.findOne(id);
  }

  @Post(':id/version')
  @Roles(Role.SCIENTIST, Role.ADMIN)
  async createVersion(@Param('id') id: string, @Body() updateDto, @Request() req) {
    return this.formulationService.updateVersion({
      formulationId: id,
      userId: req.user.userId,
      ...updateDto,
    });
  }
}
