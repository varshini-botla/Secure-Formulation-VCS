import { Module } from '@nestjs/common';
import { FormulationService } from './formulation.service';
import { FormulationController } from './formulation.controller';

@Module({
  providers: [FormulationService],
  controllers: [FormulationController],
})
export class FormulationModule {}
