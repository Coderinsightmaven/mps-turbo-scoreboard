import { Controller, Get, Param, Query } from '@nestjs/common';
import { CourtsService } from './courts.service';
import { Court } from './court.interface';

@Controller('courts')
export class CourtsController {
  constructor(private readonly courtsService: CourtsService) {}

  @Get()
  findAll(@Query('status') status?: string, @Query('type') type?: string): Court[] {
    if (status) {
      return this.courtsService.findByStatus(status);
    }
    if (type) {
      return this.courtsService.findByType(type);
    }
    return this.courtsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Court | undefined {
    return this.courtsService.findOne(id);
  }
}
