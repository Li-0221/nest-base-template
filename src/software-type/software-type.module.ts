import { Module } from '@nestjs/common';
import { SoftwareTypeService } from './software-type.service';
import { SoftwareTypeController } from './software-type.controller';

@Module({
  controllers: [SoftwareTypeController],
  providers: [SoftwareTypeService],
})
export class SoftwareTypeModule {}
