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
      this.courts = JSON.parse(data);
    } catch (error) {
      // If file doesn't exist, initialize with default data
      this.courts = [
        {
          id: '1',
          name: 'Court A',
          location: 'Main Building',
          status: 'available',
          type: 'indoor',
          capacity: 4,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
        },
        {
          id: '2',
          name: 'Court B',
          location: 'Main Building',
          status: 'occupied',
          type: 'indoor',
          capacity: 4,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-15'),
        },
        {
          id: '3',
          name: 'Outdoor Court 1',
          location: 'Backyard',
          status: 'available',
          type: 'outdoor',
          capacity: 2,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
        },
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

  findByStatus(status: string): Court[] {
    return this.courts.filter(court => court.status === status);
  }

  findByType(type: string): Court[] {
    return this.courts.filter(court => court.type === type);
  }

  async create(courtData: Omit<Court, 'id' | 'createdAt' | 'updatedAt'>): Promise<Court> {
    const newCourt: Court = {
      ...courtData,
      id: (this.courts.length + 1).toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
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
