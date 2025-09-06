import { Controller, Get, Post, Delete, Param, Query, Body, UseGuards } from '@nestjs/common';
import { CourtsService } from './courts.service';
import type { Court } from './court.interface';
import { ApiKeyGuard } from '../auth/api-key.guard';

@Controller('courts')
@UseGuards(ApiKeyGuard)
export class CourtsController {
  constructor(private readonly courtsService: CourtsService) {}

  @Get()
  findAll(): Court[] {
    return this.courtsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Court | undefined {
    return this.courtsService.findOne(id);
  }

  @Post()
  async create(@Body() body: { name: string }): Promise<Court> {
    return this.courtsService.create(body.name);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<{ success: boolean; message: string }> {
    const success = await this.courtsService.delete(id);
    return {
      success,
      message: success ? 'Court deleted successfully' : 'Court not found'
    };
  }
}
