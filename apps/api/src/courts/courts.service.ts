import { Injectable, OnModuleInit } from '@nestjs/common';
import { Court } from './court.interface';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class CourtsService implements OnModuleInit {
  private courts: Court[] = [];
  private readonly dataFile = path.join(process.cwd(), 'courts-data.json');

  async onModuleInit() {
    await this.loadCourtsFromFile();
  }

  private async loadCourtsFromFile() {
    try {
      const data = await fs.readFile(this.dataFile, 'utf-8');
      const parsedData = JSON.parse(data);
      // Migrate existing data to simplified format if needed
      this.courts = parsedData.map((court: any, index: number) => ({
        id: court.id || (index + 1).toString(),
        name: court.name || court.courtname || `Court ${index + 1}`
      }));
    } catch (error) {
      // If file doesn't exist, initialize with default data
      this.courts = [
        { id: '1', name: 'Court A' },
        { id: '2', name: 'Court B' },
        { id: '3', name: 'Court C' },
      ];
      await this.saveCourtsToFile();
    }
  }

  private async saveCourtsToFile() {
    try {
      await fs.writeFile(this.dataFile, JSON.stringify(this.courts, null, 2));
    } catch (error) {
      console.error('Failed to save courts to file:', error);
    }
  }

  findAll(): Court[] {
    return this.courts;
  }

  findOne(id: string): Court | undefined {
    return this.courts.find(court => court.id === id);
  }


  async create(courtName: string): Promise<Court> {
    const newCourt: Court = {
      id: (this.courts.length + 1).toString(),
      name: courtName,
    };
    this.courts.push(newCourt);
    await this.saveCourtsToFile();
    return newCourt;
  }

  async delete(id: string): Promise<boolean> {
    const index = this.courts.findIndex(court => court.id === id);
    if (index !== -1) {
      this.courts.splice(index, 1);
      await this.saveCourtsToFile();
      return true;
    }
    return false;
  }
}
