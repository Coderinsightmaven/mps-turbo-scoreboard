import { Injectable, OnModuleInit } from '@nestjs/common';
import { Scoreboard } from './scoreboard.interface';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class ScoreboardsService implements OnModuleInit {
  private scoreboards: Scoreboard[] = [];
  private readonly dataFile = path.join(process.cwd(), 'scoreboards-data.json');

  async onModuleInit() {
    await this.loadScoreboardsFromFile();
  }

  private async loadScoreboardsFromFile() {
    try {
      const data = await fs.readFile(this.dataFile, 'utf-8');
      const parsedData = JSON.parse(data);
      // Migrate existing data to simplified format if needed
      this.scoreboards = parsedData.map((scoreboard: any, index: number) => ({
        id: scoreboard.id || (index + 1).toString(),
        name: scoreboard.name || scoreboard.courtname || `Scoreboard ${index + 1}`
      }));
    } catch (error) {
      // If file doesn't exist, initialize with default data
      this.scoreboards = [
        { id: '1', name: 'Scoreboard 1' },
        { id: '2', name: 'Scoreboard 2' },
        { id: '3', name: 'Scoreboard 3' },
      ];
      await this.saveScoreboardsToFile();
    }
  }

  private async saveScoreboardsToFile() {
    try {
      await fs.writeFile(this.dataFile, JSON.stringify(this.scoreboards, null, 2));
    } catch (error) {
      console.error('Failed to save scoreboards to file:', error);
    }
  }

  findAll(): Scoreboard[] {
    return this.scoreboards;
  }

  findOne(id: string): Scoreboard | undefined {
    return this.scoreboards.find(scoreboard => scoreboard.id === id);
  }

  async create(scoreboardName: string): Promise<Scoreboard> {
    const newScoreboard: Scoreboard = {
      id: (this.scoreboards.length + 1).toString(),
      name: scoreboardName,
    };
    this.scoreboards.push(newScoreboard);
    await this.saveScoreboardsToFile();
    return newScoreboard;
  }

  async delete(id: string): Promise<boolean> {
    const index = this.scoreboards.findIndex(scoreboard => scoreboard.id === id);
    if (index !== -1) {
      this.scoreboards.splice(index, 1);
      await this.saveScoreboardsToFile();
      return true;
    }
    return false;
  }
}
