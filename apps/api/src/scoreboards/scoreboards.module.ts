import { Module } from '@nestjs/common';
import { ScoreboardsController } from './scoreboards.controller';
import { ScoreboardsService } from './scoreboards.service';

@Module({
  controllers: [ScoreboardsController],
  providers: [ScoreboardsService],
  exports: [ScoreboardsService],
})
export class ScoreboardsModule {}
