import { Controller, Get, Post, Delete, Param, Query, Body, UseGuards } from '@nestjs/common';
import { ScoreboardsService } from './scoreboards.service';
import type { Scoreboard } from './scoreboard.interface';
import { ApiKeyGuard } from '../auth/api-key.guard';

@Controller('scoreboards')
@UseGuards(ApiKeyGuard)
export class ScoreboardsController {
  constructor(private readonly scoreboardsService: ScoreboardsService) {}

  @Get()
  findAll(): Scoreboard[] {
    return this.scoreboardsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Scoreboard | undefined {
    return this.scoreboardsService.findOne(id);
  }

  @Post()
  async create(@Body() body: { name: string }): Promise<Scoreboard> {
    return this.scoreboardsService.create(body.name);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<{ success: boolean; message: string }> {
    const success = await this.scoreboardsService.delete(id);
    return {
      success,
      message: success ? 'Scoreboard deleted successfully' : 'Scoreboard not found'
    };
  }
}
