import { Controller, Get, Post, Delete, Param, Query, Body, UseGuards } from '@nestjs/common';
import { CourtsService } from './courts.service';
import type { Court } from './court.interface';
import { ApiKeyGuard } from '../auth/api-key.guard';

@Controller('courts')
@UseGuards(ApiKeyGuard)
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

  @Post()
  create(@Body() courtData: Omit<Court, 'id' | 'createdAt' | 'updatedAt'>): Court {
    return this.courtsService.create(courtData);
  }

  @Delete(':id')
  delete(@Param('id') id: string): { success: boolean; message: string } {
    const success = this.courtsService.delete(id);
    return {
      success,
      message: success ? 'Court deleted successfully' : 'Court not found'
    };
  }
}
